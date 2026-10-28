"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { toast } from "sonner"

import { AlternativeHacks } from "@/components/results/AlternativeHacks"
import { BookingSteps } from "@/components/results/BookingSteps"
import { PriceComparison } from "@/components/results/PriceComparison"
import { ErrorBanner } from "@/components/results/ErrorBanner"
import { ResultsActionBar } from "@/components/results/ResultsActionBar"
import { ResultsSkeleton } from "@/components/results/ResultsSkeleton"
import { SavedTripsGate } from "@/components/auth/SavedTripsGate"
import { SavingsHero } from "@/components/results/SavingsHero"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { demoSearchRequest } from "@/lib/search-demo"
import {
  explain,
  pendingSearchCacheKey,
  readPendingSearch,
  saveTrip,
  search,
  storePendingSearch,
} from "@/lib/api"
import { formatTravelDate, routeSummary } from "@/lib/route-label"
import type { SavedTrip, SearchResponse } from "@/lib/search-types"
import { useAuthUser } from "@/lib/use-auth-user"

export function ResultsExperience() {
  const [isCashExample, setIsCashExample] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedTripId, setSavedTripId] = useState<string | null>(null)
  const [showSaveGate, setShowSaveGate] = useState(false)
  const { user, isLoading: isAuthLoading } = useAuthUser()

  const [routeKey] = useState(() => pendingSearchCacheKey(readPendingSearch()))

  const {
    data: result,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<SearchResponse>(
    ["search-results", routeKey, isCashExample],
    () => {
      const request = readPendingSearch()
      return search({ ...request, payCash: isCashExample || undefined })
    },
    { revalidateOnFocus: false, shouldRetryOnError: false, keepPreviousData: false },
  )

  const { data: explanation } = useSWR(
    result
      ? ["search-explanation", result.route.origin, result.route.destination, result.savings.amountEur]
      : null,
    () => explain({ response: result! }),
    {
      fallbackData: result?.explain,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  )

  function toggleCashExample() {
    setIsCashExample(current => !current)
    setSavedTripId(null)
  }

  function useDemoData() {
    storePendingSearch(demoSearchRequest)
    setSavedTripId(null)
    if (isCashExample) {
      setIsCashExample(false)
    } else {
      void mutate()
    }
  }

  async function handleSaveTrip() {
    if (!result || isSaving || savedTripId || isAuthLoading) return
    setIsSaving(true)

    const legs = result.route.legs ?? [{
      origin: result.route.origin,
      destination: result.route.destination,
      departureDate: result.route.departureDate,
    }]
    const trip: SavedTrip = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `trip-${Date.now()}`,
      mode: result.mode,
      routeSummary: routeSummary(legs),
      departureDate: result.route.departureDate,
      savingsEur: result.savings.amountEur,
      savedAt: new Date().toISOString(),
      recommendation: result.savings.recommendation,
    }

    try {
      const savedTrip = await saveTrip(trip, user?.id ?? undefined)
      setSavedTripId(savedTrip.id)
      toast.success("Trip saved", {
        description: user
          ? "You can find it any time in Saved trips."
          : "Saved in this browser. Sign in later to sync across devices.",
      })
    } catch {
      toast.error("Could not save this trip", {
        description: "Please try again in a moment.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const showResultsSkeleton = isLoading || isValidating || !result

  if (showResultsSkeleton) {
    if (error && !isValidating) {
      return (
        <div className="mx-auto w-full max-w-6xl py-12">
          <ErrorBanner
            message={error instanceof Error ? error.message : "Please try the sample route instead."}
            onUseDemoData={useDemoData}
          />
        </div>
      )
    }

    return <ResultsSkeleton />
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-36 pt-8 sm:gap-10 sm:pb-12 sm:pt-12">
      <div className="flex items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm" className="min-h-11 px-2">
          <Link href="/">Back to A Una Milla</Link>
        </Button>
        <p className="text-sm text-muted-foreground">
          {result.mode === "quick" ? "Quick flight" : "Full trip plan"} · {formatTravelDate(result.route.departureDate)}
        </p>
      </div>

      <SavingsHero result={result} />

      {result.meta?.cashStatus === "fixture_fallback" && (
        <Alert className="border-amber-600/30 bg-amber-500/10 text-foreground">
          <AlertTitle>Duffel unavailable — showing sample cash</AlertTitle>
          <AlertDescription>
            We could not fetch a Duffel test fare for this route, so the cash side uses bundled sample data. Award
            pricing still comes from the Avios chart.
          </AlertDescription>
        </Alert>
      )}

      <PriceComparison
        result={result}
        isCashExample={isCashExample}
        onToggleCashExample={toggleCashExample}
      />

      <Alert className="border-primary/25 bg-primary/10 text-foreground">
        <AlertTitle>Illustrative pricing</AlertTitle>
        <AlertDescription>{result.disclaimer}</AlertDescription>
      </Alert>

      <section aria-labelledby="why-heading" className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            The simple explanation
          </p>
          <h2 id="why-heading" className="mt-2 text-2xl font-semibold tracking-tight text-espresso sm:text-3xl">
            Why this works
          </h2>
        </div>
        <Card variant="cream">
          <CardHeader>
            <CardTitle className="text-lg">A better use for your miles</CardTitle>
            <CardDescription className="leading-6 text-muted-foreground">
              {explanation?.summary ?? result.explain.summary}
            </CardDescription>
          </CardHeader>
          {result.explain.centsPerMile !== undefined && result.savings.recommendation === "use_miles" && (
            <CardContent className="pt-0">
              <Separator className="mb-4" />
              <p className="text-sm text-muted-foreground">
                Estimated value: <span className="font-semibold text-espresso">{result.explain.centsPerMile.toFixed(1)}¢ per mile</span>
              </p>
            </CardContent>
          )}
        </Card>
      </section>

      <BookingSteps steps={result.bookingSteps} />
      <AlternativeHacks alternatives={result.alternativeHacks} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
        <span>Source: {result.cash.dataSource === "sample" ? "sample comparison" : result.cash.dataSource}</span>
        <Button asChild variant="ghost" size="sm" className="min-h-11">
          <Link href="/saved">View saved trips</Link>
        </Button>
      </div>

      <ResultsActionBar
        isSaved={savedTripId !== null}
        isSaving={isSaving}
        isAuthLoading={isAuthLoading}
        onSave={handleSaveTrip}
      />

      <Dialog open={showSaveGate} onOpenChange={setShowSaveGate}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md border-0 bg-transparent p-0 shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Sign in to save trips</DialogTitle>
            <DialogDescription>Create an account to keep this comparison for later.</DialogDescription>
          </DialogHeader>
          <SavedTripsGate className="border-0 shadow-none" />
        </DialogContent>
      </Dialog>
    </div>
  )
}
