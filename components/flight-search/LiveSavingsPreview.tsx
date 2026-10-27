"use client"

import { Plane, ArrowRight, ShieldCheck, Sparkles, TrendingUp, Clock, CheckCircle2 } from "lucide-react"
import { getAirport } from "@/lib/airports"
import type { CabinClass, SearchLeg } from "@/lib/search-types"

interface LiveSavingsPreviewProps {
  legs: SearchLeg[]
  cabin: CabinClass
  adults: number
  mode: "quick" | "trip"
}

// Estimated benchmarks based on route and cabin
function estimateRouteMetrics(legs: SearchLeg[], cabin: CabinClass, adults: number) {
  const originCode = legs[0]?.origin || "MAD"
  const destCode = legs[legs.length - 1]?.destination || "JNB"

  // Standard lookup values
  let cashEach = cabin === "business" ? 2840 : cabin === "premium_economy" ? 1380 : 680
  let aviosEach = cabin === "business" ? 42500 : cabin === "premium_economy" ? 31750 : 21250
  let taxesEach = cabin === "business" ? 140 : 95
  let duration = "9h 30m direct"
  let aircraft = "Airbus A350-900"

  if (destCode === "JNB" || destCode === "CPT") {
    cashEach = cabin === "business" ? 2840 : 890
    aviosEach = cabin === "business" ? 85000 : 25500
    taxesEach = cabin === "business" ? 412 : 156
    duration = "10h 45m direct"
  } else if (destCode === "NRT" || destCode === "HND") {
    cashEach = cabin === "business" ? 3600 : 1100
    aviosEach = cabin === "business" ? 70000 : 35000
    taxesEach = cabin === "business" ? 210 : 145
    duration = "14h 20m direct"
  } else if (destCode === "EZE") {
    cashEach = cabin === "business" ? 3200 : 950
    aviosEach = cabin === "business" ? 51000 : 25500
    taxesEach = cabin === "business" ? 195 : 135
    duration = "12h 15m direct"
  } else if (destCode === "LHR") {
    cashEach = cabin === "business" ? 420 : 186
    aviosEach = cabin === "business" ? 15000 : 7500
    taxesEach = cabin === "business" ? 145 : 95
    duration = "2h 25m direct"
    aircraft = "Airbus A321neo"
  }

  // Multiplier for trip legs
  const legMultiplier = legs.length > 1 ? legs.length * 0.9 : 1
  const totalCash = Math.round(cashEach * adults * legMultiplier)
  const totalAvios = Math.round(aviosEach * adults * legMultiplier)
  const totalTaxes = Math.round(taxesEach * adults * legMultiplier)
  const netSavings = Math.max(0, totalCash - totalTaxes)
  const percentSaved = Math.round((netSavings / totalCash) * 100)

  return {
    originCode,
    destCode,
    totalCash,
    totalAvios,
    totalTaxes,
    netSavings,
    percentSaved,
    duration,
    aircraft,
  }
}

export function LiveSavingsPreview({ legs, cabin, adults, mode }: LiveSavingsPreviewProps) {
  const metrics = estimateRouteMetrics(legs, cabin, adults)
  const originAirport = getAirport(metrics.originCode)
  const destAirport = getAirport(metrics.destCode)

  const cabinLabel =
    cabin === "business"
      ? "Business Class"
      : cabin === "premium_economy"
      ? "Premium Economy"
      : cabin === "first"
      ? "First Class"
      : "Economy"

  return (
    <div className="flex flex-col rounded-3xl border border-espresso/15 bg-espresso text-white p-6 shadow-xl relative overflow-hidden">
      {/* Decorative Gold & Terracotta subtle glow background */}
      <div className="absolute -top-24 -right-24 size-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 size-48 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            Award Space Available
          </span>
        </div>
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/80">
          AwardTravelFinder API
        </span>
      </div>

      {/* Route Journey Visualizer */}
      <div className="my-6 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-white/60">
          <span className="flex items-center gap-1">
            <Clock className="size-3 text-primary" /> {metrics.duration}
          </span>
          <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/80">
            {metrics.aircraft}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-3xl font-bold font-mono tracking-wider text-white">
              {metrics.originCode}
            </span>
            <span className="text-xs text-white/70">
              {originAirport?.city || metrics.originCode} {originAirport?.flag}
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center px-4">
            <div className="relative flex w-full items-center justify-center">
              <div className="w-full border-t border-dashed border-primary/60" />
              <div className="absolute flex size-7 items-center justify-center rounded-full bg-primary text-espresso shadow-md">
                <Plane className="size-3.5" />
              </div>
            </div>
            <span className="text-[10px] font-semibold text-primary mt-1">
              {cabinLabel}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-3xl font-bold font-mono tracking-wider text-white">
              {metrics.destCode}
            </span>
            <span className="text-xs text-white/70">
              {destAirport?.city || metrics.destCode} {destAirport?.flag}
            </span>
          </div>
        </div>

        {mode === "trip" && legs.length > 2 && (
          <div className="rounded-xl bg-white/5 p-2 text-center text-xs text-white/70 border border-white/10">
            ✈️ Multi-stop itinerary ({legs.length} connected legs)
          </div>
        )}
      </div>

      {/* Dynamic Price Comparison */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>Retail Google Flights Cash</span>
          <span className="line-through text-white/50 text-sm">
            €{metrics.totalCash.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-primary font-medium">A Una Milla Award</span>
            <span className="text-xl font-bold text-white">
              {metrics.totalAvios.toLocaleString()} Avios
            </span>
            <span className="text-[11px] text-white/60">
              + €{metrics.totalTaxes} airline taxes
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
              {metrics.percentSaved}% OFF
            </span>
            <span className="text-sm font-semibold text-emerald-400 mt-1">
              Save €{metrics.netSavings.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Confidence Footer */}
      <div className="mt-4 flex items-center justify-between text-[11px] text-white/60">
        <span className="flex items-center gap-1">
          <ShieldCheck className="size-3.5 text-primary" />
          Direct booking with carrier
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="size-3.5 text-emerald-400" />
          Zero booking fees
        </span>
      </div>
    </div>
  )
}
