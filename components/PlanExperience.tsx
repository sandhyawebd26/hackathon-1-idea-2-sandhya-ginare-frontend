"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Coins,
  CreditCard,
  Info,
  Plane,
  Sparkles,
  TrendingUp,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { listCards } from "@/lib/api"
import {
  cardFeeLabel,
  cardPartnerSummary,
  computeEarningPlan,
} from "@/lib/plan/earning-plan"
import { presetRoutes } from "@/lib/plan/preset-routes"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function PlanExperience() {
  const shouldReduceMotion = Boolean(useReducedMotion())
  const [selectedRouteId, setSelectedRouteId] = useState<string>("mad-jnb")
  const [customMiles, setCustomMiles] = useState<number>(85000)
  const [isCustomTarget, setIsCustomTarget] = useState<boolean>(false)
  const [currentBalance, setCurrentBalance] = useState<number>(20000)
  const [monthlySpend, setMonthlySpend] = useState<number>(2000)
  const { data: catalogue, isLoading: isCardsLoading } = useSWR("spain-cards", () => listCards(), {
    revalidateOnFocus: false,
  })

  const cardRates = catalogue?.cards ?? []
  const [selectedCardId, setSelectedCardId] = useState<string>("revolut-metal")

  const activeRoute = presetRoutes.find(r => r.id === selectedRouteId) ?? presetRoutes[0]
  const activeCard =
    cardRates.find(c => c.id === selectedCardId) ?? cardRates[0] ?? null

  const targetMiles = isCustomTarget ? customMiles : activeRoute.milesRequired
  const plan = useMemo(
    () =>
      computeEarningPlan({
        targetMiles,
        currentBalance,
        monthlySpendEur: monthlySpend,
        earnRatePerEur: activeCard?.earnRateDebit ?? 0.5,
      }),
    [targetMiles, currentBalance, monthlySpend, activeCard?.earnRateDebit],
  )
  const { gapMiles, monthlyEarned, monthsNeeded, targetDateLabel: formattedTargetDate } =
    plan

  useEffect(() => {
    if (cardRates.length === 0) return
    if (!cardRates.some(card => card.id === selectedCardId)) {
      setSelectedCardId(cardRates[0].id)
    }
  }, [cardRates, selectedCardId])

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 pb-28 pt-8 sm:gap-14 sm:pb-32 sm:pt-12">
      {/* Page Header */}
      <div className="flex flex-col gap-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          <CreditCard className="size-3.5" />
          <span>Earn Strategy · Plan Ahead</span>
        </div>
        <h1 className="text-4xl font-semibold tracking-[-0.055em] text-espresso sm:text-5xl lg:text-6xl">
          Turn card spend into miles
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Calculate how many months of everyday spending you need to unlock business class award seats on Spanish cards like Revolut and Amex.
        </p>
        {catalogue?.illustrative ? (
          <p className="text-xs font-medium text-muted-foreground">
            Card earn rates from <code className="rounded bg-muted px-1">GET /api/cards</code> — illustrative demo data, not financial advice.
          </p>
        ) : null}
      </div>

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Form Inputs (Left) */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          {/* Target Flight Card */}
          <FieldSet className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7">
            <FieldLegend className="text-lg font-semibold tracking-tight text-espresso">
              1. Choose your redemption target
            </FieldLegend>
            <FieldGroup className="mt-4 gap-4">
              <Field>
                <FieldLabel htmlFor="route-selector">Target flight / route</FieldLabel>
                <Select
                  value={isCustomTarget ? "custom" : selectedRouteId}
                  onValueChange={val => {
                    if (val === "custom") {
                      setIsCustomTarget(true)
                    } else {
                      setIsCustomTarget(false)
                      setSelectedRouteId(val)
                    }
                  }}
                >
                  <SelectTrigger id="route-selector" className="h-11 rounded-xl bg-background text-base">
                    <SelectValue placeholder="Choose a route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {presetRoutes.map(route => (
                        <SelectItem key={route.id} value={route.id}>
                          {route.name} · {route.milesRequired.toLocaleString("en-GB")} Avios
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Avios goal...</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              {isCustomTarget ? (
                <Field>
                  <FieldLabel htmlFor="custom-miles">Custom Avios target</FieldLabel>
                  <Input
                    id="custom-miles"
                    type="number"
                    step={1000}
                    min={1000}
                    max={500000}
                    value={customMiles}
                    onChange={e => setCustomMiles(Math.max(1000, Number(e.target.value) || 0))}
                    className="h-11 rounded-xl"
                  />
                  <FieldDescription>Total miles required for your intended itinerary.</FieldDescription>
                </Field>
              ) : (
                <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-background/80 p-3.5 text-xs text-muted-foreground">
                  <span>Cabin: <strong>{activeRoute.cabin}</strong></span>
                  <span>Retail value: <strong>€{activeRoute.typicalCashEur.toLocaleString("en-GB")}</strong></span>
                  <span>Program: <strong>{activeRoute.program}</strong></span>
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="current-balance">Avios you already hold</FieldLabel>
                <Input
                  id="current-balance"
                  type="number"
                  step={1000}
                  min={0}
                  max={500000}
                  value={currentBalance}
                  onChange={e => setCurrentBalance(Math.max(0, Number(e.target.value) || 0))}
                  className="h-11 rounded-xl"
                />
                <FieldDescription>Sum of your Iberia Plus, BA Executive Club, or Qatar balances.</FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* Spend & Card Card */}
          <FieldSet className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7">
            <FieldLegend className="text-lg font-semibold tracking-tight text-espresso">
              2. Your card & monthly spending
            </FieldLegend>
            <FieldGroup className="mt-4 gap-5">
              <Field>
                <FieldLabel htmlFor="card-selector">Credit / debit card plan (Spain)</FieldLabel>
                {isCardsLoading ? (
                  <Skeleton className="h-11 w-full rounded-xl" aria-label="Loading card catalogue" />
                ) : (
                  <Select value={selectedCardId} onValueChange={setSelectedCardId}>
                    <SelectTrigger id="card-selector" className="h-11 rounded-xl bg-background text-base">
                      <SelectValue placeholder="Select card tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {cardRates.map(card => (
                          <SelectItem key={card.id} value={card.id}>
                            {card.name} ({card.earnRateDebitLabel}) — {cardFeeLabel(card)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
                <FieldDescription>
                  {isCardsLoading
                    ? "Loading card earn rates…"
                    : activeCard
                      ? cardPartnerSummary(activeCard)
                      : "Select a card to see earn partners."}
                </FieldDescription>
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="spend-input">Estimated monthly spend (EUR)</FieldLabel>
                  <span className="text-lg font-bold text-primary tabular-nums">
                    €{monthlySpend.toLocaleString("en-GB")} / month
                  </span>
                </div>
                <Input
                  id="spend-input"
                  type="number"
                  step={100}
                  min={200}
                  max={25000}
                  value={monthlySpend}
                  onChange={e => setMonthlySpend(Math.max(100, Number(e.target.value) || 0))}
                  className="h-11 rounded-xl"
                />
                {/* Spend quick buttons */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {[1000, 1500, 2000, 3000, 5000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setMonthlySpend(amt)}
                      className={cn(
                        "rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors",
                        monthlySpend === amt
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:text-espresso",
                      )}
                    >
                      €{amt.toLocaleString("en-GB")}
                    </button>
                  ))}
                </div>
              </Field>
            </FieldGroup>
          </FieldSet>
        </div>

        {/* Projection Dashboard (Right Sticky) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 flex flex-col gap-6">
            <Card variant="dark" className="overflow-hidden shadow-xl">
              <CardHeader className="border-b border-white/10 pb-5">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Earning Projection
                </span>
                <CardTitle className="text-3xl text-white">
                  {gapMiles === 0
                    ? "Goal already reached!"
                    : !Number.isFinite(monthsNeeded)
                      ? "Increase spend"
                      : `~${monthsNeeded} months`}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {gapMiles === 0
                    ? "Your existing balance covers this redemption right now."
                    : `Projected completion by ${formattedTargetDate}`}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-5 pt-6 text-white">
                <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white/5 p-4">
                  <div>
                    <span className="text-xs text-white/50 uppercase">Miles needed</span>
                    <p className="mt-1 text-xl font-bold tabular-nums">
                      {targetMiles.toLocaleString("en-GB")}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-white/50 uppercase">Miles gap</span>
                    <p className="mt-1 text-xl font-bold tabular-nums text-primary">
                      {gapMiles.toLocaleString("en-GB")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 text-sm text-white/80">
                  <div className="flex items-center justify-between">
                    <span>Monthly points earned:</span>
                    <strong className="text-white tabular-nums">+{monthlyEarned.toLocaleString("en-GB")} / mo</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Selected card plan:</span>
                    <strong className="text-white">{activeCard?.name ?? "—"}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Earning speed:</span>
                    <span className="text-white/60 text-xs">
                      {activeCard?.earnRateDebitLabel ?? "—"}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/30 bg-primary/10 p-3.5 text-xs text-white/80">
                  <p className="font-semibold text-primary">Golden Rule of Travel Hacking:</p>
                  <p className="mt-1 leading-relaxed">
                    Keep your points in Revolut or Amex. Only transfer to Iberia or BA when you see confirmed award space on SeatSpy!
                  </p>
                </div>
              </CardContent>

              <CardFooter className="border-t border-white/10 pt-5">
                <Button asChild variant="primary" size="lg" className="min-h-12 w-full rounded-2xl text-base">
                  <Link href="/quick">
                    Search flights now
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Quick Links Card */}
            <Card variant="cream" className="p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Explore more
              </span>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <Link href="/quick" className="flex items-center justify-between py-1 text-espresso hover:text-primary transition-colors">
                  <span>Quick flight comparison</span>
                  <ArrowUpRight className="size-4" />
                </Link>
                <Link href="/trip" className="flex items-center justify-between py-1 text-espresso hover:text-primary transition-colors">
                  <span>Multi-leg full trip planner</span>
                  <ArrowUpRight className="size-4" />
                </Link>
                <Link href="/saved" className="flex items-center justify-between py-1 text-espresso hover:text-primary transition-colors">
                  <span>Your saved trips</span>
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
