"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"
import { useUser } from "@/store/useUser"
import { useLanguage } from "@/store/useLanguage"
import Navbar from "@/components/Navbar"
import { getSkillsByIds } from "@/utils/skills"

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, tokens, fetchUser, logout } = useUser()
  const { language, getLanguages, setLanguage } = useLanguage()
  const [loading, setLoading] = useState(true)

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
    }
  }, [loading, user, router])

  const handleLanguageChange = async (newLang: string) => {
    const lang = getLanguages().find((l: any) => l.code === newLang)
    if (lang && profile) {
      setLanguage(lang.code, lang.name)
      await supabase
        .from('users')
        .update({ language: lang.code })
        .eq('id', profile.id)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2956D9]"></div>
      </div>
    )
  }

  const stats = [
    { label: "Total XP", value: profile?.xp || 0, icon: "⚡" },
    { label: "Current Level", value: profile?.level || 1, icon: "🏆" },
    { label: "Tokens", value: tokens, icon: "🪙" },
    { label: "Confidence", value: `${profile?.confidence_score || 50}%`, icon: "📊" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">👤 Your Profile</h1>
          <p className="text-gray-600">Manage your account and track your progress</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#2956D9] to-[#4a7de8] text-white flex items-center justify-center text-5xl font-bold shadow-lg">
              {profile?.name?.substring(0, 2).toUpperCase() || "U"}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{profile?.name || "User"}</h2>
              <p className="text-gray-600 mb-1">{profile?.email}</p>
              <p className="text-sm text-gray-500">
                Joined {new Date(profile?.joined_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-full transition-colors"
            >
              Logout
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-md text-center"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-[#2956D9] mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Language Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-md p-8 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">🌐 Language Preference</h3>
          <select
            value={profile?.language || language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full md:w-auto px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#2956D9] focus:outline-none"
          >
            {getLanguages().map((lang: any) => (
              <option key={lang.code} value={lang.code}>
                {lang.native} ({lang.name})
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-2">
            All lessons will be translated to your preferred language
          </p>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-md p-8 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">🎯 Your Learning Skills</h3>
          
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">Priority Skills:</h4>
            <div className="flex flex-wrap gap-3">
              {getSkillsByIds(profile?.priority_skills || []).map((skill: any) => (
                <div key={skill.id} className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                  <span className="text-2xl">{skill.icon}</span>
                  <span className="font-semibold text-gray-800">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Learning Later:</h4>
            <div className="flex flex-wrap gap-3">
              {getSkillsByIds(profile?.unpriority_skills || []).map((skill: any) => (
                <div key={skill.id} className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
                  <span className="text-2xl">{skill.icon}</span>
                  <span className="font-semibold text-gray-800">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>

          <Link href="/onboarding">
            <button className="mt-6 text-[#2956D9] hover:underline font-semibold">
              Edit Skills →
            </button>
          </Link>
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-md p-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">🏆 Badges & Achievements</h3>
          {profile?.badges && profile.badges.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {profile.badges.map((badge: string, idx: number) => (
                <div key={idx} className="text-center">
                  <div className="text-5xl mb-2">{badge}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-6xl mb-4">🎖️</div>
              <p>Complete lessons and games to earn badges!</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
