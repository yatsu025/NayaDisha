"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

export default function SkillPathPage() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
      }
    }
    checkUser()
  }, [router])

  const skillPath = [
    { id: "1", title: "Python Basics", status: "completed", xp: 100 },
    { id: "2", title: "Functions & Loops", status: "completed", xp: 150 },
    { id: "3", title: "Data Structures", status: "active", xp: 200 },
    { id: "4", title: "OOP Concepts", status: "locked", xp: 250 },
    { id: "5", title: "Web Development", status: "locked", xp: 300 },
    { id: "6", title: "Advanced Python", status: "locked", xp: 350 },
  ]

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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-[#2956D9]">NayaDisha</Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-[#2956D9]">← Back to Dashboard</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Skill Path</h1>
        <p className="text-gray-600 mb-8">Complete each node to unlock the next</p>

        <div className="bg-white rounded-2xl p-8 shadow-md">
          <div className="flex flex-col items-center space-y-6">
            {skillPath.map((node, idx) => (
              <div key={node.id} className="flex flex-col items-center">
                <Link 
                  href={node.status !== "locked" ? `/lesson/${node.id}` : "#"}
                  className={`relative ${node.status === "locked" ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className={`w-32 h-32 rounded-full ${getNodeColor(node.status)} border-4 ${getNodeBorder(node.status)} flex flex-col items-center justify-center shadow-lg hover:scale-105 transition-transform`}>
                    <div className="text-white text-center">
                      {node.status === "completed" && <span className="text-3xl">✓</span>}
                      {node.status === "active" && <span className="text-3xl">▶</span>}
                      {node.status === "locked" && <span className="text-3xl">🔒</span>}
                    </div>
                  </div>
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center w-40">
                    <p className="font-semibold text-gray-800">{node.title}</p>
                    <p className="text-sm text-gray-500">{node.xp} XP</p>
                  </div>
                </Link>
                {idx < skillPath.length - 1 && (
                  <div className="h-16 w-1 bg-gray-300 my-12"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
