import { CheckCircle2, Lock, Circle } from "lucide-react"

interface SkillNodeProps {
  id: string
  title: string
  status: "completed" | "current" | "locked"
  xpReward?: number
}

export function SkillTreeNode({ title, status, xpReward }: SkillNodeProps) {
  const statusConfig = {
    completed: {
      bgColor: "bg-green-100 ring-green-300",
      iconColor: "text-green-600",
      icon: CheckCircle2,
    },
    current: {
      bgColor: "bg-accent ring-accent/50",
      iconColor: "text-accent-foreground",
      icon: Circle,
    },
    locked: {
      bgColor: "bg-muted ring-muted-foreground/20",
      iconColor: "text-muted-foreground",
      icon: Lock,
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`flex h-16 w-16 items-center justify-center rounded-full ring-2 ${config.bgColor}`}>
        <Icon className={`h-8 w-8 ${config.iconColor}`} />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {xpReward && status !== "locked" && <p className="text-xs text-accent">+{xpReward} XP</p>}
      </div>
    </div>
  )
}
