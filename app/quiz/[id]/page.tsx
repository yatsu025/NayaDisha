"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

export default function QuizPage() {
  const router = useRouter()
  const params = useParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [showXPAnimation, setShowXPAnimation] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
      }
    }
    checkUser()
  }, [router])

  const questions = [
    {
      question: "What is a list in Python?",
      options: [
        "A data structure that stores multiple items",
        "A single variable",
        "A function",
        "A loop"
      ],
      correct: 0
    },
    {
      question: "How do you add an item to a list?",
      options: [
        "list.add(item)",
        "list.append(item)",
        "list.insert(item)",
        "list.push(item)"
      ],
      correct: 1
    },
    {
      question: "Can lists contain duplicate values?",
      options: [
        "No, never",
        "Only numbers",
        "Yes, always",
        "Only strings"
      ],
      correct: 2
    }
  ]

  const handleAnswer = () => {
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      setShowResult(true)
      setShowXPAnimation(true)
    }
  }

  if (showResult) {
    const xpEarned = score * 50
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
          <h1 className="text-4xl font-bold text-[#2956D9] mb-4">Quiz Complete!</h1>
          <p className="text-2xl text-gray-700 mb-8">
            You scored {score} out of {questions.length}
          </p>
          
          {showXPAnimation && (
            <div className="mb-8 animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-3xl font-bold text-[#FFC947]">+{xpEarned} XP</div>
            </div>
          )}

          <div className="space-y-4">
            <Link href="/skill-path">
              <button className="w-full bg-[#2956D9] hover:bg-[#1a3a8a] text-white font-bold px-8 py-4 rounded-full transition-colors">
                Continue Learning
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-4 rounded-full transition-colors">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-[#2956D9]">NayaDisha</Link>
          <div className="text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#2956D9] h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            {questions[currentQuestion].question}
          </h2>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {questions[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedAnswer(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedAnswer === idx
                    ? "border-[#2956D9] bg-blue-50"
                    : "border-gray-300 hover:border-[#2956D9]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === idx ? "border-[#2956D9] bg-[#2956D9]" : "border-gray-300"
                  }`}>
                    {selectedAnswer === idx && <div className="w-3 h-3 bg-white rounded-full"></div>}
                  </div>
                  <span className="text-gray-700">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleAnswer}
            disabled={selectedAnswer === null}
            className={`w-full font-bold px-8 py-4 rounded-full transition-colors ${
              selectedAnswer !== null
                ? "bg-[#FFC947] hover:bg-[#e6b33f] text-[#2956D9]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </button>
        </div>
      </main>
    </div>
  )
}
