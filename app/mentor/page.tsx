"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface Message {
  id: string
  role: "user" | "mentor"
  content: string
}

export default function MentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "mentor",
      content: "Hello! I'm your AI Mentor. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")

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
    <div className="flex bg-background min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-64">
        <div className="flex h-screen flex-col p-8">
          <div className="mb-6">
            <h1 className="font-display text-4xl font-bold text-foreground">Ask Your Mentor</h1>
            <p className="text-muted-foreground">Get personalized guidance on your learning journey</p>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-4 rounded-2xl bg-card p-6 ring-1 ring-border">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs rounded-2xl px-4 py-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="mb-6">
              <p className="mb-3 text-sm font-medium text-muted-foreground">Quick suggestions:</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="rounded-lg border border-border bg-background p-3 text-left text-sm hover:bg-muted transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask your mentor anything..."
              className="rounded-lg"
            />
            <Button onClick={handleSendMessage} className="gap-2" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
