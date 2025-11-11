"use client"

import { useState } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function LessonPage({ params }: { params: { id: string } }) {
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  const lessonContent = {
    id: params.id,
    title: "Understanding Data Structures",
    description: "Learn the fundamentals of arrays, lists, and dictionaries",
    content: {
      en: "Arrays are collections of elements stored in contiguous memory locations. They allow you to store multiple values of the same type under a single variable name. In Python, we use lists which are more flexible than traditional arrays.",
      es: "Los arrays son colecciones de elementos almacenados en ubicaciones de memoria contiguas. Permiten almacenar múltiples valores del mismo tipo bajo un único nombre de variable.",
    },
  }

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
  ]

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <Link href="/skill-path">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Skill Path
            </Button>
          </Link>

          <h1 className="font-display text-4xl font-bold text-foreground mb-2">{lessonContent.title}</h1>
          <p className="text-muted-foreground mb-8">{lessonContent.description}</p>

          {/* Language Switcher */}
          <div className="mb-8 flex gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  selectedLanguage === lang.code
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-border"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>

          {/* Split View */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Content */}
            <div className="rounded-2xl bg-card p-8 ring-1 ring-border">
              <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
                {selectedLanguage === "en" ? "English" : "Español"}
              </h2>
              <p className="leading-relaxed text-foreground">
                {selectedLanguage === "en" ? lessonContent.content.en : lessonContent.content.es}
              </p>
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-foreground">Key Points:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Elements are stored in memory locations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Fast access through indexing</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Fixed size in traditional arrays</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Code Example */}
            <div className="rounded-2xl bg-card p-8 ring-1 ring-border">
              <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Code Example</h2>
              <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                <code>{`# Python List Example
numbers = [1, 2, 3, 4, 5]
names = ["Alice", "Bob", "Charlie"]

# Accessing elements
first = numbers[0]  # 1
last = names[-1]    # "Charlie"

# Adding elements
numbers.append(6)
names.extend(["David"])`}</code>
              </pre>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Link href={`/lesson/${Number.parseInt(params.id) - 1}`}>
              <Button variant="outline" className="gap-2 bg-transparent" disabled={Number.parseInt(params.id) === 1}>
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
            </Link>
            <Link href={`/quiz/${params.id}`}>
              <Button className="gap-2">
                Take Quiz
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
