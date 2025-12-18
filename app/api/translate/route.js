import { NextResponse } from 'next/server'

// LibreTranslate API endpoint (you can use public instance or self-hosted)
const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com/translate'

export async function POST(request) {
  try {
    const payload = await request.json()
    const { q, source, target } = payload

    if (!q || !target) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If target is English, return original text
    if (target === 'en') {
      return NextResponse.json({ translatedText: q })
    }

    if (process.env.DISABLE_TRANSLATION === 'true' || process.env.NEXT_PUBLIC_DISABLE_TRANSLATION === 'true') {
      return NextResponse.json({ translatedText: q })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)
    try {
      const response = await fetch(LIBRETRANSLATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q,
          source: source || 'en',
          target,
          format: 'text'
        }),
        signal: controller.signal
      })
      clearTimeout(timeout)

      if (!response.ok) {
        return NextResponse.json({ translatedText: q })
      }

      const data = await response.json()
      return NextResponse.json({
        translatedText: data.translatedText || q
      })
    } catch (e) {
      clearTimeout(timeout)
      return NextResponse.json({ translatedText: q })
    }
  } catch (error) {
    return NextResponse.json({ translatedText: '' })
  }
}
