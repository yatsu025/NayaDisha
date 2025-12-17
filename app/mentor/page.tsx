"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"
import { useUser } from "@/store/useUser"
import Navbar from "@/components/Navbar"

interface Message {
  id: string
  role: "user" | "mentor"
  content: string
}

export default function MentorPage() {
  const router = useRouter()
  const { user, profile, tokens, fetchUser, updateTokens } = useUser()
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)

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
      loadMentorHistory()
    }
  }, [loading, user, profile])

  // 🔥 REALTIME: Listen to user updates (includes tokens in users table)
  useEffect(() => {
    if (!profile?.id) return

    const userChannel = supabase
      .channel('user-realtime-mentor')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'users',
          filter: `id=eq.${profile.id}`
        },
        (payload) => {
          console.log('🔥 Realtime user update in mentor:', payload.new)
          fetchUser() // Refresh to get updated data
        }
      )
      .subscribe((status) => {
        console.log('📡 Mentor channel status:', status)
      })

    return () => {
      supabase.removeChannel(userChannel)
    }
  }, [profile?.id])

  const loadMentorHistory = async () => {
    if (!profile) return

    const { data } = await supabase
      .from('mentor_requests')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: true })
      .limit(10)

    const history: Message[] = []
    data?.forEach(req => {
      history.push({
        id: `user-${req.id}`,
        role: "user",
        content: req.prompt
      })
      history.push({
        id: `mentor-${req.id}`,
        role: "mentor",
        content: req.response
      })
    })

    if (history.length === 0) {
      history.push({
        id: "welcome",
        role: "mentor",
        content: "Hello! I'm your AI Mentor. I can help you with:\n\n• Personalized learning roadmaps\n• Skill recommendations\n• Career guidance\n• Motivation and tips\n\nAsk me anything! (1 token per question)"
      })
    }

    setMessages(history)
  }

  const freeSuggestions = [
    "Show my learning roadmap",
    "Analyze my skills",
    "Give me motivation",
    "What should I learn next?"
  ]

  const handleSendMessage = async () => {
    if (!input.trim() || !profile) return

    // Check if it's a free question (rule-based)
    const isFreeQuestion = freeSuggestions.some(s => 
      input.toLowerCase().includes(s.toLowerCase().split(' ')[0])
    )

    if (!isFreeQuestion && tokens < 1) {
      alert("You need tokens to ask the AI Mentor! Get more tokens from the purchase page.")
      router.push("/purchase")
      return
    }

    setSending(true)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")

    try {
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: profile.id,
          question: input
        })
      })

      const data = await response.json()

      if (data.need_payment) {
        alert("Insufficient tokens! Redirecting to purchase page...")
        router.push("/purchase")
        return
      }

      const mentorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "mentor",
        content: data.response
      }

      setMessages(prev => [...prev, mentorMessage])
      updateTokens(data.tokens_remaining)
    } catch (error) {
      console.error('Mentor error:', error)
      alert("Something went wrong. Please try again.")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2956D9]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🧠 AI Mentor</h1>
          <p className="text-gray-600">Get personalized guidance on your learning journey</p>
        </motion.div>

        {/* Token Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-[#FFC947] to-[#ffb347] rounded-2xl p-4 mb-6 flex justify-between items-center"
        >
          <div>
            <p className="text-[#2956D9] font-semibold">Your Tokens</p>
            <p className="text-3xl font-bold text-[#2956D9]">{tokens} 🪙</p>
          </div>
          <Link href="/purchase">
            <button className="bg-[#2956D9] hover:bg-[#1a3a8a] text-white font-bold px-6 py-3 rounded-full transition-colors">
              Get More Tokens
            </button>
          </Link>
        </motion.div>

        {/* Free vs Paid Info */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <h3 className="font-bold text-green-800 mb-2">🆓 Free Mentor</h3>
            <p className="text-sm text-green-700">Basic roadmap and skill suggestions (rule-based)</p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <h3 className="font-bold text-blue-800 mb-2">🤖 AI Mentor (1 token)</h3>
            <p className="text-sm text-blue-700">Personalized advice based on your profile</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-md p-6 mb-6 overflow-y-auto min-h-[400px]">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md rounded-2xl px-5 py-3 whitespace-pre-wrap ${
                    message.role === "user" 
                      ? "bg-[#2956D9] text-white rounded-br-none" 
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-2xl px-5 py-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="mb-6">
            <p className="mb-3 text-sm font-medium text-gray-600">Quick suggestions (Free):</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {freeSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(suggestion)}
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
            onKeyPress={(e) => e.key === "Enter" && !sending && handleSendMessage()}
            placeholder="Ask your mentor anything..."
            disabled={sending}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#2956D9] focus:outline-none disabled:bg-gray-100"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || sending}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              input.trim() && !sending
                ? "bg-[#FFC947] hover:bg-[#e6b33f] text-[#2956D9]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </main>
    </div>
  )
}
