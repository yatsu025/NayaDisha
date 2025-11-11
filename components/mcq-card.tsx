"use client"

import { Button } from "@/components/ui/button"

interface MCQCardProps {
  question: string
  options: string[]
  selectedOption?: string
  onSelect: (option: string) => void
  showResult?: boolean
  correctOption?: string
}

export function MCQCard({ question, options, selectedOption, onSelect, showResult, correctOption }: MCQCardProps) {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-foreground">{question}</h2>
      <div className="space-y-3">
        {options.map((option, idx) => {
          const isSelected = selectedOption === option
          const isCorrect = showResult && correctOption === option
          const isWrong = showResult && isSelected && correctOption !== option

          return (
            <Button
              key={idx}
              variant="outline"
              className={`w-full justify-start rounded-lg px-6 py-4 text-left text-base transition-all ${
                isCorrect
                  ? "border-green-500 bg-green-50 text-green-900"
                  : isWrong
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border"
              }`}
              onClick={() => !showResult && onSelect(option)}
              disabled={showResult}
            >
              <span
                className={`mr-3 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                  isCorrect
                    ? "border-green-500 bg-green-500"
                    : isWrong
                      ? "border-destructive bg-destructive"
                      : isSelected
                        ? "border-primary bg-primary"
                        : "border-border"
                }`}
              >
                {isCorrect && <span className="text-white">✓</span>}
                {isWrong && <span className="text-white">✗</span>}
              </span>
              {option}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
