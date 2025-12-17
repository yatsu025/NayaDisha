"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { Play } from "lucide-react"

function LessonContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') || 'theory'
  const [showEnglish, setShowEnglish] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
      }
    }
    checkUser()
  }, [router])

  const lessonContent = {
    english: {
      title: "Data Structures: Lists",
      content: `Lists are one of the most versatile data structures in Python. They allow you to store multiple items in a single variable.

Key Features:
• Ordered - items maintain their position
• Mutable - can be changed after creation
• Allow duplicates - same value can appear multiple times

Example:
fruits = ["apple", "banana", "cherry"]
print(fruits[0])  # Output: apple

You can add items using append():
fruits.append("orange")

And remove items using remove():
fruits.remove("banana")`
    },
    hindi: {
      title: "डेटा संरचनाएं: सूचियाँ",
      content: `सूचियाँ Python में सबसे बहुमुखी डेटा संरचनाओं में से एक हैं। वे आपको एक ही चर में कई आइटम संग्रहीत करने की अनुमति देती हैं।

मुख्य विशेषताएं:
• क्रमबद्ध - आइटम अपनी स्थिति बनाए रखते हैं
• परिवर्तनशील - निर्माण के बाद बदला जा सकता है
• डुप्लिकेट की अनुमति - एक ही मान कई बार प्रकट हो सकता है

उदाहरण:
fruits = ["apple", "banana", "cherry"]
print(fruits[0])  # आउटपुट: apple

आप append() का उपयोग करके आइटम जोड़ सकते हैं:
fruits.append("orange")

और remove() का उपयोग करके आइटम हटा सकते हैं:
fruits.remove("banana")`
    }
  }

  const content = showEnglish ? lessonContent.english : lessonContent.hindi

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/skill-path" className="text-2xl font-bold text-[#2956D9]">NayaDisha</Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowEnglish(!showEnglish)}
              className="bg-[#2956D9] hover:bg-[#1a3a8a] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Switch to {showEnglish ? "हिंदी" : "English"}
            </button>
            <Link href="/skill-path" className="text-gray-600 hover:text-[#2956D9]">← Back</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {mode === 'video' ? (
          <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center justify-center min-h-[400px]">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{lessonContent.english.title} (Video Lesson)</h1>
            <div className="w-full max-w-3xl aspect-video bg-gray-900 rounded-xl flex items-center justify-center relative group cursor-pointer">
              <Play size={64} className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-sm bg-black/50 p-2 rounded">
                Video playback is simulated for this demo.
              </div>
            </div>
            <button 
              onClick={() => router.push(`/lesson/${params.id}?mode=theory`)}
              className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors"
            >
              📖 Switch to Theory
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
          {/* Left Panel - English */}
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-500 uppercase">English</h2>
              {showEnglish && <span className="text-[#2956D9]">●</span>}
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{lessonContent.english.title}</h1>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 font-sans">{lessonContent.english.content}</pre>
            </div>
          </div>

          {/* Right Panel - Selected Language */}
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-500 uppercase">
                {showEnglish ? "हिंदी" : "English"}
              </h2>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{lessonContent.hindi.title}</h1>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 font-sans">{lessonContent.hindi.content}</pre>
            </div>
          </div>
        </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Link href="/skill-path">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg transition-colors">
              ← Previous
            </button>
          </Link>
          <Link href={`/quiz/${params.id}`}>
            <button className="bg-[#FFC947] hover:bg-[#e6b33f] text-[#2956D9] font-bold px-6 py-3 rounded-lg transition-colors">
              Take Quiz →
            </button>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function LessonPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2956D9]"></div>
    </div>}>
      <LessonContent />
    </Suspense>
  )
}
