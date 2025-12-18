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
import { careerFields, getFieldById } from "@/utils/fields"

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, tokens, fetchUser, logout, updateProfile } = useUser()
  const { language, getLanguages, setLanguage } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [editingSkills, setEditingSkills] = useState(false)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [selectedUnpriorityFieldId, setSelectedUnpriorityFieldId] = useState<string | null>('android') // Default as requested
  const [showMentor, setShowMentor] = useState(false)
  const [mentorForm, setMentorForm] = useState<any>({
    education: '',
    interests: '',
    hoursPerWeek: 5,
    experience: 'beginner',
    preference: ''
  })
  const [mentorResult, setMentorResult] = useState<any>(null)

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
      const matchedField = careerFields.find(f => 
        f.skills.every(s => profile.priority_skills?.includes(s))
      )
      if (matchedField) setSelectedFieldId(matchedField.id)
      if (!profile.priority_skills || profile.priority_skills.length === 0) {
        const defaultField = getFieldById('fullstack')
        if (defaultField) {
          updateProfile({ priority_skills: defaultField.skills })
          setSelectedFieldId('fullstack')
        }
      }
      if (!profile.unpriority_skills || profile.unpriority_skills.length === 0) {
        const secondaryField = getFieldById('android')
        if (secondaryField) {
          updateProfile({ unpriority_skills: secondaryField.skills })
          setSelectedUnpriorityFieldId('android')
        }
      }
    }
  }, [loading, user, router, profile])

  // 🔥 REALTIME: Listen to profile updates
  useEffect(() => {
    if (!profile?.id) return

    const profileChannel = supabase
      .channel('profile-realtime')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'users',
          filter: `id=eq.${profile.id}`
        },
        (payload) => {
          console.log('🔥 Realtime profile update:', payload.new)
          fetchUser() // Auto-refresh profile data
          if (!editingSkills) {
            const newPrioritySkills = (payload.new as any).priority_skills || []
            const newUnprioritySkills = (payload.new as any).unpriority_skills || []
            
            // Infer fields from new skills
            const matchedField = careerFields.find(f => 
              f.skills.every(s => newPrioritySkills.includes(s))
            )
            if (matchedField) setSelectedFieldId(matchedField.id)
            
            const matchedUnpriorityField = careerFields.find(f => 
              f.skills.every(s => newUnprioritySkills.includes(s))
            )
            if (matchedUnpriorityField) setSelectedUnpriorityFieldId(matchedUnpriorityField.id)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(profileChannel)
    }
  }, [profile?.id, editingSkills])

  const handleLanguageChange = async (newLang: string) => {
    const lang = getLanguages().find((l: any) => l.code === newLang)
    if (lang && profile) {
      setLanguage(lang.code, lang.name)
      await updateProfile({ language: lang.code })
    }
  }

  const saveFieldChanges = async () => {
    if (!selectedFieldId) {
      alert("Please select a Priority Field")
      return
    }

    setLoading(true)
    try {
      const priorityField = getFieldById(selectedFieldId)
      const unpriorityField = getFieldById(selectedUnpriorityFieldId || 'android')

      if (priorityField) {
        await updateProfile({
          priority_skills: priorityField.skills,
          priority_field: selectedFieldId,
          secondary_field: selectedUnpriorityFieldId || 'android',
          unpriority_skills: unpriorityField ? unpriorityField.skills : []
        })
      }
      
      setEditingSkills(false)
      alert("Career path updated successfully! 🎉")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const cancelSkillEdit = () => {
    setEditingSkills(false)
    // Reset to current profile state logic if needed
  }

  const getMentorAdvice = () => {
    if (!selectedFieldId) return "👋 Hi! I can help you choose the right career path. Tell me about your interests!"
    
    const field = getFieldById(selectedFieldId)
    return `🚀 Great choice! As a ${field?.name}, you'll need to master ${field?.skills.length} key skills. Stick to the plan and you'll do great!`
  }
  
  const calculateSuggestion = () => {
    const scores: Record<string, number> = {}
    careerFields.forEach(f => { scores[f.id] = 0 })
    const interests = mentorForm.interests.toLowerCase()
    if (mentorForm.preference === 'web') scores['fullstack'] += 40
    if (mentorForm.preference === 'mobile') scores['android'] += 40
    if (mentorForm.preference === 'data') scores['datascience'] += 40
    if (mentorForm.preference === 'security') scores['cybersecurity'] += 40
    if (interests.includes('web') || interests.includes('frontend') || interests.includes('backend')) scores['fullstack'] += 25
    if (interests.includes('android') || interests.includes('mobile')) scores['android'] += 25
    if (interests.includes('data') || interests.includes('ml') || interests.includes('ai')) scores['datascience'] += 25
    if (interests.includes('security') || interests.includes('network')) scores['cybersecurity'] += 25
    const hours = Number(mentorForm.hoursPerWeek) || 0
    if (hours >= 10) {
      scores['datascience'] += 10
      scores['cybersecurity'] += 10
    } else if (hours >= 5) {
      scores['fullstack'] += 10
      scores['android'] += 10
    } else {
      scores['fullstack'] += 5
      scores['android'] += 5
    }
    if (mentorForm.experience === 'beginner') {
      scores['fullstack'] += 10
      scores['android'] += 10
    } else if (mentorForm.experience === 'intermediate') {
      scores['datascience'] += 10
      scores['cybersecurity'] += 10
    } else {
      scores['datascience'] += 5
      scores['cybersecurity'] += 5
    }
    const maxScore = Math.max(...Object.values(scores))
    const result = Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, Math.round((v / (maxScore || 1)) * 100)]))
    const topFieldId = Object.entries(result).sort((a, b) => b[1] - a[1])[0][0]
    setSelectedFieldId(topFieldId)
    setMentorResult({ fieldId: topFieldId, scores: result })
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
                    onClick={saveFieldChanges}
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
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <input
                  value={mentorForm.education}
                  onChange={(e) => setMentorForm({ ...mentorForm, education: e.target.value })}
                  placeholder="Education (e.g., BCA/BTech/12th)"
                  className="w-full px-4 py-2 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none"
                />
                <input
                  value={mentorForm.interests}
                  onChange={(e) => setMentorForm({ ...mentorForm, interests: e.target.value })}
                  placeholder="Interests (e.g., web, mobile, data, security)"
                  className="w-full px-4 py-2 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none"
                />
                <select
                  value={mentorForm.preference}
                  onChange={(e) => setMentorForm({ ...mentorForm, preference: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none"
                >
                  <option value="">Preferred Area</option>
                  <option value="web">Web</option>
                  <option value="mobile">Mobile</option>
                  <option value="data">Data</option>
                  <option value="security">Security</option>
                </select>
                <select
                  value={mentorForm.experience}
                  onChange={(e) => setMentorForm({ ...mentorForm, experience: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <input
                  type="number"
                  min={1}
                  value={mentorForm.hoursPerWeek}
                  onChange={(e) => setMentorForm({ ...mentorForm, hoursPerWeek: e.target.value })}
                  placeholder="Hours per week"
                  className="w-full px-4 py-2 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none"
                />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={calculateSuggestion}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                >
                  Suggest Field
                </button>
                {mentorResult && (
                  <div className="text-sm text-purple-700">
                    Suggested: <span className="font-bold">{getFieldById(mentorResult.fieldId)?.name}</span>
                  </div>
                )}
              </div>
              {mentorResult && (
                <div className="grid md:grid-cols-2 gap-3 mt-4">
                  {careerFields.map(f => (
                    <div key={f.id} className={`p-3 rounded-xl border-2 ${mentorResult.fieldId === f.id ? 'border-purple-500 bg-white' : 'border-purple-200 bg-white'}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{f.name}</span>
                        <span className="text-purple-700 font-bold">{mentorResult.scores[f.id]}%</span>
                      </div>
                      <div className="h-2 bg-purple-100 rounded mt-2">
                        <div className="h-2 bg-purple-500 rounded" style={{ width: `${mentorResult.scores[f.id]}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {!editingSkills ? (
            // Display Mode
            <>
              <div className="mb-4 grid md:grid-cols-2 gap-3">
                <div className="bg-white rounded-xl px-4 py-3 shadow-sm border-2 border-blue-200">
                  <div className="text-sm text-gray-600">Priority Field</div>
                  <div className="font-bold text-blue-700">
                    {getFieldById((profile as any)?.priority_field || selectedFieldId || 'fullstack')?.name || 'Fullstack Developer'}
                  </div>
                </div>
                <div className="bg-white rounded-xl px-4 py-3 shadow-sm border-2 border-purple-200">
                  <div className="text-sm text-gray-600">Secondary Field</div>
                  <div className="font-bold text-purple-700">
                    {getFieldById((profile as any)?.secondary_field || selectedUnpriorityFieldId || 'android')?.name || 'Android Developer'}
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-700 text-sm">
                  ✅ <strong>Auto-Save Enabled:</strong> Your skill changes are automatically saved when you select them in edit mode!
                </p>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-semibold text-gray-700">Priority Field:</h4>
                </div>
                <div className="flex items-center gap-3 bg-blue-50 border-2 border-blue-200 px-4 py-2 rounded-full">
                  <span className="text-2xl">{getFieldById((profile as any)?.priority_field || selectedFieldId || 'fullstack')?.icon}</span>
                  <span className="font-semibold text-gray-800">{getFieldById((profile as any)?.priority_field || selectedFieldId || 'fullstack')?.name}</span>
                  <span className="text-blue-600 text-sm">⭐</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-semibold text-gray-700">Secondary Field:</h4>
                </div>
                <div className="flex items-center gap-3 bg-purple-50 border-2 border-purple-200 px-4 py-2 rounded-full">
                  <span className="text-2xl">{getFieldById((profile as any)?.secondary_field || selectedUnpriorityFieldId || 'android')?.icon}</span>
                  <span className="font-semibold text-gray-800">{getFieldById((profile as any)?.secondary_field || selectedUnpriorityFieldId || 'android')?.name}</span>
                  <span className="text-purple-600 text-sm">📚</span>
                </div>
              </div>
            </>
          ) : (
            // Edit Mode (Field Selection)
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🚀</div>
                  <div>
                    <h4 className="font-bold text-blue-800 mb-1">Choose Your Career Path</h4>
                    <p className="text-blue-700 text-sm">
                      Select a field to automatically set up your learning roadmap.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-semibold text-gray-700 mb-3">Priority Field (Focus Now):</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {careerFields.map((field) => (
                    <button
                      key={field.id}
                      onClick={() => setSelectedFieldId(field.id)}
                      className={`p-6 rounded-2xl border-2 transition-all text-left flex items-start gap-4 ${
                        selectedFieldId === field.id
                          ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-4xl bg-white p-3 rounded-xl shadow-sm">{field.icon}</div>
                      <div>
                        <h5 className="font-bold text-lg text-gray-800">{field.name}</h5>
                        <p className="text-gray-600 text-sm mb-2">{field.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {field.skills.slice(0, 3).map(skillId => {
                             const skill = availableSkills.find(s => s.id === skillId)
                             return skill ? (
                               <span key={skillId} className="text-xs bg-white px-2 py-1 rounded-full border border-gray-200">
                                 {skill.name}
                               </span>
                             ) : null
                          })}
                          {field.skills.length > 3 && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">
                              +{field.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Secondary Field (Learn Later):</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {careerFields.map((field) => (
                    <button
                      key={field.id}
                      onClick={() => setSelectedUnpriorityFieldId(field.id)}
                      disabled={selectedFieldId === field.id}
                      className={`p-6 rounded-2xl border-2 transition-all text-left flex items-start gap-4 ${
                        selectedUnpriorityFieldId === field.id
                          ? "border-purple-500 bg-purple-50 shadow-lg ring-2 ring-purple-200"
                          : selectedFieldId === field.id
                          ? "opacity-50 cursor-not-allowed border-gray-100 bg-gray-50"
                          : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-4xl bg-white p-3 rounded-xl shadow-sm">{field.icon}</div>
                      <div>
                        <h5 className="font-bold text-lg text-gray-800">{field.name}</h5>
                        <p className="text-gray-600 text-sm mb-2">{field.description}</p>
                      </div>
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
