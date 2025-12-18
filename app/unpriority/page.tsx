"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"
import { useUser } from "@/store/useUser"
import Navbar from "@/components/Navbar"
import LevelMap from "@/components/LevelMap"
import { getFieldById, careerFields } from "@/utils/fields"

export default function UnpriorityPage() {
  const router = useRouter()
  const { user, profile, fetchUser, updateProfile } = useUser()
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
    try {
      let fieldId = (profile as any)?.secondary_field

      // Fallback: Infer from skills if field is missing
      if (!fieldId && (profile as any)?.unpriority_skills?.length > 0) {
         const matchedField = careerFields.find(f => 
            f.skills.every(s => (profile as any).unpriority_skills.includes(s))
         )
         if (matchedField) fieldId = matchedField.id
      }
      
      // Default to 'android' if still nothing to ensure content is shown
      if (!fieldId) fieldId = 'android'

      const field = getFieldById(fieldId)
      const fieldSkills = field?.skills || []
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .in('skill_tag', fieldSkills)
        .order('level', { ascending: true })
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', profile.id)
      const progressMap: any = {}
      progressData?.forEach((p: any) => {
        progressMap[p.lesson_id] = p
      })
      let finalLessons = lessonsData || []
      if (lessonsError || !finalLessons || finalLessons.length === 0) {
        const baseTitle = field?.name || 'Core'
        finalLessons = [
          { id: 'mock-unpriority-1', title: `Level 1: ${baseTitle} Basics`, description: '', level: 1, xp_reward: 40 },
          { id: 'mock-unpriority-2', title: `Level 1: Practice`, description: '', level: 1, xp_reward: 40 },
          { id: 'mock-unpriority-3', title: `Level 2: Intermediate`, description: '', level: 2, xp_reward: 60 },
          { id: 'mock-unpriority-4', title: `Level 2: Project`, description: '', level: 2, xp_reward: 60 },
          { id: 'mock-unpriority-5', title: `Level 3: Advanced`, description: '', level: 3, xp_reward: 80 }
        ] as any
      }
      setLessons(finalLessons)
      setProgress(progressMap)
    } catch {
      const field = getFieldById((profile as any)?.secondary_field || 'android')
      const baseTitle = field?.name || 'Core'
      const fallback = [
        { id: 'mock-unpriority-1', title: `Level 1: ${baseTitle} Basics`, description: '', level: 1, xp_reward: 40 },
        { id: 'mock-unpriority-2', title: `Level 1: Practice`, description: '', level: 1, xp_reward: 40 },
        { id: 'mock-unpriority-3', title: `Level 2: Intermediate`, description: '', level: 2, xp_reward: 60 }
      ] as any
      setLessons(fallback)
      setProgress({})
    }
  }

  const secondaryField = (() => {
      if (!profile) return getFieldById('android');
      let fieldId = (profile as any).secondary_field
      if (!fieldId && (profile as any).unpriority_skills?.length > 0) {
          const matchedField = careerFields.find(f => 
              f.skills.every(s => (profile as any).unpriority_skills.includes(s))
          )
          if (matchedField) fieldId = matchedField.id
      }
      return getFieldById(fieldId || 'android')
  })()

  const handleStartLesson = (lessonId: string, type: 'video' | 'theory') => {
    router.push(`/lesson/${lessonId}?mode=${type}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2956D9]"></div>
      </div>
    )
  }

  const hasSecondaryField = true // We always fallback to a field now

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
            📚 Secondary Interest
          </h1>
          <p className="text-gray-600 text-lg">
            Fields you want to explore after mastering your priority career path
          </p>
        </motion.div>

          {/* Selected Field & Language Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-md p-6 mb-8 border-2 border-purple-200"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <h3 className="font-bold text-gray-800 mb-2">📚 Your Secondary Field:</h3>
                <div className="flex items-center gap-3 bg-purple-100 border-2 border-purple-300 px-4 py-2 rounded-full shadow-sm">
                  <span className="text-2xl">{secondaryField?.icon}</span>
                  <span className="font-semibold text-gray-800">{secondaryField?.name}</span>
                  <span className="text-purple-600">📚</span>
                </div>
              </div>
              <div className="bg-white rounded-xl px-4 py-3 shadow-sm border-2 border-pink-200">
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
          {(!hasSecondaryField) && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-yellow-800">
                ⚠️ <strong>No secondary field selected!</strong> Go to your{' '}
                <Link href="/profile" className="underline font-bold">profile</Link> to select a secondary field.
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
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600">{lessons.length}</div>
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
              <div className="text-center p-4 bg-pink-50 rounded-xl">
                <div className="text-3xl font-bold text-pink-600">
                  {Math.round((Object.values(progress).filter((p: any) => p.completed).length / lessons.length) * 100) || 0}%
                </div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Lessons by Level */}
        {lessons.length > 0 && (
          <LevelMap 
            lessons={lessons} 
            progress={progress} 
            onStartLesson={handleStartLesson} 
          />
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
            <p className="text-gray-600 mb-6">
              {(!hasSecondaryField)
                ? "Select a secondary field in your profile to see lessons here!"
                : "We're adding more content for your secondary field. Check back soon!"
               }
            </p>
            <Link href="/profile">
              <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-8 py-3 rounded-full transition-colors">
                Go to Profile
              </button>
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  )
}
