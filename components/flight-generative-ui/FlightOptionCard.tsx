"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  Clock,
  ExternalLink,
  Info,
  Luggage,
  Plane,
  Sparkles,
  TrendingDown,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface FlightOptionProps {
  id: string
  airline: string
  flightNumber: string
  originCode: string
  originCity: string
  destCode: string
  destCity: string
  departureDate: string
  returnDate?: string
  cabin: "Business Class" | "Premium Economy" | "Economy"
  duration: string
  stops: "Direct" | "1 Stop"
  cashPriceEur: number
  awardAvios: number
  taxesEur: number
  bookingUrl: string
  program: "Iberia Plus" | "British Airways Club" | "Qatar Privilege"
  verifiedSeatsRemaining?: number
}

export function FlightOptionCard({
  id = "ib-mad-jnb",
  airline = "Iberia",
  flightNumber = "IB6051",
  originCode = "MAD",
  originCity = "Madrid",
  destCode = "JNB",
  destCity = "Johannesburg",
  departureDate = "Jul 12, 2026",
  returnDate = "Jul 26, 2026",
  cabin = "Business Class",
  duration = "10h 25m",
  stops = "Direct",
  cashPriceEur = 2840,
  awardAvios = 85000,
  taxesEur = 412,
  bookingUrl = "https://www.iberia.com",
  program = "Iberia Plus",
  verifiedSeatsRemaining = 2,
}: Partial<FlightOptionProps>) {
  const [isSaved, setIsSaved] = useState(false)
  const savingsEur = Math.max(0, cashPriceEur - taxesEur)
  const savingsPercent = Math.round((savingsEur / cashPriceEur) * 100)

  function handleSaveItinerary() {
    setIsSaved(prev => !prev)
    if (!isSaved) {
      toast.success("Itinerary saved to your account!", {
        description: `${originCity} (${originCode}) → ${destCity} (${destCode}) in ${cabin}`,
      })
    } else {
      toast.info("Itinerary removed from saved trips.")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="my-3 w-full max-w-2xl overflow-hidden rounded-2xl border border-border/90 bg-card shadow-md transition-shadow hover:shadow-lg"
    >
      {/* Top Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 bg-secondary/40 px-5 py-3">
        <div className="flex items-center gap-2">
          <Badge className="border-primary/20 bg-primary/10 text-xs font-semibold text-primary">
            {program}
          </Badge>
          <span className="text-xs font-medium text-muted-foreground">
            {airline} · Flight {flightNumber}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {verifiedSeatsRemaining ? (
            <span className="flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {verifiedSeatsRemaining} award seats open
            </span>
          ) : null}
          <span className="rounded-full bg-espresso/5 px-2 py-0.5 text-[11px] font-semibold text-espresso">
            {cabin}
          </span>
        </div>
      </div>

      {/* Flight Route Details */}
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          {/* Origin */}
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight text-espresso sm:text-3xl">
              {originCode}
            </span>
            <span className="text-xs font-medium text-muted-foreground">{originCity}</span>
            <span className="mt-1 text-[11px] text-muted-foreground/80">{departureDate}</span>
          </div>

          {/* Plane & Duration Graphic */}
          <div className="flex flex-1 flex-col items-center px-2">
            <span className="text-[11px] font-medium text-muted-foreground">{duration}</span>
            <div className="relative my-1 flex w-full max-w-[140px] items-center">
              <div className="h-[2px] w-full bg-border" />
              <Plane className="absolute left-1/2 size-4 -translate-x-1/2 -rotate-45 text-primary" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              {stops}
            </span>
          </div>

          {/* Destination */}
          <div className="flex flex-col items-end text-right">
            <span className="text-2xl font-bold tracking-tight text-espresso sm:text-3xl">
              {destCode}
            </span>
            <span className="text-xs font-medium text-muted-foreground">{destCity}</span>
            <span className="mt-1 text-[11px] text-muted-foreground/80">
              {returnDate ? `Return: ${returnDate}` : "One-way"}
            </span>
          </div>
        </div>

        {/* Pricing Comparison Grid */}
        <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-border/80 bg-background/60 p-4 sm:grid-cols-3">
          {/* Cash Price */}
          <div className="flex flex-col border-b border-border/60 pb-2 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Retail Cash Price
            </span>
            <span className="mt-1 text-lg font-bold text-muted-foreground/70 line-through sm:text-xl">
              €{cashPriceEur.toLocaleString("es-ES")}
            </span>
            <span className="text-[10px] text-muted-foreground">via Google Flights</span>
          </div>

          {/* Hacked Award Price */}
          <div className="flex flex-col border-b border-border/60 pb-2 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              A Una Milla Price
            </span>
            <span className="mt-1 text-lg font-bold text-espresso sm:text-xl">
              €{taxesEur.toLocaleString("es-ES")}
              <span className="text-xs font-normal text-muted-foreground"> + taxes</span>
            </span>
            <span className="text-[11px] font-semibold text-espresso">
              + {awardAvios.toLocaleString("es-ES")} Avios
            </span>
          </div>

          {/* Net Euro Savings */}
          <div className="flex flex-col justify-center sm:pl-1">
            <div className="flex items-center gap-1.5">
              <TrendingDown className="size-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700">
                Save €{savingsEur.toLocaleString("es-ES")}
              </span>
            </div>
            <span className="mt-1 inline-flex w-fit rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {savingsPercent}% Cash Kept
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSaveItinerary}
            className={cn(
              "gap-1.5 rounded-lg border-border text-xs font-medium transition-colors",
              isSaved && "border-primary/40 bg-primary/10 text-primary"
            )}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="size-3.5 text-primary" />
                <span>Saved to Trips</span>
              </>
            ) : (
              <>
                <Bookmark className="size-3.5" />
                <span>Save Itinerary</span>
              </>
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="primary"
              size="sm"
              className="gap-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
                <span>Book direct on {airline}</span>
                <ExternalLink className="size-3" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
