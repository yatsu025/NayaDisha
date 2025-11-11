"use client"

import Link from "next/link"
import { Logo } from "./logo"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm">Start Learning</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
