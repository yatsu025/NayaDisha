"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useUser } from "@/store/useUser"
import Navbar from "@/components/Navbar"
import { availableSkills, getSkillsByIds } from "@/utils/skills"

export default function SkillMentorPage() {
  const router = useRouter()
  const { user, profile, fetchUser } = useUser()
  const [loading, setLoading] = useState(true)
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2956D9]"></div>
      </div>
    )
  }

  const prioritySkills = getSkillsByIds(profile?.priority_skills || [])
  const unprioritySkills = getSkillsByIds(profile?.unpriority_skills || [])

  const getSkillAdvice = (skillId: string) => {
    const skill = availableSkills.find(s => s.id === skillId)
    if (!skill) return ""

    const adviceMap: { [key: string]: any } = {
      python: {
        priority: "🐍 Python is excellent as a priority! It's versatile, beginner-friendly, and in high demand. Focus on: basics → data structures → OOP → frameworks (Django/Flask). Great for data science, web dev, and automation.",
        unpriority: "🐍 Python is a great choice for later! Once you master your priority skills, Python will be easy to learn. It's perfect for expanding into data science, automation, or backend development.",
        general: "🐍 Python is one of the most popular programming languages. Used in web development, data science, AI/ML, automation, and more. Easy to learn, powerful to use."
      },
      javascript: {
        priority: "⚡ JavaScript is essential for web development! Focus on: fundamentals → DOM manipulation → ES6+ → React/Vue. This opens doors to frontend, backend (Node.js), and mobile (React Native).",
        unpriority: "⚡ JavaScript is perfect for later! After mastering your priorities, JS will help you build interactive websites and full-stack applications. Great for career flexibility.",
        general: "⚡ JavaScript powers the web! Essential for frontend development, also used in backend (Node.js), mobile apps, and even desktop applications."
      },
      "data-science": {
        priority: "📊 Data Science is a hot field! Focus on: Python/R → statistics → pandas/numpy → machine learning → visualization. High demand, great salaries, impactful work.",
        unpriority: "📊 Data Science is excellent for later! It builds on programming and math skills. Once you're comfortable with coding, diving into data analysis will be much easier.",
        general: "📊 Data Science combines programming, statistics, and domain knowledge to extract insights from data. Used in business, healthcare, finance, and more."
      },
      "web-development": {
        priority: "🌐 Web Development is a great priority! Learn: HTML/CSS → JavaScript → React → backend (Node.js/Python). Immediate job opportunities, freelance potential, visible results.",
        unpriority: "🌐 Web Development is perfect for later! It's practical and rewarding. After your priorities, you can quickly build websites and web apps to showcase your skills.",
        general: "🌐 Web Development involves building websites and web applications. Frontend (what users see) and backend (server, database) work together."
      },
      "mobile-development": {
        priority: "📱 Mobile Development is in demand! Focus on: programming basics → React Native/Flutter → UI/UX → app deployment. Build apps used by millions!",
        unpriority: "📱 Mobile Development is great for later! It requires solid programming foundation. After your priorities, you can create iOS/Android apps.",
        general: "📱 Mobile Development creates apps for smartphones and tablets. Native (iOS/Android) or cross-platform (React Native, Flutter)."
      },
      database: {
        priority: "🗄️ Database skills are fundamental! Learn: SQL basics → database design → queries → optimization. Essential for backend development and data roles.",
        unpriority: "🗄️ Databases are important for later! They complement programming skills. After your priorities, understanding data storage will complete your skillset.",
        general: "🗄️ Databases store and organize data. SQL (relational) and NoSQL (document-based) are the main types. Critical for any application."
      },
      devops: {
        priority: "⚙️ DevOps is valuable! Focus on: Linux → Git → Docker → CI/CD → cloud platforms. High demand, good salaries, bridges development and operations.",
        unpriority: "⚙️ DevOps is excellent for later! It requires understanding of development first. After your priorities, DevOps skills will make you a complete engineer.",
        general: "⚙️ DevOps combines development and operations. Automates deployment, manages infrastructure, ensures reliability. Essential for modern software."
      },
      "ui-ux": {
        priority: "🎨 UI/UX is creative and impactful! Learn: design principles → Figma/Adobe XD → user research → prototyping. Make products people love to use!",
        unpriority: "🎨 UI/UX is great for later! It complements technical skills. After your priorities, design thinking will make you a well-rounded developer.",
        general: "🎨 UI/UX Design focuses on user experience and interface design. Makes products intuitive, beautiful, and user-friendly."
      },
      "cloud-computing": {
        priority: "☁️ Cloud Computing is the future! Focus on: AWS/Azure/GCP basics → services → architecture → security. High demand, excellent career growth.",
        unpriority: "☁️ Cloud Computing is perfect for later! It builds on programming and networking. After your priorities, cloud skills will boost your career significantly.",
        general: "☁️ Cloud Computing delivers computing services over the internet. Scalable, cost-effective, powers modern applications."
      },
      cybersecurity: {
        priority: "🔒 Cybersecurity is critical! Learn: networking → security fundamentals → ethical hacking → cryptography. Protect systems, high demand, rewarding career.",
        unpriority: "🔒 Cybersecurity is excellent for later! It requires technical foundation. After your priorities, security skills will make you invaluable.",
        general: "🔒 Cybersecurity protects systems, networks, and data from attacks. Essential in today's digital world. Always in demand."
      },
      blockchain: {
        priority: "⛓️ Blockchain is emerging! Focus on: programming → blockchain basics → smart contracts → DApps. Cutting-edge technology, innovative projects.",
        unpriority: "⛓️ Blockchain is great for later! It's specialized and evolving. After your priorities, you can explore this exciting frontier.",
        general: "⛓️ Blockchain is distributed ledger technology. Powers cryptocurrencies, smart contracts, and decentralized applications."
      },
      "machine-learning": {
        priority: "🤖 Machine Learning is powerful! Learn: Python → math/statistics → ML algorithms → deep learning. AI is transforming industries!",
        unpriority: "🤖 Machine Learning is perfect for later! It requires strong programming and math. After your priorities, ML will open amazing opportunities.",
        general: "🤖 Machine Learning teaches computers to learn from data. Powers AI applications, predictions, and automation."
      }
    }

    const skillAdvice = adviceMap[skillId]
    if (!skillAdvice) return "This skill is valuable for your career growth!"

    if (profile?.priority_skills?.includes(skillId)) {
      return skillAdvice.priority
    } else if (profile?.unpriority_skills?.includes(skillId)) {
      return skillAdvice.unpriority
    } else {
      return skillAdvice.general
    }
  }

  const getGeneralAdvice = () => {
    const priorityCount = profile?.priority_skills?.length || 0
    const unpriorityCount = profile?.unpriority_skills?.length || 0

    if (priorityCount === 0 && unpriorityCount === 0) {
      return {
        title: "🎯 Start Your Learning Journey!",
        message: "You haven't selected any skills yet. Let me help you choose the right path based on your goals.",
        tips: [
          "💼 For Job Seekers: Start with Web Development or Python - high demand, quick results",
          "📊 For Data Enthusiasts: Choose Data Science and Python - analyze data, build ML models",
          "🎨 For Creatives: Pick UI/UX and Web Development - design beautiful, functional products",
          "🚀 For Entrepreneurs: Learn Full Stack (Web Dev + Database + Cloud) - build your own products"
        ]
      }
    }

    if (priorityCount < 3) {
      return {
        title: "⚠️ Add More Priority Skills!",
        message: "You need at least 3 priority skills to create a solid learning foundation.",
        tips: [
          "🎯 Choose skills that align with your career goals",
          "💡 Pick complementary skills (e.g., Python + Data Science + Machine Learning)",
          "⏰ Focus on skills with immediate job opportunities",
          "📈 Balance between foundational and specialized skills"
        ]
      }
    }

    if (unpriorityCount < 3) {
      return {
        title: "📚 Add Skills to Learn Later!",
        message: "Select skills you're interested in but want to learn after mastering your priorities.",
        tips: [
          "🔮 Think about future career directions",
          "🌟 Choose skills that complement your priorities",
          "💪 Pick skills that challenge you to grow",
          "🎓 Consider emerging technologies for long-term growth"
        ]
      }
    }

    return {
      title: "✅ Perfect Balance!",
      message: "You have a great mix of priority and later skills. Here's your personalized roadmap:",
      tips: [
        `🎯 Focus on: ${prioritySkills.slice(0, 2).map((s: any) => s.name).join(', ')} first`,
        "📅 Dedicate 1-2 hours daily to your priority skills",
        "🏆 Complete projects to solidify your learning",
        `🔜 After 3-6 months, start exploring: ${unprioritySkills.slice(0, 2).map((s: any) => s.name).join(', ')}`
      ]
    }
  }

  const advice = getGeneralAdvice()

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                🧠 AI Skill Mentor
              </h1>
              <p className="text-gray-600 text-lg">
                Get personalized advice on choosing and prioritizing your learning skills
              </p>
            </div>
            <Link href="/profile">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-6 py-3 rounded-full transition-colors">
                ← Back to Profile
              </button>
            </Link>
          </div>
        </motion.div>

        {/* General Advice Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl shadow-2xl p-8 text-white mb-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="text-6xl">🎓</div>
            <div>
              <h2 className="text-3xl font-bold mb-2">{advice.title}</h2>
              <p className="text-xl text-white/90">{advice.message}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {advice.tips.map((tip, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-white">{tip}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Current Skills Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Priority Skills */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ⭐ Your Priority Skills ({prioritySkills.length})
            </h3>
            {prioritySkills.length > 0 ? (
              <div className="space-y-3">
                {prioritySkills.map((skill: any) => (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedSkill === skill.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{skill.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-800">{skill.name}</div>
                        <div className="text-sm text-gray-500">Click for advice</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No priority skills selected yet. Go to profile to add skills!
              </p>
            )}
          </motion.div>

          {/* Unpriority Skills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              📚 Learning Later ({unprioritySkills.length})
            </h3>
            {unprioritySkills.length > 0 ? (
              <div className="space-y-3">
                {unprioritySkills.map((skill: any) => (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedSkill === skill.id
                        ? "border-purple-500 bg-purple-50 shadow-md"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{skill.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-800">{skill.name}</div>
                        <div className="text-sm text-gray-500">Click for advice</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No later skills selected yet. Go to profile to add skills!
              </p>
            )}
          </motion.div>
        </div>

        {/* Detailed Skill Advice */}
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="text-6xl">
                {availableSkills.find(s => s.id === selectedSkill)?.icon}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {availableSkills.find(s => s.id === selectedSkill)?.name}
                </h3>
                <p className="text-lg text-gray-600">
                  {getSkillAdvice(selectedSkill)}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <h4 className="font-bold text-gray-800 mb-3">📚 Learning Resources:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Start with free courses on YouTube and freeCodeCamp</li>
                <li>• Practice on platforms like LeetCode, HackerRank, or Codecademy</li>
                <li>• Build real projects to apply your knowledge</li>
                <li>• Join communities on Discord, Reddit, or Stack Overflow</li>
                <li>• Follow industry experts on Twitter and LinkedIn</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-center gap-4"
        >
          <Link href="/profile">
            <button className="bg-[#2956D9] hover:bg-[#1a3a8a] text-white font-bold px-8 py-4 rounded-full transition-colors shadow-lg">
              Edit My Skills
            </button>
          </Link>
          <Link href="/priority">
            <button className="bg-[#FFC947] hover:bg-[#e6b33f] text-[#2956D9] font-bold px-8 py-4 rounded-full transition-colors shadow-lg">
              Start Learning
            </button>
          </Link>
        </motion.div>
      </main>
    </div>
  )
}
