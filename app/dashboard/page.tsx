"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"
import { useUser } from "@/store/useUser"
import Navbar from "@/components/Navbar"
import XPProgressBar from "@/components/XPProgressBar"
import { availableSkills } from "@/utils/skills"

export default function DashboardPage() {
  const router = useRouter()
  const { user, profile, tokens, fetchUser } = useUser()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    completedLessons: 0,
    totalXP: 0,
    badges: []
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    await fetchUser()
    setLoading(false)
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (!loading && profile && !profile.profile_complete) {
      router.push("/onboarding")
    } else if (!loading && profile) {
      fetchStats()
    }
  }, [loading, user, profile])

  const fetchStats = async () => {
    if (!profile) return

    // Fetch completed lessons
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', profile.id)
      .eq('completed', true)

    setStats({
      completedLessons: progress?.length || 0,
      totalXP: profile.xp || 0,
      badges: profile.badges || []
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2956D9] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const sections = [
    {
      title: "Priority Skills",
      description: "Focus on mastering your priority skills",
      icon: "⭐",
      color: "from-blue-500 to-blue-600",
      href: "/priority",
      stats: `${profile?.priority_skills?.length || 0} skills`
    },
    {
      title: "Learn Later",
      description: "Skills you want to explore next",
      icon: "📚",
      color: "from-purple-500 to-purple-600",
      href: "/unpriority",
      stats: `${profile?.unpriority_skills?.length || 0} skills`
    },
    {
      title: "Game Zone",
      description: "Practice and earn XP through games",
      icon: "🎮",
      color: "from-green-500 to-green-600",
      href: "/game",
      stats: "Play now"
    },
    {
      title: "AI Mentor",
      description: "Get personalized guidance",
      icon: "🧠",
      color: "from-orange-500 to-orange-600",
      href: "/mentor",
      stats: `${tokens} tokens`
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {profile?.name || 'Learner'}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Continue your learning journey
          </p>
        </motion.div>

        {/* XP Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-md p-6 mb-8"
        >
          <XPProgressBar xp={profile?.xp || 0} level={profile?.level || 1} />
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                📖
              </div>
              <div>
                <p className="text-gray-600 text-sm">Lessons Completed</p>
                <p className="text-3xl font-bold text-gray-800">{stats.completedLessons}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">
                🏆
              </div>
              <div>
                <p className="text-gray-600 text-sm">Badges Earned</p>
                <p className="text-3xl font-bold text-gray-800">{stats.badges.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                📊
              </div>
              <div>
                <p className="text-gray-600 text-sm">Confidence Score</p>
                <p className="text-3xl font-bold text-gray-800">{profile?.confidence_score || 50}%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Skills Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-md p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Your Learning Focus</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Priority Skills ({profile?.priority_skills?.length || 0})</h4>
              <div className="flex flex-wrap gap-2">
                {(profile?.priority_skills || []).slice(0, 3).map((skillId: string) => {
                  const skill = availableSkills.find(s => s.id === skillId)
                  return skill ? (
                    <span key={skillId} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {skill.icon} {skill.name}
                    </span>
                  ) : null
                })}
                {(profile?.priority_skills?.length || 0) > 3 && (
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                    +{(profile?.priority_skills?.length || 0) - 3} more
                  </span>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-purple-700 mb-2">Learning Later ({profile?.unpriority_skills?.length || 0})</h4>
              <div className="flex flex-wrap gap-2">
                {(profile?.unpriority_skills || []).slice(0, 3).map((skillId: string) => {
                  const skill = availableSkills.find(s => s.id === skillId)
                  return skill ? (
                    <span key={skillId} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      {skill.icon} {skill.name}
                    </span>
                  ) : null
                })}
                {(profile?.unpriority_skills?.length || 0) > 3 && (
                  <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm">
                    +{(profile?.unpriority_skills?.length || 0) - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Link href={section.href}>
                <div className={`bg-gradient-to-br ${section.color} rounded-2xl shadow-lg p-8 text-white hover:scale-105 transition-transform cursor-pointer`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-6xl">{section.icon}</div>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      {section.stats}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{section.title}</h3>
                  <p className="text-white/90">{section.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
                    <span>Explore</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 bg-white rounded-2xl shadow-md p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">🔥 Keep Learning!</h3>
          <p className="text-gray-600 mb-4">
            You're making great progress! Continue with your priority skills to unlock more badges and level up faster.
          </p>
          <Link href="/priority">
            <button className="bg-[#2956D9] hover:bg-[#1a3a8a] text-white font-bold px-6 py-3 rounded-full transition-colors">
              Continue Learning →
            </button>
          </Link>
        </motion.div>
      </main>
    </div>
  )
}
