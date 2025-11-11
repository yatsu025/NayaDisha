import { ArrowUpRight } from "lucide-react"

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
        <ArrowUpRight className="h-6 w-6 text-primary-foreground" strokeWidth={3} />
      </div>
      <span className="font-display text-xl font-bold text-foreground">NayaDisha</span>
    </div>
  )
}
