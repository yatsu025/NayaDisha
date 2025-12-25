import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function slugifyField(fieldName) {
  const base = (fieldName || "").toLowerCase()
    .replace(/developer|engineer|expert|specialist/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return base || "general"
}

function isValidRoadmapJson(obj) {
  if (!obj || typeof obj !== "object") return false
  if (typeof obj.slug !== "string" || !obj.slug) return false
  if (typeof obj.title !== "string" || !obj.title) return false
  if (!Array.isArray(obj.levels)) return false
  if (obj.levels.length === 0 || obj.levels.length > 15) return false
  for (const lv of obj.levels) {
    if (typeof lv.level_no !== "number") return false
    if (typeof lv.title !== "string" || !lv.title) return false
    if (typeof lv.short_description !== "string") return false
  }
  return true
}

async function callGeminiForRoadmap(apiKey, fieldName) {
  const prompt = `
You are an API that generates learning roadmaps.

Generate a beginner-friendly learning roadmap for the field: ${fieldName}

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanation
- No extra text
- Max 15 levels

JSON FORMAT:
{
  "slug": "<lowercase-short-slug>",
  "title": "<Roadmap Title>",
  "levels": [
    {
      "level_no": 1,
      "title": "Level title",
      "short_description": "One-line description"
    }
  ]
}

IMPORTANT:
- Do NOT include theory content
- Do NOT include video links
- Keep titles simple and industry-aligned
  `.trim()

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      response_mime_type: "application/json",
    },
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    return null
  }

  const data = await res.json()
  // Extract text JSON from candidates
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) return null
  try {
    const parsed = JSON.parse(text)
    return parsed
  } catch {
    return null
  }
}

async function syncToLessons(slug, levels) {
  const lessonsToUpsert = levels.map(lv => ({
    id: `${slug}-level-${lv.level_no}`,
    title: lv.title,
    english_content: lv.short_description || "Content coming soon...",
    level: lv.level_no,
    category: 'priority',
    skill_tag: slug,
    xp_reward: 100
  }))
  
  const { error } = await supabase.from('lessons').upsert(lessonsToUpsert, { onConflict: 'id' })
  if (error) console.error("Error syncing lessons:", error)
}

export async function POST(req) {
  try {
    const { field } = await req.json()
    if (!field || typeof field !== "string") {
      return NextResponse.json({ error: "Invalid field" }, { status: 400 })
    }

    const slug = slugifyField(field)

    // 1) If roadmap exists, return it with levels (max 15)
    const { data: roadmap } = await admin
      .from("roadmaps")
      .select("*")
      .eq("slug", slug)
      .single()

    if (roadmap) {
      const { data: levels } = await admin
        .from("levels")
        .select("level_no,title,short_description,is_active")
        .eq("roadmap_id", roadmap.id)
        .eq("is_active", true)
        .order("level_no", { ascending: true })
      const trimmed = (levels || []).slice(0, 15).map(l => ({
        level_no: l.level_no,
        title: l.title,
        short_description: l.short_description || "",
      }))
      return NextResponse.json({
        slug,
        title: roadmap.title,
        levels: trimmed,
      })
    }

    // 2) Call Gemini to generate roadmap
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      // Fallback: generate a simple default set if API key missing
      const fallback = {
        slug,
        title: `${field} Roadmap`,
        levels: [
          { level_no: 1, title: "Basics", short_description: "Start with fundamentals" },
          { level_no: 2, title: "Tools Setup", short_description: "Install and configure tooling" },
          { level_no: 3, title: "Core Concepts", short_description: "Learn key concepts" },
          { level_no: 4, title: "Hands-on Practice", short_description: "Build small projects" },
          { level_no: 5, title: "Project", short_description: "Build a portfolio project" },
        ],
      }
      // Insert fallback into Supabase
      const { data: newRoadmap } = await admin
        .from("roadmaps")
        .insert({ slug, title: fallback.title })
        .select("*")
        .single()
      for (const lv of fallback.levels) {
        await admin
          .from("levels")
          .insert({
            roadmap_id: newRoadmap.id,
            level_no: lv.level_no,
            title: lv.title,
            short_description: lv.short_description,
            theory_status: "pending",
            is_active: true,
          })
      }
      return NextResponse.json(fallback)
    }

    const aiJson = await callGeminiForRoadmap(apiKey, field)
    if (!isValidRoadmapJson(aiJson)) {
      return NextResponse.json({ error: "Invalid AI response" }, { status: 500 })
    }

    // Force slug to our computed slug
    aiJson.slug = slug
    aiJson.title = aiJson.title || `${field} Roadmap`
    aiJson.levels = (aiJson.levels || []).slice(0, 15)

    // 3) Insert into Supabase
    const { data: createdRoadmap, error: roadmapErr } = await admin
      .from("roadmaps")
      .insert({ slug, title: aiJson.title })
      .select("*")
      .single()

    if (roadmapErr) {
      return NextResponse.json({ error: "Failed to create roadmap" }, { status: 500 })
    }

    for (const lv of aiJson.levels) {
      await admin
        .from("levels")
        .insert({
          roadmap_id: createdRoadmap.id,
          level_no: lv.level_no,
          title: lv.title,
          short_description: lv.short_description || "",
          theory_status: "pending",
          is_active: true,
        })
    }

    await syncToLessons(admin, slug, aiJson.levels)

    // Return the generated roadmap JSON
    return NextResponse.json(aiJson)
  } catch (e) {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 })
  }
}
