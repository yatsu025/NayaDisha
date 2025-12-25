import { NextResponse } from 'next/server'

// LibreTranslate API endpoint (you can use public instance or self-hosted)
const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com/translate'

export async function POST(request) {
  try {
    const { q, source, target } = await request.json()

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

    // Call LibreTranslate API
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
      })
    })

    if (!response.ok) {
      throw new Error('Translation API failed')
    }

    const data = await response.json()
    
    return NextResponse.json({
      translatedText: data.translatedText || q
    })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Translation failed', translatedText: request.body?.q },
      { status: 500 }
    )
  }
}
