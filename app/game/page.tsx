"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"
import { useUser } from "@/store/useUser"
import Navbar from "@/components/Navbar"

const quizQuestions = [
  {
    id: 1,
    question: "What is Python primarily used for?",
    options: ["Web Development", "Data Science", "Mobile Apps", "All of the above"],
    correct: 3,
    xp: 50
  },
  {
    id: 2,
    question: "Which keyword is used to define a function in Python?",
    options: ["function", "def", "func", "define"],
    correct: 1,
    xp: 50
  },
  {
    id: 3,
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
    correct: 0,
    xp: 50
  }
]

export default function GamePage() {
  const router = useRouter()
  const { user, profile, fetchUser } = useUser()
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [earnedXP, setEarnedXP] = useState(0)
  const [showXPAnimation, setShowXPAnimation] = useState(false)

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

  // 🔥 REALTIME: Listen to XP updates
  useEffect(() => {
    if (!profile?.id) return

    const xpChannel = supabase
      .channel('xp-realtime-game')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'users',
          filter: `id=eq.${profile.id}`
        },
        (payload) => {
          console.log('🔥 Realtime XP update:', payload.new)
          const newData = payload.new as any
          if (newData.xp !== profile.xp) {
            // Show XP gain animation
            setShowXPAnimation(true)
            setTimeout(() => setShowXPAnimation(false), 2000)
            fetchUser() // Refresh user data
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(xpChannel)
    }
  }, [profile?.id, profile?.xp])

  const handleAnswer = async () => {
    const question = quizQuestions[currentQuestion]
    const isCorrect = selectedAnswer === question.correct

    if (isCorrect) {
      setScore(score + 1)
      setEarnedXP(earnedXP + question.xp)

      // Update XP in database
      if (profile) {
        const newXP = (profile.xp || 0) + question.xp
        const newLevel = Math.floor(newXP / 500) + 1

        await supabase
          .from('users')
          .update({ 
            xp: newXP,
            level: newLevel
          })
          .eq('id', profile.id)

        // Show XP animation
        setShowXPAnimation(true)
        setTimeout(() => setShowXPAnimation(false), 2000)
      }
    }

    // Move to next question or show results
    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      }, 1000)
    } else {
      setTimeout(() => {
        setShowResult(true)
      }, 1000)
    }
  }

  const resetGame = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setEarnedXP(0)
    setShowResult(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2956D9]"></div>
      </div>
    )
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-12 text-center"
          >
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Game Complete!
            </h1>
            <p className="text-2xl text-gray-600 mb-8">
              You scored {score} out of {quizQuestions.length}
            </p>

            <div className="bg-gradient-to-r from-[#2956D9] to-[#4a7de8] rounded-2xl p-6 mb-8">
              <div className="text-5xl mb-2">⚡</div>
              <div className="text-3xl font-bold text-white">+{earnedXP} XP</div>
              <p className="text-white/80 mt-2">Total XP Earned</p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={resetGame}
                className="bg-[#2956D9] hover:bg-[#1a3a8a] text-white font-bold px-8 py-4 rounded-full transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-8 py-4 rounded-full transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  const question = quizQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* XP Animation */}
      <AnimatePresence>
        {showXPAnimation && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-[#FFC947] text-[#2956D9] font-bold px-6 py-3 rounded-full shadow-lg text-xl">
              +{question.xp} XP! 🎉
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎮 Game Zone
          </h1>
          <p className="text-gray-600">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              className="bg-gradient-to-r from-[#2956D9] to-[#4a7de8] h-3 rounded-full"
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            {question.question}
          </h2>

          <div className="space-y-4 mb-8">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedAnswer(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedAnswer === index
                    ? "border-[#2956D9] bg-blue-50 shadow-md"
                    : "border-gray-300 hover:border-[#2956D9]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index ? "border-[#2956D9] bg-[#2956D9]" : "border-gray-300"
                  }`}>
                    {selectedAnswer === index && <div className="w-3 h-3 bg-white rounded-full"></div>}
                  </div>
                  <span className="text-gray-700 font-medium">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>

          <button
            onClick={handleAnswer}
            disabled={selectedAnswer === null}
            className={`w-full font-bold py-4 rounded-full transition-colors ${
              selectedAnswer !== null
                ? "bg-[#FFC947] hover:bg-[#e6b33f] text-[#2956D9]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Game"}
          </button>
        </motion.div>

        {/* Score Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span className="font-bold text-gray-800">Score: {score}</span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="font-bold text-[#2956D9]">{earnedXP} XP</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
