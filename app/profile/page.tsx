"use client"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Edit2, Trophy, BookOpen, Zap } from "lucide-react"

export default function ProfilePage() {
  const profile = {
    name: "Alex Johnson",
    email: "alex@example.com",
    joinDate: "January 2024",
    avatar: "AJ",
    stats: [
      { label: "Total XP", value: "2,450", icon: Zap },
      { label: "Current Level", value: "3", icon: Trophy },
      { label: "Skills Learned", value: "12", icon: BookOpen },
    ],
    skills: [
      { name: "Python", proficiency: 85 },
      { name: "JavaScript", proficiency: 72 },
      { name: "Data Analysis", proficiency: 68 },
      { name: "Web Design", proficiency: 76 },
    ],
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-64">
        <div className="p-8">
          <h1 className="font-display text-4xl font-bold text-foreground mb-8">Profile</h1>

          {/* Profile Header */}
          <div className="mb-8 rounded-2xl bg-card p-8 ring-1 ring-border">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-4xl font-bold text-primary-foreground">
                  {profile.avatar}
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">Joined {profile.joinDate}</p>
                </div>
              </div>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {profile.stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="rounded-lg bg-card p-6 ring-1 ring-border text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* Skills Section */}
          <div className="rounded-2xl bg-card p-8 ring-1 ring-border">
            <h3 className="mb-6 font-display text-xl font-semibold text-foreground">Your Skills</h3>
            <div className="space-y-4">
              {profile.skills.map((skill, idx) => (
                <div key={idx}>
                  <div className="mb-2 flex justify-between">
                    <span className="font-medium text-foreground">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.proficiency}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${skill.proficiency}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
