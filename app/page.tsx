"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function LandingPage() {
  const router = useRouter()
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push("/dashboard")
      }
    }
    checkUser()
  }, [router])

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
    { code: "te", name: "తెలుగు" },
    { code: "ta", name: "தமிழ்" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2956D9] to-[#1a3a8a] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <h1 className="text-6xl font-bold text-[#2956D9] mb-4">NayaDisha</h1>
          <p className="text-2xl text-gray-700 mb-8">
            Har student ke future ko ek nayi disha.
          </p>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full max-w-xs mx-auto px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#2956D9] focus:outline-none"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => router.push("/login")}
            className="bg-[#FFC947] hover:bg-[#e6b33f] text-[#2956D9] font-bold text-xl px-12 py-4 rounded-full transition-colors shadow-lg"
          >
            Start Learning
          </button>
        </div>
      </div>
    </div>
  )
}
