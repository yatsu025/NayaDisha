"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/store/useLanguage"
import { motion } from "framer-motion"

export default function ChooseLanguagePage() {
    const router = useRouter()
    const { setLanguage, getLanguages } = useLanguage()
    const [selected, setSelected] = useState("en")
    const languages = getLanguages()

    const handleContinue = () => {
        const lang = languages.find((l: any) => l.code === selected)
        if (lang) {
            setLanguage(lang.code, lang.name)
            router.push("/login")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2956D9] via-[#1a3a8a] to-[#0f2557] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full"
            >
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Choose Your Language
                    </h1>
                    <p className="text-xl text-blue-100">
                        अपनी भाषा चुनें | Select your preferred language
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                        {languages.map((lang: any) => (
                            <motion.button
                                key={lang.code}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelected(lang.code)}
                                className={`p-6 rounded-2xl border-2 transition-all ${selected === lang.code
                                    ? "border-[#2956D9] bg-blue-50 shadow-lg"
                                    : "border-gray-200 hover:border-[#2956D9]"
                                    }`}
                            >
                                <div className="text-4xl mb-2">🌐</div>
                                <div className="font-semibold text-gray-800">{lang.native}</div>
                                <div className="text-sm text-gray-500">{lang.name}</div>
                            </motion.button>
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleContinue}
                        className="w-full bg-[#FFC947] hover:bg-[#e6b33f] text-[#2956D9] font-bold text-xl py-4 rounded-full transition-colors shadow-lg"
                    >
                        Continue →
                    </motion.button>
                </div>

                <p className="text-center text-blue-100 mt-6 text-sm">
                    You can change your language anytime from settings
                </p>
            </motion.div>
        </div>
    )
}
