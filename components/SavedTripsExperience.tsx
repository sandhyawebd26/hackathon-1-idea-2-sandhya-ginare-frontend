"use client"

import Link from "next/link"
import useSWR from "swr"
import { BookmarkIcon, ReloadIcon } from "@radix-ui/react-icons"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { listTrips } from "@/lib/api"
import { formatEuro, formatTravelDate } from "@/lib/route-label"
import { useAuthUser } from "@/lib/use-auth-user"

export function SavedTripsExperience() {
  const { user, isLoading: isAuthLoading } = useAuthUser()
  const { data: trips, error, isLoading, mutate } = useSWR(
    ["saved-trips", user?.id ?? user?.email ?? "guest"],
    () => listTrips(),
    { revalidateOnFocus: false },
  )

  if (isAuthLoading || isLoading) {
    return (
      <div role="status" aria-live="polite" className="mx-auto flex w-full max-w-6xl flex-col gap-5 py-10 sm:py-14">
        <span className="sr-only">Loading saved trips</span>
        <Skeleton className="h-12 w-56" />
        <Skeleton className="h-36 w-full rounded-3xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="h-56 rounded-3xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl py-10 sm:py-14">
        <Alert variant="destructive">
          <AlertTitle>Saved trips are unavailable</AlertTitle>
          <AlertDescription className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>Try again, or continue planning a new trip.</span>
            <Button type="button" variant="secondary" size="sm" className="min-h-11" onClick={() => void mutate()}>
              <ReloadIcon data-icon="inline-start" aria-hidden="true" />
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const savedTrips = trips ?? []
  const totalSavings = savedTrips.reduce((total, trip) => total + trip.savingsEur, 0)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-10 sm:gap-10 sm:py-14">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Your travel notebook</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-espresso sm:text-5xl">
          Saved trips
        </h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">
          Keep the routes and savings you want to come back to.
        </p>
      </header>

      {!user && (
        <Alert className="border-primary/25 bg-primary/10 text-foreground">
          <AlertTitle>Saved in this browser</AlertTitle>
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>Trips stay on this device until you sign in to sync them later.</span>
            <Button asChild variant="outline" size="sm" className="min-h-11 shrink-0">
              <Link href="/login?next=/saved">Sign in to sync</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {savedTrips.length === 0 ? (
        <Empty className="rounded-3xl border border-dashed border-border bg-background px-5 py-12 sm:py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="rounded-full bg-primary/10 text-espresso">
              <BookmarkIcon aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle className="text-xl font-semibold text-espresso">No saved trips yet</EmptyTitle>
            <EmptyDescription>
              Compare a route first. Save a result and it will be waiting here next time.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="sm:flex-row sm:justify-center">
            <Button asChild variant="primary" size="lg" className="min-h-11">
              <Link href="/quick">Start with a quick flight</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="min-h-11">
              <Link href="/trip">Plan a full trip</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <Card variant="dark" className="sm:flex-row sm:items-center sm:justify-between">
            <CardHeader>
              <CardDescription className="text-white/65">Total saved</CardDescription>
              <CardTitle className="text-3xl text-white sm:text-4xl">{formatEuro(totalSavings)}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3 px-6 pb-6 sm:py-6">
              <span className="rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">
                {savedTrips.length} {savedTrips.length === 1 ? "trip" : "trips"}
              </span>
            </CardContent>
          </Card>

          <section aria-labelledby="saved-list-heading" className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-3">
              <h2 id="saved-list-heading" className="text-xl font-semibold tracking-tight text-espresso">
                Your comparisons
              </h2>
              <Button asChild variant="ghost" size="sm" className="min-h-11">
                <Link href="/quick">Add another</Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {savedTrips.map(trip => (
                <Card key={trip.id} variant="cream" className="h-full">
                  <CardHeader>
                    <CardTitle className="text-xl">{trip.routeSummary}</CardTitle>
                    <CardDescription>{formatTravelDate(trip.departureDate)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-semibold tracking-tight text-espresso">
                      {formatEuro(trip.savingsEur)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Saved {formatTravelDate(trip.savedAt.slice(0, 10))}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Badge variant="outline" className="rounded-full border-primary/25 bg-primary/10 text-foreground">
                      {trip.recommendation === "use_miles" ? "Miles comparison" : "Cash comparison"}
                    </Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
