"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"
import { useUser } from "@/store/useUser"
import { useLanguage } from "@/store/useLanguage"
import { careerFields } from "@/utils/fields"

export default function OnboardingPage() {
    const router = useRouter()
    const { user, profile, fetchUser, updateProfile } = useUser()
    const { language } = useLanguage()
    const [loading, setLoading] = useState(true)
    const [priorityField, setPriorityField] = useState<string | null>(null)
    const [unpriorityField, setUnpriorityField] = useState<string | null>(null)
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

    const handleComplete = async () => {
        if (!priorityField || !unpriorityField) {
            alert("Please select a field in each category")
            return
        }

        const pField = careerFields.find(f => f.id === priorityField)
        const uField = careerFields.find(f => f.id === unpriorityField)

        if (!pField || !uField) return

        setLoading(true)

        try {
            await updateProfile({
                priority_field: pField.id,
                priority_skills: pField.skills,
                secondary_field: uField.id,
                unpriority_skills: uField.skills,
                profile_complete: true,
                language: language
            })

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

                {/* Step 1: Priority Field */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-3xl shadow-xl p-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Select Your Primary Career Path
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Choose the main field you want to build a career in
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            {careerFields.map((field) => (
                                <motion.button
                                    key={field.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setPriorityField(field.id)}
                                    className={`p-6 rounded-xl border-2 transition-all text-left flex items-start gap-4 ${priorityField === field.id
                                        ? "border-[#2956D9] bg-blue-50 shadow-md ring-2 ring-blue-200"
                                        : "border-gray-200 hover:border-[#2956D9]"
                                        }`}
                                >
                                    <div className="text-4xl">{field.icon}</div>
                                    <div>
                                        <div className="font-bold text-lg text-gray-800 mb-1">{field.name}</div>
                                        <div className="text-sm text-gray-500 line-clamp-2">{field.description}</div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                                Selected: {priorityField ? careerFields.find(f => f.id === priorityField)?.name : "None"}
                            </p>
                            <button
                                onClick={() => setStep(2)}
                                disabled={!priorityField}
                                className={`px-8 py-3 rounded-full font-bold transition-colors ${priorityField
                                    ? "bg-[#FFC947] hover:bg-[#e6b33f] text-[#2956D9]"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                Next →
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Unpriority Field */}
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-3xl shadow-xl p-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Select Secondary Interest (Learn Later)
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Choose another field you'd like to explore in the future
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            {careerFields
                                .filter(field => field.id !== priorityField)
                                .map((field) => (
                                    <motion.button
                                        key={field.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setUnpriorityField(field.id)}
                                        className={`p-6 rounded-xl border-2 transition-all text-left flex items-start gap-4 ${unpriorityField === field.id
                                            ? "border-[#2956D9] bg-blue-50 shadow-md ring-2 ring-blue-200"
                                            : "border-gray-200 hover:border-[#2956D9]"
                                            }`}
                                    >
                                        <div className="text-4xl">{field.icon}</div>
                                        <div>
                                            <div className="font-bold text-lg text-gray-800 mb-1">{field.name}</div>
                                            <div className="text-sm text-gray-500 line-clamp-2">{field.description}</div>
                                        </div>
                                    </motion.button>
                                ))}
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-gray-500 hover:text-gray-700 font-semibold"
                                >
                                    ← Back
                                </button>
                                <p className="text-sm text-gray-500 self-center">
                                    Selected: {unpriorityField ? careerFields.find(f => f.id === unpriorityField)?.name : "None"}
                                </p>
                            </div>
                            <button
                                onClick={handleComplete}
                                disabled={!unpriorityField}
                                className={`px-8 py-3 rounded-full font-bold transition-colors ${unpriorityField
                                    ? "bg-[#2956D9] hover:bg-[#1a3b9e] text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                Finish Setup 🎉
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
