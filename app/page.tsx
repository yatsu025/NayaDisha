"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push("/dashboard")
      }
    }
    checkUser()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2956D9] via-[#1a3a8a] to-[#0f2557] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-7xl font-bold text-white mb-6">
            NayaDisha
          </h1>
          <p className="text-3xl text-blue-100 mb-4">
            Learn in your language. Grow with guidance.
          </p>
          <p className="text-xl text-blue-200 mb-12">
            हर student के future को एक नई दिशा
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/login")}
            className="bg-[#FFC947] hover:bg-[#e6b33f] text-[#2956D9] font-bold text-2xl px-16 py-5 rounded-full transition-colors shadow-2xl"
          >
            Get Started →
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "🌐",
              title: "Multilingual Learning",
              description: "Learn in your native language with AI-powered translations"
            },
            {
              icon: "🎮",
              title: "Gamified Experience",
              description: "Earn XP, unlock badges, and level up as you learn"
            },
            {
              icon: "🧠",
              title: "AI Mentor",
              description: "Get personalized guidance and career roadmaps"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
            >
              <div className="text-6xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-blue-100">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16 text-blue-200"
        >
          <p>Already have an account?</p>
          <button
            onClick={() => router.push("/login")}
            className="text-[#FFC947] hover:underline font-semibold text-lg mt-2"
          >
            Sign In
          </button>
        </motion.div>
      </div>
    </div>
  )
}
