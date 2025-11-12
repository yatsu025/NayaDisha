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
    if (!profile?.priority_skills || profile.priority_skills.length === 0) {
      setLessons([])
      return
    }

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

        {/* Selected Skills & Language Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-md p-6 mb-8 border-2 border-blue-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">🎯 Your Priority Skills:</h3>
              <div className="flex flex-wrap gap-3">
                {prioritySkills.length > 0 ? (
                  prioritySkills.map((skill: any) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-2 bg-blue-100 border-2 border-blue-300 px-4 py-2 rounded-full shadow-sm"
                    >
                      <span className="text-2xl">{skill.icon}</span>
                      <span className="font-semibold text-gray-800">{skill.name}</span>
                      <span className="text-blue-600">⭐</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No priority skills selected yet</p>
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl px-4 py-3 shadow-sm border-2 border-purple-200">
              <div className="text-sm text-gray-600 mb-1">Learning in:</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌐</span>
                <span className="font-bold text-purple-700">
                  {profile?.language === 'hi' ? 'हिंदी' : 
                   profile?.language === 'ta' ? 'தமிழ்' :
                   profile?.language === 'te' ? 'తెలుగు' :
                   profile?.language === 'bn' ? 'বাংলা' :
                   profile?.language === 'mr' ? 'मराठी' : 'English'}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Lessons auto-translated
              </div>
            </div>
          </div>
          
          {prioritySkills.length === 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-yellow-800">
                ⚠️ <strong>No priority skills selected!</strong> Go to your{' '}
                <Link href="/profile" className="underline font-bold">profile</Link> to select skills you want to focus on.
              </p>
            </div>
          )}
        </motion.div>

        {/* Progress Summary */}
        {lessons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md p-6 mb-8"
          >
            <h3 className="font-bold text-gray-800 mb-4">📊 Your Progress</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600">{lessons.length}</div>
                <div className="text-sm text-gray-600">Total Lessons</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600">
                  {Object.values(progress).filter((p: any) => p.completed).length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <div className="text-3xl font-bold text-yellow-600">
                  {lessons.length - Object.values(progress).filter((p: any) => p.completed).length}
                </div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round((Object.values(progress).filter((p: any) => p.completed).length / lessons.length) * 100) || 0}%
                </div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Lessons by Level */}
        {lessons.length > 0 && (
          <>
            {[1, 2, 3].map(level => {
              const levelLessons = lessons.filter(l => l.level === level)
              if (levelLessons.length === 0) return null

              return (
                <div key={level} className="mb-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 mb-4"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full font-bold">
                      Level {level}
                    </div>
                    <div className="text-gray-600">
                      {levelLessons.filter(l => progress[l.id]?.completed).length} / {levelLessons.length} completed
                    </div>
                  </motion.div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {levelLessons.map((lesson, index) => {
                      const lessonProgress = progress[lesson.id]
                      const isCompleted = lessonProgress?.completed
                      const earnedXP = lessonProgress?.xp || 0

                      return (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          onClick={() => handleLessonClick(lesson.id)}
                          className={`bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all cursor-pointer border-2 ${
                            isCompleted ? 'border-green-300' : 'border-gray-200'
                          }`}
                        >
                          {/* Status Badge */}
                          <div className="flex justify-between items-start mb-4">
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-[#2956D9]'
                            }`}>
                              {isCompleted ? '✅ Completed' : '📖 Available'}
                            </div>
                            {isCompleted && (
                              <div className="text-3xl">🏆</div>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {lesson.title}
                          </h3>

                          {/* Language Badge */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                              🌐 {profile?.language === 'hi' ? 'हिंदी' : 
                                  profile?.language === 'en' ? 'English' : 'Translated'}
                            </span>
                          </div>

                          {/* Content Preview */}
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {lesson.english_content.substring(0, 100)}...
                          </p>

                          {/* XP Info */}
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">⚡</span>
                              <span className="font-bold text-gray-800">
                                {isCompleted ? earnedXP : lesson.xp_reward} XP
                              </span>
                            </div>
                            <button className={`font-semibold hover:underline ${
                              isCompleted ? 'text-green-600' : 'text-[#2956D9]'
                            }`}>
                              {isCompleted ? "Review" : "Start"} →
                            </button>
                          </div>

                          {/* Progress Bar */}
                          {lessonProgress && !isCompleted && (
                            <div className="mt-4">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>{Math.round((earnedXP / lesson.xp_reward) * 100)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                                  style={{ width: `${(earnedXP / lesson.xp_reward) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </>
        )}

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
