export function XPBadge({ xp, level }: { xp: number; level: number }) {
  const nextLevelXp = level * 500
  const progressPercent = (xp / nextLevelXp) * 100

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-4xl font-bold text-accent">{xp}</div>
          <div className="text-sm text-muted-foreground">XP earned</div>
        </div>
        <div className="flex items-center justify-center rounded-full bg-accent w-16 h-16">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-foreground">{level}</div>
            <div className="text-xs text-accent-foreground">Level</div>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">To next level</span>
          <span className="font-medium">{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
    </div>
  )
}
