import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
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

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 200 })
    }
    const supabase = createClient(url, key)

    if (targetLang === 'en' || process.env.DISABLE_TRANSLATION === 'true' || process.env.NEXT_PUBLIC_DISABLE_TRANSLATION === 'true') {
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

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    let translatedTitle = lesson.title
    let translatedContent = lesson.english_content
    try {
      const titleResponse = await fetch(LIBRETRANSLATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: lesson.title,
          source: 'en',
          target: targetLang,
          format: 'text'
        }),
        signal: controller.signal
      })
      const titleData = titleResponse.ok ? await titleResponse.json() : null
      translatedTitle = titleData?.translatedText || lesson.title

      const contentResponse = await fetch(LIBRETRANSLATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: lesson.english_content,
          source: 'en',
          target: targetLang,
          format: 'text'
        }),
        signal: controller.signal
      })
      const contentData = contentResponse.ok ? await contentResponse.json() : null
      translatedContent = contentData?.translatedText || lesson.english_content
    } catch (e) {
      clearTimeout(timeout)
    }
    clearTimeout(timeout)

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
    return NextResponse.json({ error: 'Translation failed' }, { status: 200 })
  }
}
