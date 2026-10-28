"use client"

import { useState, useTransition, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  ArrowUpDown,
  Calendar,
  Coins,
  CreditCard,
  Plus,
  Sparkles,
  Trash2,
  CheckCircle2,
  HelpCircle,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { storePendingSearch } from "@/lib/api"
import { searchRequestSchema } from "@/lib/search-validation"
import type { CabinClass, SearchLeg, SearchMode } from "@/lib/search-types"
import { AirportDropdown } from "@/components/flight-search/AirportDropdown"
import { CabinDropdown } from "@/components/flight-search/CabinDropdown"
import { TravellersDropdown } from "@/components/flight-search/TravellersDropdown"
import { RoutePresets, type RoutePreset } from "@/components/flight-search/RoutePresets"
import { LiveSavingsPreview } from "@/components/flight-search/LiveSavingsPreview"
import { cn } from "@/lib/utils"

type FormLeg = SearchLeg & { id: string }
type FormErrors = Record<string, string>

interface FlightSearchFormProps {
  mode: SearchMode
}

function initialLegs(mode: SearchMode): FormLeg[] {
  if (mode === "trip") {
    return [
      { id: "leg-1", origin: "MAD", destination: "MIA", departureDate: "2026-11-15" },
      { id: "leg-2", origin: "MIA", destination: "MAD", departureDate: "2026-11-28" },
    ]
  }

  return [{ id: "leg-1", origin: "MAD", destination: "JNB", departureDate: "2026-11-15" }]
}

export function FlightSearchForm({ mode }: FlightSearchFormProps) {
  const router = useRouter()
  const [isNavigating, startNavigation] = useTransition()
  const [legs, setLegs] = useState<FormLeg[]>(() => initialLegs(mode))
  const [cabin, setCabin] = useState<CabinClass>("business")
  const [adults, setAdults] = useState(1)
  const [flexibleDates, setFlexibleDates] = useState(false)
  const [miles, setMiles] = useState({ iberiaAvios: 85000, baAvios: 0, qatarAvios: 0 })
  const [errors, setErrors] = useState<FormErrors>({})

  const title = mode === "quick" ? "Quick flight comparison" : "Full multi-stop trip planner"

  function updateLeg(index: number, key: keyof SearchLeg, value: string) {
    const normalizedValue = key === "departureDate"
      ? value
      : value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3)

    setLegs(current => current.map((leg, legIndex) =>
      legIndex === index ? { ...leg, [key]: normalizedValue } : leg,
    ))
    setErrors(current => {
      const next = { ...current }
      delete next[`legs.${index}.${key}`]
      delete next.legs
      return next
    })
  }

  function swapOriginDestination(index: number) {
    setLegs(current => current.map((leg, legIndex) => {
      if (legIndex !== index) return leg
      return {
        ...leg,
        origin: leg.destination || "MAD",
        destination: leg.origin || "JNB",
      }
    }))
  }

  function addLeg() {
    if (legs.length >= 3) return

    const previousLeg = legs[legs.length - 1]
    const nextDate = new Date(`${previousLeg.departureDate || "2026-11-15"}T12:00:00`)
    nextDate.setDate(nextDate.getDate() + 7)

    setLegs(current => [
      ...current,
      {
        id: `leg-${Date.now()}`,
        origin: previousLeg.destination || "MIA",
        destination: "JFK",
        departureDate: nextDate.toISOString().slice(0, 10),
      },
    ])
  }

  function removeLeg(id: string) {
    setLegs(current => current.filter(leg => leg.id !== id))
    setErrors({})
  }

  function handlePresetSelect(preset: RoutePreset) {
    setLegs(current => [
      {
        ...current[0],
        origin: preset.origin,
        destination: preset.destination,
      },
      ...(mode === "trip"
        ? [
            {
              id: "leg-2",
              origin: preset.destination,
              destination: preset.origin,
              departureDate: "2026-11-28",
            },
          ]
        : []),
    ])
    setCabin(preset.cabin)
  }

  function updateMiles(key: keyof typeof miles, rawValue: string) {
    const amount = Number.parseInt(rawValue, 10)
    setMiles(current => ({ ...current, [key]: Number.isFinite(amount) ? Math.max(0, amount) : 0 }))
  }

  function addQuickAvios(amount: number) {
    setMiles(current => ({ ...current, iberiaAvios: current.iberiaAvios + amount }))
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const parsed = searchRequestSchema.safeParse({
      mode,
      legs: legs.map(({ origin, destination, departureDate }) => ({ origin, destination, departureDate })),
      cabin,
      adults,
      miles,
      flexibleDates,
    })

    if (!parsed.success) {
      const nextErrors: FormErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "form"
        nextErrors[key] ??= issue.message
      }
      setErrors(nextErrors)
      return
    }

    setErrors({})
    storePendingSearch(parsed.data)
    startNavigation(() => {
      router.push("/results")
    })
  }

  return (
    <div className="mx-auto w-full max-w-6xl pb-20 pt-8 sm:pb-16 sm:pt-12">
      {/* Header */}
      <div className="mb-8 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5" />
          <span>A Una Milla · Travel Hacking Engine</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-espresso sm:text-5xl">
          {title}
        </h1>
        <p className="mt-2 text-base text-muted-foreground sm:text-lg">
          {mode === "quick"
            ? "Instantly see how much you save on cash fares by unlocking Iberia Plus & British Airways Avios award charts."
            : "Plan complex multi-city or roundtrip award flights across Spain and international hubs with maximum points efficiency."}
        </p>
      </div>

      {/* Preset Route Sweet Spots */}
      <div className="mb-8 rounded-2xl border border-border/80 bg-cream/40 p-4">
        <RoutePresets
          onSelect={handlePresetSelect}
          currentOrigin={legs[0]?.origin}
          currentDestination={legs[0]?.destination}
        />
      </div>

      {/* Main Two-Column Interactive Layout */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Interactive Form */}
        <form onSubmit={submitSearch} noValidate className="flex flex-col gap-6 lg:col-span-7">
          {errors.form && (
            <Alert variant="destructive">
              <AlertTitle>Check your trip details</AlertTitle>
              <AlertDescription>{errors.form}</AlertDescription>
            </Alert>
          )}
          {errors.legs && (
            <Alert variant="destructive">
              <AlertTitle>Check your itinerary</AlertTitle>
              <AlertDescription>{errors.legs}</AlertDescription>
            </Alert>
          )}

          {/* Legs Section */}
          <div className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-espresso">
                {mode === "quick" ? "Route & Schedule" : "Multi-Leg Itinerary"}
              </h2>
              {mode === "trip" && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {legs.length} of 3 legs
                </span>
              )}
            </div>

            <div className="space-y-4">
              {legs.map((leg, index) => (
                <div
                  key={leg.id}
                  className="rounded-2xl border border-border/80 bg-cream/50 p-4 sm:p-5 relative transition-all hover:border-primary/40"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {mode === "quick" ? "Direct Flight Route" : `Stopover Leg ${index + 1}`}
                    </span>
                    {mode === "trip" && legs.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeLeg(leg.id)}
                        className="text-muted-foreground hover:text-destructive text-xs flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                        Remove leg
                      </button>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-12 sm:items-center">
                    {/* Origin Airport Dropdown */}
                    <div className="sm:col-span-5">
                      <AirportDropdown
                        id={`leg-${index}-origin`}
                        label="From (Origin)"
                        value={leg.origin}
                        type="origin"
                        error={errors[`legs.${index}.origin`]}
                        onChange={(code) => updateLeg(index, "origin", code)}
                      />
                    </div>

                    {/* Quick Swap Button */}
                    <div className="sm:col-span-2 flex justify-center py-1 sm:py-0 sm:pt-5">
                      <button
                        type="button"
                        onClick={() => swapOriginDestination(index)}
                        title="Swap Origin and Destination"
                        aria-label="Swap Origin and Destination"
                        className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-cream hover:text-primary transition-all hover:rotate-180"
                      >
                        <ArrowUpDown className="size-4" />
                      </button>
                    </div>

                    {/* Destination Airport Dropdown */}
                    <div className="sm:col-span-5">
                      <AirportDropdown
                        id={`leg-${index}-destination`}
                        label="To (Destination)"
                        value={leg.destination}
                        type="destination"
                        error={errors[`legs.${index}.destination`]}
                        onChange={(code) => updateLeg(index, "destination", code)}
                      />
                    </div>
                  </div>

                  {/* Travel Date */}
                  <div className="mt-4 pt-3 border-t border-border/50 grid gap-3 sm:grid-cols-2 sm:items-center">
                    <div>
                      <label
                        htmlFor={`leg-${index}-date`}
                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-1.5"
                      >
                        <Calendar className="size-3.5 text-primary" />
                        Travel Date
                      </label>
                      <input
                        id={`leg-${index}-date`}
                        type="date"
                        value={leg.departureDate}
                        onChange={(e) => updateLeg(index, "departureDate", e.target.value)}
                        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      {errors[`legs.${index}.departureDate`] && (
                        <p className="text-xs text-destructive mt-1">
                          {errors[`legs.${index}.departureDate`]}
                        </p>
                      )}
                    </div>

                    {/* Quick Date Presets */}
                    <div className="flex flex-col justify-end">
                      <span className="text-[11px] text-muted-foreground mb-1.5 font-medium">
                        Quick Departure Horizon:
                      </span>
                      <div className="flex gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => updateLeg(index, "departureDate", "2026-11-15")}
                          className="rounded-lg bg-secondary px-2 py-1 text-[11px] font-medium text-foreground hover:bg-secondary/80"
                        >
                          Nov 2026
                        </button>
                        <button
                          type="button"
                          onClick={() => updateLeg(index, "departureDate", "2026-12-20")}
                          className="rounded-lg bg-secondary px-2 py-1 text-[11px] font-medium text-foreground hover:bg-secondary/80"
                        >
                          Holidays
                        </button>
                        <button
                          type="button"
                          onClick={() => updateLeg(index, "departureDate", "2027-06-15")}
                          className="rounded-lg bg-secondary px-2 py-1 text-[11px] font-medium text-foreground hover:bg-secondary/80"
                        >
                          Summer &apos;27
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {mode === "trip" && legs.length < 3 && (
              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLeg}
                  className="rounded-full gap-1.5 border-dashed border-primary/50 text-primary hover:bg-primary/10"
                >
                  <Plus className="size-4" />
                  Add next stopover leg
                </Button>
              </div>
            )}
          </div>

          {/* Cabin & Travellers Section with Dropdowns */}
          <div className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-6 space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-espresso">
              Cabin & Travellers
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <CabinDropdown value={cabin} onChange={setCabin} />
              <TravellersDropdown adults={adults} onChange={setAdults} />
            </div>

            {/* Flexible Dates Toggle */}
            <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-cream/40 p-3.5 mt-2">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-espresso">
                  Flexible Dates (±3 Days)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Scans adjacent days for off-peak Avios redemption discounts
                </span>
              </div>
              <Switch
                checked={flexibleDates}
                onCheckedChange={setFlexibleDates}
                aria-label="Flexible dates toggle"
              />
            </div>
          </div>

          {/* Existing Avios Balance Section */}
          <details className="rounded-3xl border border-border bg-background p-5 shadow-sm group">
            <summary className="flex cursor-pointer items-center justify-between font-semibold text-espresso [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-2">
                <Coins className="size-4 text-primary" />
                <span>Loyalty Points You Already Have</span>
              </div>
              <span className="text-xs font-medium text-primary">
                Customise balance +
              </span>
            </summary>

            <div className="mt-4 pt-4 border-t border-border/60 space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label htmlFor="iberia-avios" className="text-xs font-semibold text-muted-foreground block mb-1">
                    🇪🇸 Iberia Avios
                  </label>
                  <input
                    id="iberia-avios"
                    type="number"
                    step={1000}
                    value={miles.iberiaAvios}
                    onChange={(e) => updateMiles("iberiaAvios", e.target.value)}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label htmlFor="ba-avios" className="text-xs font-semibold text-muted-foreground block mb-1">
                    🇬🇧 BA Avios (1:1 Free Transfer)
                  </label>
                  <input
                    id="ba-avios"
                    type="number"
                    step={1000}
                    value={miles.baAvios}
                    onChange={(e) => updateMiles("baAvios", e.target.value)}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label htmlFor="qatar-avios" className="text-xs font-semibold text-muted-foreground block mb-1">
                    🇶🇦 Qatar Avios (1:1 Link)
                  </label>
                  <input
                    id="qatar-avios"
                    type="number"
                    step={1000}
                    value={miles.qatarAvios}
                    onChange={(e) => updateMiles("qatarAvios", e.target.value)}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Quick balance booster buttons */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-xs text-muted-foreground font-medium">Quick Boost:</span>
                <button
                  type="button"
                  onClick={() => addQuickAvios(10000)}
                  className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-secondary/80"
                >
                  +10,000 Avios
                </button>
                <button
                  type="button"
                  onClick={() => addQuickAvios(25000)}
                  className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-secondary/80"
                >
                  +25,000 Avios
                </button>
                <button
                  type="button"
                  onClick={() => addQuickAvios(50000)}
                  className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-secondary/80"
                >
                  +50,000 Avios
                </button>
              </div>
            </div>
          </details>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isNavigating}
              className="w-full sm:flex-1 h-12 rounded-2xl text-base font-semibold shadow-md gap-2"
            >
              {isNavigating ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-espresso/30 border-t-espresso" />
                  <span>Running comparison…</span>
                </>
              ) : (
                <>
                  <span>{mode === "quick" ? "Compare Flights & Calculate Savings" : "Calculate Full Trip Savings"}</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Right Column: Dynamic Live Savings Preview */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <LiveSavingsPreview
            legs={legs}
            cabin={cabin}
            adults={adults}
            mode={mode}
          />
        </div>
      </div>
    </div>
  )
}
