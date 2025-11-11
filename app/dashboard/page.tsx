"use client"

import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { ConfidenceBadge } from "@/components/confidence-badge"
import { XPBadge } from "@/components/xp-badge"
import { BookOpen, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  const userStats = {
    name: "Alex Johnson",
    confidenceScore: 72,
    xp: 2450,
    level: 3,
    continueLearning: {
      title: "Advanced Python",
      progress: 65,
      lessonNumber: 5,
    },
    recentSkills: [
      { title: "Web Development", xpEarned: 250 },
      { title: "Data Structures", xpEarned: 180 },
      { title: "JavaScript Basics", xpEarned: 150 },
    ],
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-64">
        <div className="p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              Welcome back, {userStats.name.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground">Here's your learning summary</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* Confidence Score */}
            <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
              <h2 className="mb-6 font-display font-semibold text-foreground">Your Confidence</h2>
              <ConfidenceBadge score={userStats.confidenceScore} label="Confidence Score" />
            </div>

            {/* XP Progress */}
            <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
              <h2 className="mb-6 font-display font-semibold text-foreground">Experience</h2>
              <XPBadge xp={userStats.xp} level={userStats.level} />
            </div>
          </div>

          {/* Continue Learning */}
          <div className="mb-8">
            <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 p-8 ring-1 ring-primary/20">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="mb-2 font-display text-2xl font-bold text-foreground">Continue Learning</h2>
                  <p className="text-muted-foreground mb-2">{userStats.continueLearning.title}</p>
                  <div className="mb-4 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Lesson {userStats.continueLearning.lessonNumber}</span>
                      <span className="font-medium">{userStats.continueLearning.progress}%</span>
                    </div>
                    <div className="h-2 w-64 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${userStats.continueLearning.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
                <Link href="/lesson/5">
                  <Button className="gap-2">
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Skills */}
          <div>
            <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Recent Skills</h2>
            <div className="space-y-3">
              {userStats.recentSkills.map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-card p-4 ring-1 ring-border">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                      <BookOpen className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <span className="font-medium text-foreground">{skill.title}</span>
                  </div>
                  <div className="text-sm font-semibold text-accent">+{skill.xpEarned} XP</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
