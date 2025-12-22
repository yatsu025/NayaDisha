"use client"

import { motion } from "framer-motion"
import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Play, BookOpen, Lock, Star } from "lucide-react"

export interface LevelItem {
  id: string
  title: string
  level_no: number
  video_url?: string
  theory_content?: string
  is_active?: boolean
}

export interface LevelMapProps {
  lessons: LevelItem[]
  progress: Record<number, { completed?: boolean }>
  onStartLesson: (levelId: string, type: 'video' | 'theory') => void
}

export default function LevelMap({ lessons, progress, onStartLesson }: LevelMapProps) {
  const [selectedLesson, setSelectedLesson] = useState<LevelItem | null>(null)
  const [open, setOpen] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  const sortedLessons = [...lessons].sort((a, b) => a.level_no - b.level_no)
  const levels = sortedLessons.map(l => l.level_no)

  const handleNodeClick = (lesson: LevelItem, isLocked: boolean) => {
    if (isLocked) return
    setSelectedLesson(lesson)
    setOpen(true)
  }

  return (
    <div className="flex flex-col items-center py-10 relative w-full overflow-hidden min-h-screen bg-[#87CEEB] bg-opacity-20" ref={mapRef}>
      {/* Background Decor */}
      <div className="absolute inset-0 -z-20 opacity-30 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-6xl">☁️</div>
        <div className="absolute top-40 right-20 text-6xl">☁️</div>
        <div className="absolute bottom-20 left-10 text-6xl">🌲</div>
        <div className="absolute bottom-40 right-10 text-6xl">🌳</div>
         <div className="absolute top-1/2 left-20 text-4xl">🍬</div>
         <div className="absolute top-1/3 right-1/4 text-4xl">🍭</div>
      </div>

      {/* SVG Path Background - Winding Road */}
      <svg className="absolute top-0 bottom-0 left-0 right-0 w-full h-full -z-10 pointer-events-none" preserveAspectRatio="none">
        <path 
          d={`M ${typeof window !== 'undefined' ? window.innerWidth / 2 : 200} 0 
              C ${typeof window !== 'undefined' ? window.innerWidth / 2 + 100 : 300} 100, 
                ${typeof window !== 'undefined' ? window.innerWidth / 2 - 100 : 100} 300, 
                ${typeof window !== 'undefined' ? window.innerWidth / 2 : 200} 400
              S ${typeof window !== 'undefined' ? window.innerWidth / 2 + 100 : 300} 700,
                ${typeof window !== 'undefined' ? window.innerWidth / 2 : 200} 800
              S ${typeof window !== 'undefined' ? window.innerWidth / 2 - 100 : 100} 1100,
                ${typeof window !== 'undefined' ? window.innerWidth / 2 : 200} 1200`}
          fill="none" 
          stroke="#E5E7EB" 
          strokeWidth="60" 
          strokeLinecap="round"
          className="opacity-50"
        />
        <path 
           d={`M ${typeof window !== 'undefined' ? window.innerWidth / 2 : 200} 0 
              C ${typeof window !== 'undefined' ? window.innerWidth / 2 + 100 : 300} 100, 
                ${typeof window !== 'undefined' ? window.innerWidth / 2 - 100 : 100} 300, 
                ${typeof window !== 'undefined' ? window.innerWidth / 2 : 200} 400
              S ${typeof window !== 'undefined' ? window.innerWidth / 2 + 100 : 300} 700,
                ${typeof window !== 'undefined' ? window.innerWidth / 2 : 200} 800
              S ${typeof window !== 'undefined' ? window.innerWidth / 2 - 100 : 100} 1100,
                ${typeof window !== 'undefined' ? window.innerWidth / 2 : 200} 1200`}
          fill="none" 
          stroke="#FFFFFF" 
          strokeWidth="40" 
          strokeLinecap="round"
          strokeDasharray="20 20"
        />
      </svg>

      <div className="w-full max-w-lg relative z-10 flex flex-col items-center gap-24 py-12">
        {levels.map((level, index) => {
          const lesson = sortedLessons.find(l => l.level_no === level)
          if (!lesson) return null

          const currentIndex = sortedLessons.findIndex(l => l.level_no === level)
          const isCompleted = !!progress[level]?.completed
          const isLocked = currentIndex > 0 && !progress[sortedLessons[currentIndex - 1].level_no]?.completed

          const xOffset = Math.sin(currentIndex * 0.8) * 100

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
              style={{ 
                transform: `translateX(${xOffset}px)` 
              }}
            >
              <div className="flex flex-col items-center">
                <motion.button
                  whileHover={{ scale: isLocked ? 1 : 1.15, rotate: isLocked ? 0 : [0, -5, 5, 0] }}
                  whileTap={{ scale: isLocked ? 1 : 0.9 }}
                  onClick={() => handleNodeClick(lesson, !!isLocked)}
                  className={`
                    relative w-24 h-24 rounded-full flex items-center justify-center
                    shadow-[0_8px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[8px]
                    transition-all duration-200
                    ${isCompleted 
                      ? 'bg-gradient-to-b from-green-400 to-green-600 border-4 border-white ring-4 ring-green-200' 
                      : isLocked 
                        ? 'bg-gray-300 border-4 border-gray-400 cursor-not-allowed grayscale'
                        : 'bg-gradient-to-b from-yellow-300 to-orange-500 border-4 border-white ring-4 ring-yellow-200 animate-pulse'
                    }
                  `}
                >
                  {isCompleted ? (
                    <div className="text-4xl text-white drop-shadow-md">⭐</div>
                  ) : isLocked ? (
                    <Lock className="text-gray-500 w-10 h-10" />
                  ) : (
                    <span className="text-4xl font-black text-white drop-shadow-md">{lesson.level_no}</span>
                  )}
                  {!isLocked && (
                    <div className="absolute top-2 right-4 w-6 h-6 bg-white opacity-40 rounded-full blur-[2px]" />
                  )}
                </motion.button>
                
                <div className={`
                  mt-4 px-4 py-2 rounded-full font-bold text-sm shadow-md max-w-[150px] text-center truncate
                  ${isLocked ? 'bg-gray-200 text-gray-500' : 'bg-white text-gray-800'}
                `}>
                  {lesson.title}
                </div>
                
                {isCompleted && (
                  <div className="flex gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
        
        {/* End of Map */}
        <div className="mt-12 text-center opacity-60">
           <p className="text-gray-600 font-bold">More levels coming soon!</p>
           <div className="text-4xl mt-2">🏗️</div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-4 border-[#2956D9]/20 rounded-3xl shadow-2xl">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-4 text-white">
              {selectedLesson?.level_no}
            </div>
            <DialogTitle className="text-2xl font-black text-center text-gray-800">
              {selectedLesson?.title}
            </DialogTitle>
            <DialogDescription className="text-center text-lg text-gray-600 font-medium">
              Ready to master this skill?
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-6">
            <Button 
              variant="outline" 
              className="h-40 flex flex-col gap-3 rounded-2xl border-2 hover:border-blue-500 hover:bg-blue-50 transition-all group relative overflow-hidden"
              onClick={() => {
                if (selectedLesson) onStartLesson(selectedLesson.id, 'theory')
                setOpen(false)
              }}
            >
              <div className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-20 transition-opacity" />
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen size={32} className="text-blue-600" />
              </div>
              <div className="text-center">
                <span className="block font-bold text-xl text-gray-800">Theory</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Read & Learn</span>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="h-40 flex flex-col gap-3 rounded-2xl border-2 hover:border-red-500 hover:bg-red-50 transition-all group relative overflow-hidden"
              onClick={() => {
                if (selectedLesson) onStartLesson(selectedLesson.id, 'video')
                setOpen(false)
              }}
            >
              <div className="absolute inset-0 bg-red-100 opacity-0 group-hover:opacity-20 transition-opacity" />
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={32} className="text-red-600 ml-1" />
              </div>
              <div className="text-center">
                <span className="block font-bold text-xl text-gray-800">Video</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Watch Class</span>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
