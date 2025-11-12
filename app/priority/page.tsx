"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"
import { useUser } from "@/store/useUser"
import { useLanguage } from "@/store/useLanguage"
import Navbar from "@/components/Navbar"
import { getSkillsByIds } from "@/utils/skills"

export default function PriorityPage() {
  const router = useRouter()
  const { user, profile, fetchUser } = useUser()
  const { language } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [lessons, setLessons] = useState<any[]>([])
  const [progress, setProgress] = useState<any>({})

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
  }, [loading, user, profile, router])

  const fetchLessons = async () => {
    if (!profile?.priority_skills) return

    // Fetch lessons matching priority skills
    const { data: lessonsData } = await supabase
      .from('lessons')
      .select('*')
      .in('skill_tag', profile.priority_skills)
      .order('level', { ascending: true })

    // Fetch user progress
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', profile.id)

    const progressMap: any = {}
    progressData?.forEach((p: any) => {
      progressMap[p.lesson_id] = p
    })

    setLessons(lessonsData || [])
    setProgress(progressMap)
  }

  const handleLessonClick = async (lessonId: string) => {
    router.push(`/lesson/${lessonId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2956D9]"></div>
      </div>
    )
  }

  const prioritySkills = getSkillsByIds(profile?.priority_skills || [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ⭐ Priority Skills
          </h1>
          <p className="text-gray-600 text-lg">
            Master these skills to achieve your learning goals
          </p>
        </motion.div>

        {/* Selected Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-md p-6 mb-8"
        >
          <h3 className="font-bold text-gray-800 mb-4">Your Priority Skills:</h3>
          <div className="flex flex-wrap gap-3">
            {prioritySkills.map((skill: any) => (
              <div
                key={skill.id}
                className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full"
              >
                <span className="text-2xl">{skill.icon}</span>
                <span className="font-semibold text-gray-800">{skill.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Lessons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson, index) => {
            const lessonProgress = progress[lesson.id]
            const isCompleted = lessonProgress?.completed
            const earnedXP = lessonProgress?.xp || 0

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                onClick={() => handleLessonClick(lesson.id)}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Level Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold text-[#2956D9]">
                    Level {lesson.level}
                  </div>
                  {isCompleted && (
                    <div className="text-2xl">✅</div>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {lesson.title}
                </h3>

                {/* Content Preview */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {lesson.english_content.substring(0, 100)}...
                </p>

                {/* XP Info */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    <span className="font-bold text-gray-800">
                      {isCompleted ? earnedXP : lesson.xp_reward} XP
                    </span>
                  </div>
                  <button className="text-[#2956D9] font-semibold hover:underline">
                    {isCompleted ? "Review" : "Start"} →
                  </button>
                </div>

                {/* Progress Bar */}
                {lessonProgress && !isCompleted && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#2956D9] h-2 rounded-full"
                        style={{ width: `${(earnedXP / lesson.xp_reward) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Empty State */}
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
              We're adding more content for your priority skills. Check back soon!
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
