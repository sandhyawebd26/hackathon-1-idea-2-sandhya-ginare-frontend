"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Coins,
  CreditCard,
  HelpCircle,
  Sparkles,
  Zap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface EarnStrategyProps {
  targetPoints: number
  targetDestination: string
  cabin: string
  currentPoints?: number
  defaultMonthlySpend?: number
}

export function EarnStrategyCard({
  targetPoints = 85000,
  targetDestination = "Johannesburg (JNB)",
  cabin = "Business Class",
  currentPoints = 25000,
  defaultMonthlySpend = 2000,
}: Partial<EarnStrategyProps>) {
  const [monthlySpend, setMonthlySpend] = useState(defaultMonthlySpend)
  const [selectedCard, setSelectedCard] = useState<"revolut" | "amex">("revolut")

  const pointsGap = Math.max(0, targetPoints - currentPoints)
  
  // Calculate earn rate:
  // Revolut Metal: 1 RevPoint per €2 spent (0.5/€) + roundups (~300/mo)
  // Amex Business Platinum: 1 MR per €1 spent (1.0/€)
  const monthlyEarned = selectedCard === "revolut" 
    ? Math.round(monthlySpend * 0.5 + 400) 
    : Math.round(monthlySpend * 1.0)
    
  const monthsRequired = Math.ceil(pointsGap / monthlyEarned)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="my-3 w-full max-w-2xl overflow-hidden rounded-2xl border border-border/90 bg-card p-5 shadow-md sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Coins className="size-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-espresso">
              Personalized Points Roadmap
            </h3>
            <p className="text-xs text-muted-foreground">
              Goal: {targetPoints.toLocaleString()} Avios for {targetDestination} ({cabin})
            </p>
          </div>
        </div>
        <Badge className="border-primary/20 bg-primary/10 font-mono text-xs text-primary">
          Need {pointsGap.toLocaleString()} more Avios
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="my-4">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>Current: {currentPoints.toLocaleString()} Avios</span>
          <span>Target: {targetPoints.toLocaleString()} Avios</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${Math.min(100, Math.round((currentPoints / targetPoints) * 100))}%` }}
          />
        </div>
      </div>

      {/* Recommended Strategy Cards for Spain */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Revolut Strategy */}
        <div
          onClick={() => setSelectedCard("revolut")}
          className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
            selectedCard === "revolut"
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border/80 bg-background/50 hover:border-primary/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso">Revolut Spain (Metal/Ultra)</span>
            <Badge className="border-border bg-secondary text-[10px] text-espresso">1:1 Transfer</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Earn RevPoints on all Spanish grocery, dining & bill payments. Instantly transfer 1:1 to Iberia Avios.
          </p>
          <div className="mt-2 text-xs font-bold text-primary">
            ~{(monthlySpend * 0.5 + 400).toLocaleString()} Avios / mo
          </div>
        </div>

        {/* BA Booster Strategy */}
        <div
          onClick={() => setSelectedCard("amex")}
          className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
            selectedCard === "amex"
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border/80 bg-background/50 hover:border-primary/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso">BA Avios Booster & Amex</span>
            <Badge className="border-border bg-secondary text-[10px] text-espresso">Instant Boost</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Triple past flight points for only €0.0105/point or use Amex Spain MR cards with 1:1 Iberia transfer.
          </p>
          <div className="mt-2 text-xs font-bold text-primary">
            ~{monthlySpend.toLocaleString()} Avios / mo
          </div>
        </div>
      </div>

      {/* Interactive Spend Estimator Slider */}
      <div className="mt-5 rounded-xl border border-border/80 bg-secondary/30 p-4">
        <div className="flex items-center justify-between text-xs font-medium text-espresso">
          <span>Your estimated monthly spend:</span>
          <span className="text-sm font-bold text-primary">€{monthlySpend.toLocaleString("es-ES")}/mo</span>
        </div>
        <input
          type="range"
          min={500}
          max={6000}
          step={250}
          value={monthlySpend}
          onChange={e => setMonthlySpend(Number(e.target.value))}
          className="mt-2.5 h-2 w-full cursor-pointer accent-primary"
        />

        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="size-3.5 text-primary" />
            <span>Time to reach flight:</span>
          </div>
          <span className="font-bold text-espresso">
            ~{monthsRequired} months ({monthsRequired <= 6 ? "Ready for Summer!" : "Perfect for next season"})
          </span>
        </div>
      </div>
    </motion.div>
  )
}
