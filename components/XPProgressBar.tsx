"use client"

import { motion } from "framer-motion"

export default function XPProgressBar({ xp, level }: { xp: number; level: number }) {
  const xpForCurrentLevel = (level - 1) * 500
  const xpForNextLevel = level * 500
  const currentLevelXP = xp - xpForCurrentLevel
  const xpNeeded = xpForNextLevel - xpForCurrentLevel
  const progress = (currentLevelXP / xpNeeded) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="font-bold text-gray-800">Level {level}</span>
        </div>
        <span className="text-sm text-gray-600">
          {currentLevelXP} / {xpNeeded} XP
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-[#2956D9] to-[#4a7de8] rounded-full"
        />
      </div>
      
      <p className="text-xs text-gray-500 mt-1 text-right">
        {xpNeeded - currentLevelXP} XP to Level {level + 1}
      </p>
    </div>
  )
}
