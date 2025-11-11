"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
      } else {
        setUser(user)
      }
      setLoading(false)
    }
    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }
  const userStats = {
    name: "Alex Johnson",
    confidenceScore: 72,
    xp: 2450,
    level: 3,
    continueLearning: {
      title: "Advanced Python",
      progress: 65,
      lessonNumber: 5,
    },
    recentSkills: [
      { title: "Web Development", xpEarned: 250 },
      { title: "Data Structures", xpEarned: 180 },
      { title: "JavaScript Basics", xpEarned: 150 },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#2956D9]">NayaDisha</h1>
          <div className="flex items-center gap-4">
            <Link href="/profile" className="text-gray-600 hover:text-[#2956D9]">Profile</Link>
            <button onClick={handleLogout} className="text-gray-600 hover:text-red-600">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.user_metadata?.name || user?.email?.split('@')[0]}!
          </h2>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Confidence Score */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confidence Score</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                  <circle 
                    cx="64" 
                    cy="64" 
                    r="56" 
                    stroke="#2956D9" 
                    strokeWidth="12" 
                    fill="none"
                    strokeDasharray={`${72 * 3.51} 351.86`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#2956D9]">72%</span>
                </div>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">XP Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Level 3</span>
                <span className="text-[#2956D9] font-bold">2450 XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-[#FFC947] h-4 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-sm text-gray-500">550 XP to Level 4</p>
            </div>
          </div>
        </div>

        {/* Start Learning Button */}
        <div className="bg-gradient-to-r from-[#2956D9] to-[#1a3a8a] rounded-2xl p-8 text-white mb-8">
          <h3 className="text-2xl font-bold mb-2">Ready to Learn?</h3>
          <p className="mb-6">Continue your skill path and earn more XP</p>
          <Link href="/skill-path">
            <button className="bg-[#FFC947] hover:bg-[#e6b33f] text-[#2956D9] font-bold px-8 py-3 rounded-full transition-colors">
              Start Learning
            </button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/skill-path" className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">🎯</div>
            <h4 className="font-semibold text-gray-800 mb-2">Skill Path</h4>
            <p className="text-gray-600 text-sm">Follow your learning journey</p>
          </Link>
          <Link href="/mentor" className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">💬</div>
            <h4 className="font-semibold text-gray-800 mb-2">AI Mentor</h4>
            <p className="text-gray-600 text-sm">Get help from your mentor</p>
          </Link>
          <Link href="/profile" className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">👤</div>
            <h4 className="font-semibold text-gray-800 mb-2">Profile</h4>
            <p className="text-gray-600 text-sm">View your achievements</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
