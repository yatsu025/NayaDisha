"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

interface Message {
  id: string
  role: "user" | "mentor"
  content: string
}

export default function MentorPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "mentor",
      content: "Hello! I'm your AI Mentor. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
      }
    }
    checkUser()
  }, [router])

  const suggestions = [
    "Explain data structures",
    "Help me debug this code",
    "What's the best practice?",
    "Quiz me on Python",
  ]

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages([...messages, userMessage])
    setInput("")

    // Simulate mentor response
    setTimeout(() => {
      const mentorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "mentor",
        content:
          "That's a great question! Based on your learning path, I'd recommend focusing on understanding the core concepts first before moving to advanced topics. Keep up the excellent work!",
      }
      setMessages((prev) => [...prev, mentorResponse])
    }, 500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-[#2956D9]">NayaDisha</Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-[#2956D9]">← Back to Dashboard</Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">AI Mentor</h1>
          <p className="text-gray-600">Get personalized guidance on your learning journey</p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-md p-6 mb-6 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-md rounded-2xl px-5 py-3 ${
                    message.role === "user" 
                      ? "bg-[#2956D9] text-white rounded-br-none" 
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="mb-6">
            <p className="mb-3 text-sm font-medium text-gray-600">Quick suggestions:</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="rounded-lg border-2 border-gray-300 bg-white p-3 text-left text-sm hover:border-[#2956D9] transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask your mentor anything..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#2956D9] focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              input.trim()
                ? "bg-[#FFC947] hover:bg-[#e6b33f] text-[#2956D9]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </main>
    </div>
  )
}
