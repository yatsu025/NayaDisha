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
import { getFieldById, careerFields } from "@/utils/fields"

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

  // 🔥 REALTIME: Listen to user profile updates
  useEffect(() => {
    if (!profile?.id) return

    const userChannel = supabase
      .channel('user-realtime-dashboard')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'users',
          filter: `id=eq.${profile.id}`
        },
        (payload) => {
          console.log('🔥 Realtime user update:', payload.new)
          fetchUser() // Refresh user data
          fetchStats() // Also refresh stats when user updates
        }
      )
      .subscribe((status) => {
        console.log('📡 Dashboard channel status:', status)
      })

    return () => {
      supabase.removeChannel(userChannel)
    }
  }, [profile?.id])

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

  const getPriorityFieldName = () => {
    const p = profile as any
    if (p?.priority_field) return getFieldById(p.priority_field)?.name
    
    if (p?.priority_skills?.length > 0) {
      const matched = careerFields.find(f => f.skills.every(s => p.priority_skills.includes(s)))
      if (matched) return matched.name
    }
    
    return "Career Path"
  }

  const getSecondaryFieldName = () => {
    const p = profile as any
    if (p?.secondary_field) return getFieldById(p.secondary_field)?.name
    
    if (p?.unpriority_skills?.length > 0) {
      const matched = careerFields.find(f => f.skills.every(s => p.unpriority_skills.includes(s)))
      if (matched) return matched.name
    }
    
    return "Secondary Path"
  }

  const sections = [
    {
      title: "Career Path",
      description: "Focus on your main goal",
      icon: "⭐",
      color: "from-blue-500 to-blue-600",
      href: "/priority",
      stats: getPriorityFieldName()
    },
    {
      title: "Secondary Interest",
      description: "Explore your future goals",
      icon: "📚",
      color: "from-purple-500 to-purple-600",
      href: "/unpriority",
      stats: getSecondaryFieldName()
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

        {/* Career Focus Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-md p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Your Career Focus</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-700 mb-2">Primary Career Path</h4>
              {(() => {
                const field = (profile as any)?.priority_field 
                  ? getFieldById((profile as any).priority_field) 
                  : null
                
                return field ? (
                  <div>
                    <div className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <span className="text-2xl">{field.icon}</span>
                      {field.name}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{field.description}</p>
                    <div className="mt-3 flex gap-2 flex-wrap">
                       <span className="text-xs font-semibold bg-white px-2 py-1 rounded text-blue-600 border border-blue-200">
                         {field.skills.length} Topics
                       </span>
                       <span className="text-xs font-semibold bg-white px-2 py-1 rounded text-blue-600 border border-blue-200">
                         High Demand
                       </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No primary field selected.</p>
                )
              })()}
            </div>
            
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-700 mb-2">Secondary Interest</h4>
              {(() => {
                const field = (profile as any)?.secondary_field 
                  ? getFieldById((profile as any).secondary_field) 
                  : null
                
                return field ? (
                  <div>
                    <div className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <span className="text-2xl">{field.icon}</span>
                      {field.name}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{field.description}</p>
                    <div className="mt-3 flex gap-2 flex-wrap">
                       <span className="text-xs font-semibold bg-white px-2 py-1 rounded text-purple-600 border border-purple-200">
                         Future Goal
                       </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No secondary field selected.</p>
                )
              })()}
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
            You're making great progress! Continue with your priority field to unlock more badges and level up faster.
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
