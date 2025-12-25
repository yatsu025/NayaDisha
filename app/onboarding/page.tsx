"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"
import { useUser } from "@/store/useUser"
import { useLanguage } from "@/store/useLanguage"
import { availableSkills } from "@/utils/skills"

export default function OnboardingPage() {
    const router = useRouter()
    const { user, profile, fetchUser, updateProfile } = useUser()
    const { language } = useLanguage()
    const [loading, setLoading] = useState(true)
    const [prioritySkills, setPrioritySkills] = useState<string[]>([])
    const [unprioritySkills, setUnprioritySkills] = useState<string[]>([])
    const [customInput, setCustomInput] = useState("")
    const [step, setStep] = useState(1)

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
        } else if (!loading && profile?.profile_complete) {
            router.push("/dashboard")
        }
    }, [loading, user, profile, router])

    const togglePrioritySkill = (skillId: string) => {
        setPrioritySkills(prev =>
            prev.includes(skillId)
                ? prev.filter(id => id !== skillId)
                : prev.length < 5
                    ? [...prev, skillId]
                    : prev
        )
    }

    const toggleUnprioritySkill = (skillId: string) => {
        setUnprioritySkills(prev =>
            prev.includes(skillId)
                ? prev.filter(id => id !== skillId)
                : prev.length < 5
                    ? [...prev, skillId]
                    : prev
        )
    }

    const addCustomSkill = () => {
        if (!customInput.trim()) return
        const slug = customInput.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        if (prioritySkills.includes(slug)) {
            setCustomInput("")
            return
        }
        
        if (prioritySkills.length < 5) {
            setPrioritySkills([...prioritySkills, slug])
            setCustomInput("")
        } else {
            alert("You can only select up to 5 priority skills")
        }
    }

    const handleComplete = async () => {
        if (prioritySkills.length < 3 || unprioritySkills.length < 3) {
            alert("Please select at least 3 skills in each category")
            return
        }

        setLoading(true)

        try {
            // Update profile first
            await updateProfile({
                priority_skills: prioritySkills,
                unpriority_skills: unprioritySkills,
                profile_complete: true,
                language: language
            })

            // Generate roadmaps for priority skills
            const generatePromises = prioritySkills.map(skillSlug => 
                fetch('/api/generate-roadmap', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ field: skillSlug })
                }).then(res => {
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    return res.json();
                }).catch(err => console.error(`Failed to generate roadmap for ${skillSlug}`, err))
            )
            
            await Promise.all(generatePromises)

            router.push("/dashboard")
        } catch (error) {
            console.error("Error completing onboarding:", error)
            alert("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2956D9] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Welcome to NayaDisha! 🎉
                    </h1>
                    <p className="text-xl text-gray-600">
                        Let's personalize your learning journey
                    </p>
                    {profile && (
                        <div className="mt-4 text-gray-500">
                            <p>👤 {profile.name || profile.email}</p>
                            <p className="text-sm">Joined: {new Date(profile.joined_at).toLocaleDateString()}</p>
                        </div>
                    )}
                </motion.div>

                {/* Progress Steps */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? "bg-[#2956D9] text-white" : "bg-gray-300 text-gray-600"
                            }`}>
                            1
                        </div>
                        <div className={`w-20 h-1 ${step >= 2 ? "bg-[#2956D9]" : "bg-gray-300"}`}></div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? "bg-[#2956D9] text-white" : "bg-gray-300 text-gray-600"
                            }`}>
                            2
                        </div>
                    </div>
                </div>

                {/* Step 1: Priority Skills */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-3xl shadow-xl p-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Select Your Priority Skills (3-5)
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Choose the skills you want to focus on and master first
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                            {availableSkills.map((skill) => (
                                <motion.button
                                    key={skill.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => togglePrioritySkill(skill.id)}
                                    className={`p-4 rounded-xl border-2 transition-all ${prioritySkills.includes(skill.id)
                                        ? "border-[#2956D9] bg-blue-50 shadow-md"
                                        : "border-gray-200 hover:border-[#2956D9]"
                                        }`}
                                >
                                    <div className="text-3xl mb-2">{skill.icon}</div>
                                    <div className="font-semibold text-sm text-gray-800">{skill.name}</div>
                                </motion.button>
                            ))}
                            {/* Display Custom Selected Skills */}
                            {prioritySkills.filter(id => !availableSkills.find(s => s.id === id)).map(id => (
                                <motion.button
                                    key={id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => togglePrioritySkill(id)}
                                    className="p-4 rounded-xl border-2 transition-all border-[#2956D9] bg-blue-50 shadow-md"
                                >
                                    <div className="text-3xl mb-2">✨</div>
                                    <div className="font-semibold text-sm text-gray-800 capitalize">{id.replace(/-/g, ' ')}</div>
                                </motion.button>
                            ))}
                        </div>

                        {/* Custom Skill Input */}
                        <div className="mb-8 bg-gray-50 p-6 rounded-2xl">
                            <h3 className="font-semibold text-gray-700 mb-4">Don't see your skill? Add it here:</h3>
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    placeholder="e.g. Rust, Go, Three.js"
                                    className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-[#2956D9] outline-none"
                                    onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                                />
                                <button 
                                    onClick={addCustomSkill}
                                    className="bg-[#2956D9] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#1a3a8a] transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                                Selected: {prioritySkills.length}/5
                            </p>
                            <button
                                onClick={() => setStep(2)}
                                disabled={prioritySkills.length < 3}
                                className={`px-8 py-3 rounded-full font-bold transition-colors ${prioritySkills.length >= 3
                                    ? "bg-[#FFC947] hover:bg-[#e6b33f] text-[#2956D9]"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                Next →
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Unpriority Skills */}
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-3xl shadow-xl p-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Select Skills to Learn Later (3-5)
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Choose skills you're interested in but want to learn after mastering your priorities
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                            {availableSkills
                                .filter(skill => !prioritySkills.includes(skill.id))
                                .map((skill) => (
                                    <motion.button
                                        key={skill.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => toggleUnprioritySkill(skill.id)}
                                        className={`p-4 rounded-xl border-2 transition-all ${unprioritySkills.includes(skill.id)
                                            ? "border-[#FFC947] bg-yellow-50 shadow-md"
                                            : "border-gray-200 hover:border-[#FFC947]"
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">{skill.icon}</div>
                                        <div className="font-semibold text-sm text-gray-800">{skill.name}</div>
                                    </motion.button>
                                ))}
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => setStep(1)}
                                className="px-8 py-3 rounded-full font-bold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                            >
                                ← Back
                            </button>
                            <div className="flex items-center gap-4">
                                <p className="text-sm text-gray-500">
                                    Selected: {unprioritySkills.length}/5
                                </p>
                                <button
                                    onClick={handleComplete}
                                    disabled={unprioritySkills.length < 3 || loading}
                                    className={`px-8 py-3 rounded-full font-bold transition-colors ${unprioritySkills.length >= 3 && !loading
                                        ? "bg-[#2956D9] hover:bg-[#1a3a8a] text-white"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    {loading ? "Saving..." : "Complete Setup 🎉"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
