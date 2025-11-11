"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
      } else {
        setUser(user)
      }
      setLoading(false)
    }
    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  const profile = {
    name: user?.user_metadata?.name || user?.email?.split('@')[0] || "User",
    email: user?.email || "",
    joinDate: new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    avatar: (user?.user_metadata?.name || user?.email?.split('@')[0] || "U").substring(0, 2).toUpperCase(),
    stats: [
      { label: "Total XP", value: "2,450" },
      { label: "Current Level", value: "3" },
      { label: "Skills Learned", value: "12" },
    ],
    skills: [
      { name: "Python", proficiency: 85 },
      { name: "Data Structures", proficiency: 72 },
      { name: "Web Development", proficiency: 68 },
      { name: "Problem Solving", proficiency: 76 },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-[#2956D9]">NayaDisha</Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-[#2956D9]">Dashboard</Link>
            <button onClick={handleLogout} className="text-gray-600 hover:text-red-600">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Profile</h1>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-[#2956D9] text-white flex items-center justify-center text-3xl font-bold">
              {profile.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-sm text-gray-500 mt-1">Joined {profile.joinDate}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {profile.stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-[#2956D9] mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Your Skills</h3>
          <div className="space-y-6">
            {profile.skills.map((skill, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-800">{skill.name}</span>
                  <span className="text-gray-600">{skill.proficiency}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-[#2956D9] h-3 rounded-full transition-all" 
                    style={{ width: `${skill.proficiency}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-8 bg-gradient-to-r from-[#2956D9] to-[#1a3a8a] rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Keep Learning!</h3>
          <p className="mb-6">You're making great progress. Continue your journey to unlock more skills and achievements.</p>
          <Link href="/skill-path">
            <button className="bg-[#FFC947] hover:bg-[#e6b33f] text-[#2956D9] font-bold px-8 py-3 rounded-full transition-colors">
              Continue Learning
            </button>
          </Link>
        </div>
      </main>
    </div>
  )
}
