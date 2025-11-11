"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"
import { Chrome } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block mb-6 transition-opacity hover:opacity-80">
            <Logo />
          </Link>
          <h1 className="font-display text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">Continue your learning journey</p>
        </div>

        <div className="space-y-4">
          {/* Google Sign-in */}
          <Button variant="outline" className="w-full gap-2 rounded-xl bg-transparent">
            <Chrome className="h-5 w-5" />
            Sign in with Google
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                Email
              </label>
              <Input id="email" type="email" placeholder="you@example.com" className="rounded-lg" />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                Password
              </label>
              <Input id="password" type="password" placeholder="••••••••" className="rounded-lg" />
            </div>
            <Button className="w-full rounded-lg">Sign In</Button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="#" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
