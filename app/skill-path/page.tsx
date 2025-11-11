"use client"

import { Sidebar } from "@/components/sidebar"
import { SkillTreeNode } from "@/components/skill-tree-node"

export default function SkillPathPage() {
  const skillPath = [
    { id: "1", title: "Python Basics", status: "completed" as const, xpReward: 100 },
    { id: "2", title: "Functions", status: "completed" as const, xpReward: 150 },
    { id: "3", title: "Data Structures", status: "current" as const, xpReward: 200 },
    { id: "4", title: "OOP Concepts", status: "locked" as const },
    { id: "5", title: "Web Development", status: "locked" as const },
    { id: "6", title: "Advanced Python", status: "locked" as const },
  ]

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-64">
        <div className="p-8">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">Skill Path</h1>
          <p className="text-muted-foreground mb-8">Progress through your Python learning journey</p>

          <div className="rounded-2xl bg-card p-8 ring-1 ring-border">
            <div className="space-y-8">
              {skillPath.map((node, idx) => (
                <div key={node.id}>
                  <SkillTreeNode id={node.id} title={node.title} status={node.status} xpReward={node.xpReward} />
                  {idx < skillPath.length - 1 && (
                    <div className="my-4 flex justify-center">
                      <div className="h-12 w-1 rounded-full bg-gradient-to-b from-border to-transparent" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
