"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Bot,
  Building2,
  Calendar,
  Coins,
  CreditCard,
  Plane,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface EmptyScreenProps {
  onSelectPrompt?: (prompt: string) => void
}

const suggestedPrompts = [
  {
    icon: Plane,
    tag: "Immediate Booking",
    title: "Madrid to Johannesburg in Business",
    prompt: "Find business class award flights from Madrid (MAD) to Johannesburg (JNB) on Iberia for under €450 in taxes.",
  },
  {
    icon: Plane,
    tag: "Transatlantic",
    title: "Barcelona to New York Cash vs Avios",
    prompt: "Compare cash price vs 68,000 Avios for business class from Barcelona (BCN) to New York (JFK).",
  },
  {
    icon: Coins,
    tag: "Plan Ahead",
    title: "Spanish Card Points Strategy",
    prompt: "How can I earn 85,000 Avios in 6 months using my Revolut Metal card and everyday spending in Spain?",
  },
  {
    icon: Building2,
    tag: "Hotel Point Deals",
    title: "Hotels with Flight Point Bonuses",
    prompt: "Show me partner hotel deals in Cape Town or New York that award bonus Avios toward my flights.",
  },
]

export function EmptyScreen({ onSelectPrompt }: EmptyScreenProps) {
  const [activeMode, setActiveMode] = useState<"immediate" | "plan">("immediate")

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      {/* Hero Welcome Box */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-xl sm:p-8"
      >
        {/* Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-primary/10 blur-3xl" />

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-primary animate-pulse" />
            <Badge className="border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
              AI-Powered Flight Booking Assistant
            </Badge>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            Powered by OpenClaw & AwardTravelFinder API
          </span>
        </div>

        {/* Title */}
        <div className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight text-espresso sm:text-4xl">
            Go from 0 to 100% of your booking.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Ask anything about flight availability, cash vs. award charts, Spanish card multipliers,
            or let the assistant generate interactive itineraries and savings analyses right in chat.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-border/80 bg-secondary/40 p-1.5 sm:w-fit">
          <button
            type="button"
            onClick={() => setActiveMode("immediate")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeMode === "immediate"
                ? "bg-background text-espresso shadow-sm"
                : "text-muted-foreground hover:text-espresso"
            }`}
          >
            <Zap className="size-3.5 text-primary" />
            <span>Booking Immediately</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("plan")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeMode === "plan"
                ? "bg-background text-espresso shadow-sm"
                : "text-muted-foreground hover:text-espresso"
            }`}
          >
            <Calendar className="size-3.5 text-primary" />
            <span>Planning Ahead & Earning</span>
          </button>
        </div>

        {/* Suggested Prompts Grid */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {suggestedPrompts.map((item, idx) => {
            const Icon = item.icon
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (onSelectPrompt) {
                    onSelectPrompt(item.prompt)
                  } else {
                    const textarea = document.querySelector("textarea")
                    if (textarea) {
                      textarea.value = item.prompt
                      textarea.focus()
                    }
                  }
                }}
                className="group flex flex-col items-start rounded-2xl border border-border/80 bg-background/50 p-4 text-left transition-all hover:border-primary/60 hover:bg-background hover:shadow-md"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                    <Icon className="size-3.5" />
                    {item.tag}
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <span className="mt-2 text-sm font-bold text-espresso group-hover:text-primary">
                  {item.title}
                </span>
                <span className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {item.prompt}
                </span>
              </button>
            )
          })}
        </div>

        {/* Bottom Trust Chips */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            Zero markup · Direct airline checkout
          </span>
          <span>Official Iberia Plus & British Airways charts</span>
        </div>
      </motion.div>
    </div>
  )
}
