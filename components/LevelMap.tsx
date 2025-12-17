"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Play, BookOpen, Lock, CheckCircle, Star } from "lucide-react"

interface Lesson {
  id: string
  title: string
  description: string
  level: number
  xp_reward: number
  video_url?: string
  theory_content?: string
}

interface LevelMapProps {
  lessons: Lesson[]
  progress: Record<string, any>
  onStartLesson: (lessonId: string, type: 'video' | 'theory') => void
}

export default function LevelMap({ lessons, progress, onStartLesson }: LevelMapProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [open, setOpen] = useState(false)

  // Group lessons by level
  const levels = Array.from(new Set(lessons.map(l => l.level))).sort((a, b) => a - b)

  const handleNodeClick = (lesson: Lesson, isLocked: boolean) => {
    if (isLocked) return
    setSelectedLesson(lesson)
    setOpen(true)
  }

  return (
    <div className="flex flex-col items-center py-10 relative">
      {/* Path Line (Simple vertical line for now, can be SVG winding path) */}
      <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-gray-200 -z-10 transform -translate-x-1/2 rounded-full" />

      {levels.map((level, levelIndex) => {
        const levelLessons = lessons.filter(l => l.level === level)
        const isEven = levelIndex % 2 === 0

        return (
          <div key={level} className="w-full max-w-md mb-12 relative">
             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-bold text-gray-100 -z-20">
               {level}
             </div>
            
            <div className={`flex flex-wrap gap-8 justify-center ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
              {levelLessons.map((lesson, index) => {
                const lessonProgress = progress[lesson.id]
                const isCompleted = lessonProgress?.completed
                const isLocked = level > 1 && !lessons.some(l => l.level === level - 1 && progress[l.id]?.completed) 
                  // Simple lock logic: locked if previous level not fully done? 
                  // Or just check if previous lesson in sequence is done. 
                  // For now, let's keep it simple: Unlock if previous level has at least one completion or if it's level 1.
                  && levelIndex > 0 
                  && !lessons.filter(l => l.level === level - 1).some(l => progress[l.id]?.completed)

                return (
                  <motion.div
                    key={lesson.id}
                    whileHover={{ scale: isLocked ? 1 : 1.1 }}
                    whileTap={{ scale: isLocked ? 1 : 0.95 }}
                    onClick={() => handleNodeClick(lesson, !!isLocked)}
                    className="relative z-10"
                  >
                    <div 
                      className={`
                        w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-lg cursor-pointer transition-all
                        ${isCompleted 
                          ? 'bg-green-500 border-green-600 text-white' 
                          : isLocked 
                            ? 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed'
                            : 'bg-yellow-400 border-yellow-500 text-white animate-pulse'
                        }
                      `}
                    >
                      {isCompleted ? <CheckCircle size={32} /> : isLocked ? <Lock size={32} /> : <Star size={32} fill="white" />}
                    </div>
                    
                    {/* Label */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded shadow text-xs font-bold text-gray-700">
                      {lesson.title.substring(0, 15)}{lesson.title.length > 15 && '...'}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )
      })}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">{selectedLesson?.title}</DialogTitle>
            <DialogDescription className="text-center">
              Choose how you want to learn
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button 
              variant="outline" 
              className="h-32 flex flex-col gap-2 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700 transition-all"
              onClick={() => {
                if (selectedLesson) onStartLesson(selectedLesson.id, 'theory')
                setOpen(false)
              }}
            >
              <BookOpen size={40} className="text-blue-500" />
              <span className="font-bold text-lg">Theory</span>
              <span className="text-xs text-gray-500">Read & Learn</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-32 flex flex-col gap-2 hover:bg-red-50 hover:border-red-500 hover:text-red-700 transition-all"
              onClick={() => {
                if (selectedLesson) onStartLesson(selectedLesson.id, 'video')
                setOpen(false)
              }}
            >
              <Play size={40} className="text-red-500" />
              <span className="font-bold text-lg">Video</span>
              <span className="text-xs text-gray-500">Watch & Listen</span>
            </Button>
          </div>
          
          <DialogFooter className="sm:justify-center">
            <div className="text-center text-sm text-gray-500">
              Reward: <span className="font-bold text-yellow-600">{selectedLesson?.xp_reward} XP</span>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
