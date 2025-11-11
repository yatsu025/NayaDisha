"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export default function LandingPage() {
  const [language, setLanguage] = useState("en")

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
    { code: "te", name: "తెలుగు" },
    { code: "ta", name: "தமிழ்" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Language Selector */}
          <div className="mb-12 flex gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  language === lang.code
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-border"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <Logo />
          </div>

          <h1 className="mb-4 font-display text-5xl font-bold text-foreground sm:text-6xl">
            {language === "en" ? "Your Learning Journey Starts Here" : "आपकी सीखने की यात्रा यहाँ शुरू होती है"}
          </h1>

          <p className="mb-12 max-w-2xl font-display text-xl text-muted-foreground">
            {language === "en" ? "Har student ke future ko ek nayi disha." : "हर छात्र के भविष्य को एक नई दिशा।"}
          </p>

          <Link href="/login">
            <Button size="lg" className="text-lg">
              {language === "en" ? "Start Learning" : "सीखना शुरू करें"}
            </Button>
          </Link>

          {/* Feature Cards */}
          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: "🎯",
                title: language === "en" ? "Personalized" : "व्यक्तिगत",
                description: language === "en" ? "Learning tailored for you" : "आपके लिए कस्टमाइज़्ड सीखना",
              },
              {
                icon: "🏆",
                title: language === "en" ? "Gamified" : "खेल आधारित",
                description: language === "en" ? "Earn badges and XP" : "बैज और XP अर्जित करें",
              },
              {
                icon: "📈",
                title: language === "en" ? "Progressive" : "क्रमिक",
                description: language === "en" ? "Grow at your pace" : "अपनी गति से बढ़ें",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-background p-6 shadow-sm ring-1 ring-border transition-all hover:shadow-md hover:ring-primary"
              >
                <div className="mb-3 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
