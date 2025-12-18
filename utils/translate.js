// Translation utility using LibreTranslate API

export async function translateText(text, targetLang, sourceLang = 'en') {
  if (targetLang === 'en' || !text) return text
  if (process.env.NEXT_PUBLIC_DISABLE_TRANSLATION === 'true') return text

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang
      })
    })

    const data = await response.json()
    return data.translatedText || text
  } catch (error) {
    console.error('Translation error:', error)
    return text
  }
}

export async function translateLesson(lessonId, targetLang) {
  if (targetLang === 'en') return null
  if (process.env.NEXT_PUBLIC_DISABLE_TRANSLATION === 'true') return null

  try {
    const response = await fetch(`/api/translate/lesson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, targetLang })
    })

    return await response.json()
  } catch (error) {
    console.error('Lesson translation error:', error)
    return null
  }
}
