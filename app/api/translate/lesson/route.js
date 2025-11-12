import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com/translate'

export async function POST(request) {
  try {
    const { lessonId, targetLang } = await request.json()

    if (!lessonId || !targetLang) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If target is English, fetch original lesson
    if (targetLang === 'en') {
      const { data: lesson } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single()

      return NextResponse.json({
        title: lesson.title,
        content: lesson.english_content
      })
    }

    // Check if translation exists in cache
    const { data: cached } = await supabase
      .from('translations')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('lang', targetLang)
      .single()

    if (cached) {
      return NextResponse.json({
        title: cached.translated_title,
        content: cached.translated_text,
        cached: true
      })
    }

    // Fetch original lesson
    const { data: lesson } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single()

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Translate title
    const titleResponse = await fetch(LIBRETRANSLATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: lesson.title,
        source: 'en',
        target: targetLang,
        format: 'text'
      })
    })
    const titleData = await titleResponse.json()

    // Translate content
    const contentResponse = await fetch(LIBRETRANSLATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: lesson.english_content,
        source: 'en',
        target: targetLang,
        format: 'text'
      })
    })
    const contentData = await contentResponse.json()

    const translatedTitle = titleData.translatedText || lesson.title
    const translatedContent = contentData.translatedText || lesson.english_content

    // Cache translation
    await supabase
      .from('translations')
      .insert({
        lesson_id: lessonId,
        lang: targetLang,
        translated_title: translatedTitle,
        translated_text: translatedContent
      })

    return NextResponse.json({
      title: translatedTitle,
      content: translatedContent,
      cached: false
    })
  } catch (error) {
    console.error('Lesson translation error:', error)
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
}
