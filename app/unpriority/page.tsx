"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"
import { useUser } from "@/store/useUser"
import Navbar from "@/components/Navbar"
import { getSkillsByIds } from "@/utils/skills"

export default function UnpriorityPage() {
  const router = useRouter()
  const { user, profile, fetchUser, updateProfile } = useUser()
  const [loading, setLoading] = useState(true)
  const [lessons, setLessons] = useState([])
  const [progress, setProgress] = useState({})

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
    } else if (!loading && profile) {
      fetchLessons()
    }
  }, [loading, user, profile])

  const fetchLessons = async () => {
    if (!profile?.unpriority_skills) return

    const { data: lessonsData } = await supabase
      .from('lessons')
      .select('*')
      .in('skill_tag', profile.unpriority_skills)
      .order('level', { ascending: true })

    const { data: progressData } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', profile.id)

    const progressMap = {}
    progressData?.forEach(p => {
      progressMap[p.lesson_id] = p
    })

    setLessons(lessonsData || [])
    setProgress(progressMap)
  }

  const moveToPriority = async (skillId) => {
    if (!profile) return

    const newPriority = [...(profile.priority_skills || []), skillId]
    const newUnpriority = (profile.unpriority_skills || []).filter(id => id !== skillId)

    await updateProfile({
      priority_skills: newPriority,
      unpriority_skills: newUnpriority
    })

    fetchLessons()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2956D9]"></div>
      </div>
    )
  }

  const unprioritySkills = getSkillsByIds(profile?.unpriority_skills || [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 Learn Later
          </h1>
          <p className="text-gray-600 text-lg">
            Skills you want to explore after mastering your priorities
          </p>
        </motion.div>

        {/* Selected Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-md p-6 mb-8"
        >
          <h3 className="font-bold text-gray-800 mb-4">Your Later Skills:</h3>
          <div className="flex flex-wrap gap-3">
            {unprioritySkills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full group"
              >
                <span className="text-2xl">{skill.icon}</span>
                <span className="font-semibold text-gray-800">{skill.name}</span>
                <button
                  onClick={() => moveToPriority(skill.id)}
                  className="ml-2 text-xs bg-[#2956D9] text-white px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Move to Priority
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Lessons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson, index) => {
            const lessonProgress = progress[lesson.id]
            const isCompleted = lessonProgress?.completed

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                onClick={() => router.push(`/lesson/${lesson.id}`)}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-purple-100 px-3 py-1 rounded-full text-sm font-semibold text-purple-700">
                    Level {lesson.level}
                  </div>
                  {isCompleted && <div className="text-2xl">✅</div>}
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {lesson.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {lesson.english_content.substring(0, 100)}...
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    <span className="font-bold text-gray-800">{lesson.xp_reward} XP</span>
                  </div>
                  <button className="text-purple-600 font-semibold hover:underline">
                    {isCompleted ? "Review" : "Start"} →
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {lessons.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No lessons available yet
            </h3>
            <p className="text-gray-600">
              We're adding more content. Check back soon!
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
