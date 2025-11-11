"use client"

import { useState } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { MCQCard } from "@/components/mcq-card"
import { ArrowLeft, Zap } from "lucide-react"

export default function QuizPage({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)

  const questions = [
    {
      question: "What is an array in Python?",
      options: [
        "A collection of elements in contiguous memory",
        "A single variable that stores one value",
        "A function that performs calculations",
        "A method to create loops",
      ],
      correct: "A collection of elements in contiguous memory",
      xp: 50,
    },
    {
      question: "Which method adds an element to the end of a list?",
      options: ["add()", "append()", "insert()", "extend()"],
      correct: "append()",
      xp: 50,
    },
    {
      question: "How do you access the last element in a Python list?",
      options: ["list[last]", "list[-1]", "list.last()", "list.end()"],
      correct: "list[-1]",
      xp: 50,
    },
  ]

  const handleAnswerSelect = (option: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: option,
    })
  }

  const handleSubmitQuestion = () => {
    const isCorrect = selectedAnswers[currentQuestion] === questions[currentQuestion].correct
    if (isCorrect) {
      setXpEarned((prev) => prev + questions[currentQuestion].xp)
    }

    if (currentQuestion === questions.length - 1) {
      setShowResults(true)
    } else {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 1000)
    }
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setXpEarned(0)
  }

  const currentQ = questions[currentQuestion]
  const isAnswered = selectedAnswers[currentQuestion]

  if (showResults) {
    const correctCount = Object.entries(selectedAnswers).filter(
      ([idx, answer]) => questions[Number.parseInt(idx)].correct === answer,
    ).length

    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar />

        <main className="flex-1 ml-64">
          <div className="p-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-8 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>

            <div className="mx-auto max-w-md text-center">
              <div className="mb-8 rounded-2xl bg-gradient-to-b from-accent/20 to-accent/5 p-12 ring-1 ring-accent/20">
                <div className="mb-4 text-6xl">🎉</div>
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">Quiz Complete!</h1>
                <p className="text-muted-foreground mb-6">Great job, keep learning!</p>

                <div className="space-y-4 rounded-lg bg-background p-6 ring-1 ring-border">
                  <div>
                    <div className="text-sm text-muted-foreground">Score</div>
                    <div className="text-4xl font-bold text-primary">
                      {correctCount}/{questions.length}
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 rounded-lg bg-accent/10 p-3">
                    <Zap className="h-5 w-5 text-accent" />
                    <span className="font-semibold text-accent-foreground">+{xpEarned} XP Earned</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleReset} className="flex-1 bg-transparent">
                  Retake Quiz
                </Button>
                <Link href="/dashboard" className="flex-1">
                  <Button className="w-full">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-64">
        <div className="p-8">
          <Link href={`/lesson/${params.id}`}>
            <Button variant="ghost" className="mb-8 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Lesson
            </Button>
          </Link>

          <div className="mx-auto max-w-2xl">
            <div className="mb-8">
              <div className="mb-4 flex justify-between">
                <h1 className="font-display text-3xl font-bold text-foreground">Quiz Time!</h1>
                <div className="flex items-center gap-2 rounded-lg bg-accent/10 px-4 py-2">
                  <Zap className="h-5 w-5 text-accent" />
                  <span className="font-semibold text-accent-foreground">{xpEarned} XP</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    Question {currentQuestion + 1}/{questions.length}
                  </span>
                  <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mb-8 rounded-2xl bg-card p-8 ring-1 ring-border">
              <MCQCard
                question={currentQ.question}
                options={currentQ.options}
                selectedOption={selectedAnswers[currentQuestion]}
                onSelect={handleAnswerSelect}
                showResult={Boolean(isAnswered)}
                correctOption={currentQ.correct}
              />
            </div>

            <Button onClick={handleSubmitQuestion} disabled={!isAnswered} className="w-full" size="lg">
              {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
