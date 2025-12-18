"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { useUser } from "@/store/useUser"
import { careerFields, getFieldById } from "@/utils/fields"
import { availableSkills, getSkillById } from "@/utils/skills"

export default function CareerPathPage() {
  const router = useRouter()
  const { user, profile, fetchUser } = useUser()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      await fetchUser()
      setLoading(false)
    }
    checkUser()
  }, [])

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

  // Get user's priority field
  const fieldId = profile?.priority_field
  const field = fieldId ? getFieldById(fieldId) : null

  // If no field selected, show default or fallback
  if (!field) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">No Career Path Selected</h1>
        <p className="text-gray-600 mb-6">Please complete your profile to see your career roadmap.</p>
        <Link href="/onboarding">
            <button className="bg-[#2956D9] text-white px-6 py-3 rounded-full font-bold">
                Go to Setup
            </button>
        </Link>
      </div>
    )
  }

  // Generate path nodes from field skills
  const pathNodes = field.skills.map((skillId, index) => {
    const skill = getSkillById(skillId)
    // Simple logic for status: 
    // First item is 'active', others 'locked' for now (since we don't have full skill tracking yet)
    // In a real app, check user_progress for this skill
    let status = "locked"
    if (index === 0) status = "active"
    
    // Check if user has progress in this skill (placeholder logic)
    // const hasProgress = profile?.completed_skills?.includes(skillId)
    // if (hasProgress) status = "completed"

    return {
      id: skillId,
      title: skill?.name || skillId,
      status: status,
      xp: (index + 1) * 100, // Placeholder XP
      icon: skill?.icon || "📚"
    }
  })

  const getNodeColor = (status: string) => {
    if (status === "completed") return "bg-green-500"
    if (status === "active") return "bg-[#FFC947]"
    return "bg-gray-400"
  }

  const getNodeBorder = (status: string) => {
    if (status === "completed") return "border-green-500"
    if (status === "active") return "border-[#FFC947]"
    return "border-gray-400"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-[#2956D9]">NayaDisha</Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-[#2956D9] flex items-center gap-2">
            <span>←</span> Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Career Path: {field.name}</h1>
            <p className="text-gray-600">Follow this roadmap to become a {field.name}</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-md">
          <div className="flex flex-col items-center space-y-6">
            {pathNodes.map((node, idx) => (
              <div key={node.id} className="flex flex-col items-center w-full">
                <Link 
                  href={node.status !== "locked" ? `/priority` : "#"} // Redirect to priority page for learning
                  className={`relative group ${node.status === "locked" ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className={`w-32 h-32 rounded-full ${getNodeColor(node.status)} border-4 ${getNodeBorder(node.status)} flex flex-col items-center justify-center shadow-lg hover:scale-105 transition-transform z-10 relative`}>
                    <div className="text-white text-center">
                      {node.status === "completed" && <span className="text-3xl">✓</span>}
                      {node.status === "active" && <span className="text-4xl">{node.icon}</span>}
                      {node.status === "locked" && <span className="text-3xl">🔒</span>}
                    </div>
                  </div>
                  
                  {/* Label */}
                  <div className="absolute top-1/2 left-36 transform -translate-y-1/2 w-48 text-left pl-4 hidden md:block">
                    <p className="font-bold text-lg text-gray-800">{node.title}</p>
                    <p className="text-sm text-gray-500">{node.status === 'locked' ? 'Complete previous step' : 'In Progress'}</p>
                  </div>

                   {/* Mobile Label (Below) */}
                   <div className="md:hidden mt-4 text-center">
                    <p className="font-bold text-gray-800">{node.title}</p>
                  </div>
                </Link>

                {/* Connecting Line */}
                {idx < pathNodes.length - 1 && (
                  <div className="h-16 w-1 bg-gray-300 my-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
