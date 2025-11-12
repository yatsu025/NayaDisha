"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"
import { useUser } from "@/store/useUser"
import { useLanguage } from "@/store/useLanguage"
import Navbar from "@/components/Navbar"
import { getSkillsByIds, availableSkills } from "@/utils/skills"

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, tokens, fetchUser, logout, updateProfile } = useUser()
  const { language, getLanguages, setLanguage } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [editingSkills, setEditingSkills] = useState(false)
  const [tempPrioritySkills, setTempPrioritySkills] = useState<string[]>([])
  const [tempUnprioritySkills, setTempUnprioritySkills] = useState<string[]>([])
  const [showMentor, setShowMentor] = useState(false)

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
    } else if (profile) {
      setTempPrioritySkills(profile.priority_skills || [])
      setTempUnprioritySkills(profile.unpriority_skills || [])
    }
  }, [loading, user, router, profile])

  const handleLanguageChange = async (newLang: string) => {
    const lang = getLanguages().find((l: any) => l.code === newLang)
    if (lang && profile) {
      setLanguage(lang.code, lang.name)
      await updateProfile({ language: lang.code })
    }
  }

  const togglePrioritySkill = async (skillId: string) => {
    let newPrioritySkills: string[]
    let newUnprioritySkills = tempUnprioritySkills

    if (tempPrioritySkills.includes(skillId)) {
      newPrioritySkills = tempPrioritySkills.filter(id => id !== skillId)
    } else if (tempPrioritySkills.length < 5) {
      // Remove from unpriority if adding to priority
      newUnprioritySkills = tempUnprioritySkills.filter(id => id !== skillId)
      newPrioritySkills = [...tempPrioritySkills, skillId]
    } else {
      return // Max limit reached
    }

    setTempPrioritySkills(newPrioritySkills)
    setTempUnprioritySkills(newUnprioritySkills)

    // Auto-save if both have minimum 3 skills
    if (newPrioritySkills.length >= 3 && newUnprioritySkills.length >= 3) {
      await updateProfile({
        priority_skills: newPrioritySkills,
        unpriority_skills: newUnprioritySkills
      })
    }
  }

  const toggleUnprioritySkill = async (skillId: string) => {
    let newUnprioritySkills: string[]
    let newPrioritySkills = tempPrioritySkills

    if (tempUnprioritySkills.includes(skillId)) {
      newUnprioritySkills = tempUnprioritySkills.filter(id => id !== skillId)
    } else if (tempUnprioritySkills.length < 5) {
      // Remove from priority if adding to unpriority
      newPrioritySkills = tempPrioritySkills.filter(id => id !== skillId)
      newUnprioritySkills = [...tempUnprioritySkills, skillId]
    } else {
      return // Max limit reached
    }

    setTempUnprioritySkills(newUnprioritySkills)
    setTempPrioritySkills(newPrioritySkills)

    // Auto-save if both have minimum 3 skills
    if (newPrioritySkills.length >= 3 && newUnprioritySkills.length >= 3) {
      await updateProfile({
        priority_skills: newPrioritySkills,
        unpriority_skills: newUnprioritySkills
      })
    }
  }

  const saveSkillChanges = async () => {
    if (tempPrioritySkills.length < 3 || tempUnprioritySkills.length < 3) {
      alert("Please select at least 3 skills in each category")
      return
    }

    setLoading(true)
    try {
      await updateProfile({
        priority_skills: tempPrioritySkills,
        unpriority_skills: tempUnprioritySkills
      })
      setEditingSkills(false)
      alert("Skills updated successfully! 🎉")
    } catch (error) {
      console.error("Error updating skills:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const cancelSkillEdit = () => {
    setTempPrioritySkills(profile?.priority_skills || [])
    setTempUnprioritySkills(profile?.unpriority_skills || [])
    setEditingSkills(false)
  }

  const getMentorAdvice = () => {
    const priorityCount = tempPrioritySkills.length
    const unpriorityCount = tempUnprioritySkills.length
    
    if (priorityCount < 3) {
      return "🎯 Select at least 3 priority skills to focus on first. These should be skills most important for your career goals."
    } else if (unpriorityCount < 3) {
      return "📚 Select at least 3 skills to learn later. These can be skills you're curious about but not immediately needed."
    } else if (priorityCount > 5) {
      return "⚠️ Too many priority skills! Focus on maximum 5 skills to avoid overwhelm and ensure better learning outcomes."
    } else if (unpriorityCount > 5) {
      return "⚠️ Too many later skills selected! Keep it to maximum 5 to maintain a clear learning roadmap."
    } else {
      return "✅ Perfect balance! You have a good mix of priority and later skills. This will help you stay focused while keeping options open."
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
              {(profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || "U").substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || "User"}
              </h2>
              <p className="text-gray-600 mb-1">{profile?.email || user?.email}</p>
              <p className="text-sm text-gray-500">
                Joined {profile?.joined_at ? new Date(profile.joined_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  🌐 {getLanguages().find((l: any) => l.code === (profile?.language || language))?.native || 'English'}
                </span>
                {profile?.profile_complete && (
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    ✅ Profile Complete
                  </span>
                )}
              </div>
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
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">🎯 Your Learning Skills</h3>
            <div className="flex gap-2">
              <Link href="/skill-mentor">
                <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg">
                  🧠 AI Skill Mentor
                </button>
              </Link>
              <button
                onClick={() => setShowMentor(!showMentor)}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
              >
                💡 Quick Tips
              </button>
              {!editingSkills ? (
                <button
                  onClick={() => setEditingSkills(true)}
                  className="bg-[#2956D9] hover:bg-[#1a3a8a] text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                >
                  ✏️ Edit Skills
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={saveSkillChanges}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "💾 Save"}
                  </button>
                  <button
                    onClick={cancelSkillEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                  >
                    ❌ Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mentor Advice */}
          {showMentor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">🧠</div>
                <div>
                  <h4 className="font-bold text-purple-800 mb-2">AI Mentor Says:</h4>
                  <p className="text-purple-700">{getMentorAdvice()}</p>
                </div>
              </div>
            </motion.div>
          )}

          {!editingSkills ? (
            // Display Mode
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-700 text-sm">
                  ✅ <strong>Auto-Save Enabled:</strong> Your skill changes are automatically saved when you select them in edit mode!
                </p>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-semibold text-gray-700">Priority Skills:</h4>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {profile?.priority_skills?.length || 0}/5
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {getSkillsByIds(profile?.priority_skills || []).map((skill: any) => (
                    <div key={skill.id} className="flex items-center gap-2 bg-blue-50 border-2 border-blue-200 px-4 py-2 rounded-full">
                      <span className="text-2xl">{skill.icon}</span>
                      <span className="font-semibold text-gray-800">{skill.name}</span>
                      <span className="text-blue-600 text-sm">⭐</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-semibold text-gray-700">Learning Later:</h4>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    {profile?.unpriority_skills?.length || 0}/5
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {getSkillsByIds(profile?.unpriority_skills || []).map((skill: any) => (
                    <div key={skill.id} className="flex items-center gap-2 bg-purple-50 border-2 border-purple-200 px-4 py-2 rounded-full">
                      <span className="text-2xl">{skill.icon}</span>
                      <span className="font-semibold text-gray-800">{skill.name}</span>
                      <span className="text-purple-600 text-sm">📚</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Edit Mode
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <h4 className="font-bold text-blue-800 mb-1">Auto-Save Active!</h4>
                    <p className="text-blue-700 text-sm">
                      Click on skills to select/deselect. Changes are automatically saved when you have at least 3 skills in each category.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-semibold text-gray-700">Priority Skills (Focus First):</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tempPrioritySkills.length >= 3 && tempPrioritySkills.length <= 5
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {tempPrioritySkills.length}/5 {tempPrioritySkills.length < 3 ? "(Need 3+)" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableSkills.map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => togglePrioritySkill(skill.id)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        tempPrioritySkills.includes(skill.id)
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : tempUnprioritySkills.includes(skill.id)
                          ? "border-purple-300 bg-purple-50 opacity-50"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                      disabled={tempUnprioritySkills.includes(skill.id)}
                    >
                      <div className="text-2xl mb-1">{skill.icon}</div>
                      <div className="font-semibold text-sm text-gray-800">{skill.name}</div>
                      {tempPrioritySkills.includes(skill.id) && (
                        <div className="text-blue-600 text-xs mt-1">⭐ Priority</div>
                      )}
                      {tempUnprioritySkills.includes(skill.id) && (
                        <div className="text-purple-600 text-xs mt-1">📚 Later</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-semibold text-gray-700">Learning Later (After Priority):</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tempUnprioritySkills.length >= 3 && tempUnprioritySkills.length <= 5
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {tempUnprioritySkills.length}/5 {tempUnprioritySkills.length < 3 ? "(Need 3+)" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableSkills
                    .filter(skill => !tempPrioritySkills.includes(skill.id))
                    .map((skill) => (
                      <button
                        key={skill.id}
                        onClick={() => toggleUnprioritySkill(skill.id)}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          tempUnprioritySkills.includes(skill.id)
                            ? "border-purple-500 bg-purple-50 shadow-md"
                            : "border-gray-300 hover:border-purple-300"
                        }`}
                      >
                        <div className="text-2xl mb-1">{skill.icon}</div>
                        <div className="font-semibold text-sm text-gray-800">{skill.name}</div>
                        {tempUnprioritySkills.includes(skill.id) && (
                          <div className="text-purple-600 text-xs mt-1">📚 Later</div>
                        )}
                      </button>
                    ))}
                </div>
              </div>
            </>
          )}
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
