"use client"

import { useEffect } from "react"
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { formatEuro } from "@/lib/route-label"
import type { SearchResponse } from "@/lib/search-types"

interface SavingsHeroProps {
  result: SearchResponse
}

export function SavingsHero({ result }: SavingsHeroProps) {
  const amount = result.savings.amountEur
  const count = useMotionValue(0)
  const formattedCount = useTransform(count, value =>
    Math.round(value).toLocaleString("en-GB"),
  )
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      count.set(amount)
      return
    }

    const controls = animate(count, amount, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    })
    return controls.stop
  }, [amount, count, prefersReducedMotion])

  return (
    <header className="rounded-3xl bg-espresso px-6 py-8 text-white shadow-sm sm:px-10 sm:py-10">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
            Estimated saving
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">
            <span className="sr-only">Estimated savings: {formatEuro(amount)}</span>
            <span aria-hidden="true">
              €<motion.span>{formattedCount}</motion.span>
            </span>
          </h1>
          <p className="mt-3 text-lg font-medium text-white/90 sm:text-xl">
            {result.savings.headline}
          </p>
          <p className="mt-2 text-sm text-white/65">
            {result.route.origin} → {result.route.destination} · {result.route.adults} {result.route.adults === 1 ? "traveller" : "travellers"} · {result.route.cabin.replaceAll("_", " ")}
          </p>
        </div>
        <Badge className="rounded-full border border-primary/35 bg-primary/15 px-3 py-1 text-primary-foreground">
          {result.savings.recommendation === "use_miles" ? "Use miles" : "Pay cash"}
          {result.savings.percent > 0 && ` · ${result.savings.percent}% less`}
        </Badge>
      </div>
    </header>
  )
}
