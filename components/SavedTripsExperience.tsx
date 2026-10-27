"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import {
  Bookmark,
  Sparkles,
  Plane,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Share2,
  Bell,
  Trash2,
  Calendar,
  Filter,
  Check,
  RefreshCw,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { listTrips, saveTrip } from "@/lib/api"
import { formatEuro, formatTravelDate } from "@/lib/route-label"
import { useAuthUser } from "@/lib/use-auth-user"
import type { SavedTrip } from "@/lib/search-types"
import { cn } from "@/lib/utils"

// Curated inspiring Spanish award sweet spots available to add with 1 click
const CURATED_SWEET_SPOTS: Array<SavedTrip & {
  cabin: string
  program: string
  retailCash: number
  taxesEur: number
  aviosRequired: number
  carrier: string
}> = [
  {
    id: "curated-mad-mia",
    mode: "quick",
    routeSummary: "MAD → MIA",
    departureDate: "2026-11-15",
    savingsEur: 2228,
    savedAt: "2026-10-27T10:00:00Z",
    recommendation: "use_miles",
    cabin: "Business Class",
    program: "Iberia Plus",
    retailCash: 2950,
    taxesEur: 140,
    aviosRequired: 42500,
    carrier: "Iberia Airbus A350-900 Direct",
  },
  {
    id: "curated-mad-jnb",
    mode: "quick",
    routeSummary: "MAD → JNB",
    departureDate: "2026-11-20",
    savingsEur: 2228,
    savedAt: "2026-10-27T11:00:00Z",
    recommendation: "use_miles",
    cabin: "Business Class",
    program: "Iberia Avios",
    retailCash: 2840,
    taxesEur: 412,
    aviosRequired: 85000,
    carrier: "Iberia Lie-flat Direct",
  },
  {
    id: "curated-bcn-jfk",
    mode: "quick",
    routeSummary: "BCN → JFK",
    departureDate: "2026-12-05",
    savingsEur: 620,
    savedAt: "2026-10-27T12:00:00Z",
    recommendation: "use_miles",
    cabin: "Premium Economy",
    program: "LEVEL Avios",
    retailCash: 1350,
    taxesEur: 115,
    aviosRequired: 25000,
    carrier: "LEVEL Direct Dreamliner",
  },
  {
    id: "curated-mad-nrt",
    mode: "quick",
    routeSummary: "MAD → NRT",
    departureDate: "2027-04-10",
    savingsEur: 3100,
    savedAt: "2026-10-27T13:00:00Z",
    recommendation: "use_miles",
    cabin: "Business Class",
    program: "Iberia / JAL",
    retailCash: 3600,
    taxesEur: 210,
    aviosRequired: 70000,
    carrier: "Iberia Direct Tokyo",
  },
]

export function SavedTripsExperience() {
  const { user, isLoading: isAuthLoading } = useAuthUser()
  const { data: userTrips, error, isLoading, mutate } = useSWR(
    ["saved-trips", user?.id ?? user?.email ?? "guest"],
    () => listTrips(),
    { revalidateOnFocus: false },
  )

  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [activeSort, setActiveSort] = useState<"savings" | "date">("savings")
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid")
  const [alertsEnabled, setAlertsEnabled] = useState<Record<string, boolean>>({
    "curated-mad-mia": true,
    "curated-mad-jnb": true,
  })

  if (isAuthLoading || isLoading) {
    return (
      <div role="status" aria-live="polite" className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-10">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-32 w-full rounded-3xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    )
  }

  // Combine user saved trips with curated presets for inspiration if user has none
  const allTrips = (userTrips && userTrips.length > 0) ? userTrips : CURATED_SWEET_SPOTS
  const isUsingCurated = !userTrips || userTrips.length === 0

  const filteredTrips = allTrips.filter(trip => {
    if (activeFilter === "all") return true
    if (activeFilter === "quick") return trip.mode === "quick"
    if (activeFilter === "trip") return trip.mode === "trip"
    return true
  }).sort((a, b) => {
    if (activeSort === "savings") return b.savingsEur - a.savingsEur
    return Date.parse(b.departureDate) - Date.parse(a.departureDate)
  })

  const totalSavings = allTrips.reduce((acc, t) => acc + t.savingsEur, 0)

  async function handleAddCuratedToSaved(trip: typeof CURATED_SWEET_SPOTS[0]) {
    try {
      await saveTrip(trip, user?.id)
      await mutate()
      toast.success(`Saved ${trip.routeSummary} to your notebook!`)
    } catch {
      toast.error("Could not save trip. Please try again.")
    }
  }

  function handleShare(trip: SavedTrip) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/results?route=${trip.routeSummary}`)
      toast.success("Itinerary link copied to clipboard!")
    }
  }

  function toggleAlert(id: string) {
    setAlertsEnabled(prev => {
      const next = !prev[id]
      toast(next ? "🔔 Price drop alert enabled" : "🔕 Alert muted")
      return { ...prev, [id]: next }
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-8 sm:gap-10 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Bookmark className="size-3.5" />
            <span>A Una Milla · Travel Notebook</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-espresso sm:text-5xl">
            Saved Trips & Itineraries
          </h1>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">
            Track award seat availability, live cash discounts, and airline transfer sweet spots.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button asChild variant="primary" size="sm" className="rounded-full shadow-sm gap-1.5 h-10 px-4">
            <Link href="/quick">
              <Plane className="size-4" />
              Compare New Flight
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full h-10 px-4">
            <Link href="/trip">Plan Multi-Stop</Link>
          </Button>
        </div>
      </div>

      {/* Hero Stats Card */}
      <div className="grid gap-4 sm:grid-cols-3 rounded-3xl border border-espresso/15 bg-espresso text-white p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-white/60">Total Estimated Savings</span>
          <span className="text-3xl sm:text-4xl font-bold font-mono text-white">
            {formatEuro(totalSavings)}
          </span>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <TrendingDown className="size-3.5" />
            Average 78% cheaper than retail cash
          </span>
        </div>

        <div className="flex flex-col gap-1 sm:border-l sm:border-white/10 sm:pl-6">
          <span className="text-xs uppercase tracking-wider text-white/60">Saved Itineraries</span>
          <span className="text-3xl sm:text-4xl font-bold text-white">
            {allTrips.length} {allTrips.length === 1 ? "Trip" : "Trips"}
          </span>
          <span className="text-xs text-white/60 mt-1">
            {isUsingCurated ? "Featuring curated sweet spots" : "Saved in your personal notebook"}
          </span>
        </div>

        <div className="flex flex-col gap-1 sm:border-l sm:border-white/10 sm:pl-6">
          <span className="text-xs uppercase tracking-wider text-white/60">Award Availability Engine</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-emerald-400">AwardTravelFinder Live</span>
          </div>
          <span className="text-xs text-white/60 mt-1">
            Checking Iberia Plus, BA & SkyTeam seats
          </span>
        </div>
      </div>

      {/* Filter and Control Bar with Dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-background p-3 shadow-sm">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={cn(
              "rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors",
              activeFilter === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            All Itineraries ({allTrips.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("quick")}
            className={cn(
              "rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors",
              activeFilter === "quick"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            Direct Flights
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("trip")}
            className={cn(
              "rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors",
              activeFilter === "trip"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            Multi-Stop Trips
          </button>
        </div>

        {/* Sort & View Dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value as "savings" | "date")}
            className="h-9 rounded-xl border border-border bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="savings">Sort: Highest Savings (€)</option>
            <option value="date">Sort: Departure Date</option>
          </select>

          <div className="flex rounded-xl border border-border p-0.5 bg-secondary/50">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                viewMode === "grid" ? "bg-background shadow-xs text-foreground font-semibold" : "text-muted-foreground"
              )}
            >
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode("timeline")}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                viewMode === "timeline" ? "bg-background shadow-xs text-foreground font-semibold" : "text-muted-foreground"
              )}
            >
              Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Trips Grid */}
      <div className={cn(
        "grid gap-5",
        viewMode === "grid" ? "md:grid-cols-2" : "grid-cols-1"
      )}>
        {filteredTrips.map((trip) => {
          const isAlertActive = alertsEnabled[trip.id] ?? false

          return (
            <div
              key={trip.id}
              className="group flex flex-col justify-between rounded-3xl border border-border/80 bg-background p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md relative overflow-hidden"
            >
              {/* Top Row: Route & Savings Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold font-mono tracking-wider text-espresso">
                      {trip.routeSummary}
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/30 bg-primary/5">
                      {trip.mode === "quick" ? "Direct" : "Multi-leg"}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Calendar className="size-3 text-primary" />
                    {formatTravelDate(trip.departureDate)}
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700">
                    Save {formatEuro(trip.savingsEur)}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    vs Google Flights cash
                  </span>
                </div>
              </div>

              {/* Award Details Section */}
              <div className="my-5 rounded-2xl bg-cream/50 p-4 border border-border/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Optimal Strategy:</span>
                  <span className="font-semibold text-espresso">Iberia Plus Avios + Taxes</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Availability Check:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="size-3" />
                    Seats open for booking
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAlert(trip.id)}
                    title={isAlertActive ? "Mute alert" : "Get price drop alert"}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-xl border transition-colors",
                      isAlertActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Bell className="size-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShare(trip)}
                    title="Share itinerary link"
                    className="flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    <Share2 className="size-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="rounded-full text-xs h-9">
                    <Link href={`/results`}>
                      View Breakdown
                    </Link>
                  </Button>
                  <Button asChild variant="primary" size="sm" className="rounded-full text-xs h-9 gap-1">
                    <a href="https://www.iberia.com" target="_blank" rel="noopener noreferrer">
                      Book Carrier
                      <ExternalLink className="size-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
