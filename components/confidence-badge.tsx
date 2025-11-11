export function ConfidenceBadge({ score, label }: { score: number; label: string }) {
  const segments = 5
  const filled = Math.round((score / 100) * segments)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div key={i} className={`h-3 w-8 rounded-full transition-colors ${i < filled ? "bg-primary" : "bg-muted"}`} />
        ))}
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{score}%</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}
