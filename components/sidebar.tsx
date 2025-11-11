"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "./logo"
import { Button } from "@/components/ui/button"
import { Home, BookOpen, Trophy, MessageSquare, User, LogOut } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/skill-path", label: "Skill Path", icon: BookOpen },
    { href: "/quiz", label: "Quiz", icon: Trophy },
    { href: "/mentor", label: "Mentor", icon: MessageSquare },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        <div className="border-b border-sidebar-border px-6 py-4">
          <Link href="/dashboard" className="transition-opacity hover:opacity-80">
            <Logo />
          </Link>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border px-4 py-4">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  )
}
