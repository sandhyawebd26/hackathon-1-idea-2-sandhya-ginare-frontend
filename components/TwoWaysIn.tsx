"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Coins,
  CreditCard,
  HelpCircle,
  Percent,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingDown,
  type LucideIcon,
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
import { cn } from "@/lib/utils"

type CardVariant = "cream" | "dark"

interface PathOption {
  href: string
  number: string
  title: string
  description: string
  footer: string
  icon: LucideIcon
  variant: CardVariant
  badge?: string
}

const mainPaths: PathOption[] = [
  {
    href: "/quick",
    number: "01",
    title: "Quick flight",
    description: "One route, one answer. For when you already know where you’re going.",
    footer: "Fast & simple",
    icon: Plane,
    variant: "cream",
    badge: "Most popular",
  },
  {
    href: "/trip",
    number: "02",
    title: "Full trip plan",
    description: "Several stops, dates and travellers. Where the biggest savings usually hide.",
    footer: "Complete & detailed",
    icon: Route,
    variant: "dark",
    badge: "Multi-leg",
  },
  {
    href: "/plan",
    number: "03",
    title: "Plan ahead & earn",
    description: "Turn everyday Spanish card spend into business class flights. Calculate months to miles.",
    footer: "Earn strategy",
    icon: CreditCard,
    variant: "cream",
    badge: "Cards & Points",
  },
]

interface SampleRoute {
  id: string
  origin: string
  originCity: string
  destination: string
  destinationCity: string
  cabin: string
  cashEur: number
  taxesEur: number
  miles: number
  milesProgram: string
  savedEur: number
  savingsPercent: number
  tag: string
}

const sampleRoutes: SampleRoute[] = [
  {
    id: "mad-jnb",
    origin: "MAD",
    originCity: "Madrid",
    destination: "JNB",
    destinationCity: "Johannesburg",
    cabin: "Business class",
    cashEur: 2840,
    taxesEur: 412,
    miles: 85000,
    milesProgram: "Iberia Avios",
    savedEur: 2228,
    savingsPercent: 78,
    tag: "Hero Route",
  },
  {
    id: "bcn-jfk",
    origin: "BCN",
    originCity: "Barcelona",
    destination: "JFK",
    destinationCity: "New York",
    cabin: "Business class",
    cashEur: 2410,
    taxesEur: 298,
    miles: 68000,
    milesProgram: "Level / Iberia Avios",
    savedEur: 1720,
    savingsPercent: 71,
    tag: "Transatlantic",
  },
  {
    id: "mad-hnd",
    origin: "MAD",
    originCity: "Madrid",
    destination: "HND",
    destinationCity: "Tokyo",
    cabin: "Business class",
    cashEur: 3650,
    taxesEur: 485,
    miles: 95000,
    milesProgram: "Qatar / BA Avios",
    savedEur: 2580,
    savingsPercent: 70,
    tag: "Asia Sweetspot",
  },
]

interface SpendCardOption {
  name: string
  type: string
  earnRate: number
  earnLabel: string
  annualFee: string
}

const spendCards: SpendCardOption[] = [
  {
    name: "Revolut Metal",
    type: "Debit card",
    earnRate: 0.5,
    earnLabel: "1 RevPoint / €2 spent",
    annualFee: "€15.99/mo",
  },
  {
    name: "Revolut Ultra",
    type: "Credit / Debit",
    earnRate: 1.5,
    earnLabel: "1.5 RevPoints / €1 spent",
    annualFee: "€55/mo",
  },
  {
    name: "Amex Business Platinum",
    type: "Charge card",
    earnRate: 1.0,
    earnLabel: "1 MR point / €1 spent",
    annualFee: "€550/yr",
  },
]

interface FaqItem {
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    question: "Do I need hundreds of thousands of miles to start?",
    answer:
      "Not at all. European short-haul sweetspots start as low as 9,000 Avios, and one-way business class upgrades or off-peak redemptions to the Americas start from 34,000–42,500 Avios. We help you find high-value redemptions regardless of your balance.",
  },
  {
    question: "Can I search and compare without creating an account?",
    answer:
      "Yes, 100%. A Una Milla is completely free and open for guest searches. Creating an account is only needed if you want to sync your saved flight comparisons across multiple devices.",
  },
  {
    question: "Do you charge booking fees or mark up airline prices?",
    answer:
      "Never. We are not an online travel agency. We calculate official chart redemption math and provide direct links to the airline (Iberia, British Airways, Qatar) and SeatSpy so you pay zero middleman fees.",
  },
  {
    question: "How do I turn everyday spending in Spain into Avios?",
    answer:
      "In Spain, the most flexible paths are Revolut plans (which earn RevPoints that transfer directly 1:1 to Iberia, BA, and Qatar Avios) and American Express cards (transferring Membership Rewards to airline partners). Our /plan calculator shows you exactly how fast your spend adds up.",
  },
]

export function TwoWaysIn() {
  const shouldReduceMotion = Boolean(useReducedMotion())
  const [selectedRoute, setSelectedRoute] = useState<SampleRoute>(sampleRoutes[0])
  const [monthlySpend, setMonthlySpend] = useState<number>(2000)
  const [selectedCard, setSelectedCard] = useState<SpendCardOption>(spendCards[0])
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  // Calculate earning projections
  const monthlyPoints = Math.round(monthlySpend * selectedCard.earnRate)
  const yearlyPoints = monthlyPoints * 12
  const targetPoints = 85000 // Hero route requirement
  const monthsToTarget = Math.max(1, Math.ceil(targetPoints / monthlyPoints))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <div className="flex flex-1 flex-col pb-24 pt-6 sm:pb-32 sm:pt-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-20 sm:gap-28 lg:gap-36"
      >
        {/* ================= HERO SECTION ================= */}
        <section
          aria-labelledby="hero-title"
          className="relative -mx-4 overflow-hidden rounded-[2rem] border border-border/60 sm:-mx-6"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[#F9F6F1]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-[#F9F6F1]/90 to-[#E8DED3]/80"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-16 top-8 size-72 rounded-full bg-primary/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-20 bottom-0 size-80 rounded-full bg-espresso/5 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            aria-hidden
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C07848' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />

          <motion.div
            variants={itemVariants}
            className="relative z-10 flex flex-col items-center px-4 py-12 text-center sm:px-10 sm:py-16 md:py-20"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm backdrop-blur-sm">
              <span className="flex size-2 rounded-full bg-primary animate-pulse" />
              <span>Save up to 78% on business flights</span>
            </div>

            <h1
              id="hero-title"
              className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.065em] text-espresso sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Same trip. <br className="hidden sm:inline" />
              <span className="text-primary underline decoration-primary/30 underline-offset-8">
                Much less money.
              </span>
            </h1>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:mt-10">
              <Button asChild variant="primary" size="lg" className="min-h-12 rounded-full px-7 text-base shadow-lg shadow-primary/20">
                <Link href="/quick">
                  Compare a flight now
                  <ArrowRight data-icon="inline-end" aria-hidden="true" className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-h-12 rounded-full px-6 text-base">
                <Link href="/trip">Plan multi-leg trip</Link>
              </Button>
            </div>

            {/* Trust Metric Chips */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold tracking-wide text-muted-foreground sm:gap-10 sm:text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <span>Zero markup or booking fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="size-4 text-primary" />
                <span>Official Iberia / BA / Qatar charts</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <span>SeatSpy verified availability</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative z-10 mx-auto mt-2 w-full max-w-4xl px-4 pb-10 sm:px-8 sm:pb-12"
          >
          {/* ================= INTERACTIVE ROUTE SIMULATOR ================= */}
          <div className="rounded-3xl border border-border/80 bg-card/95 p-6 shadow-xl shadow-espresso/5 backdrop-blur-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-left">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Live comparison simulator
                </span>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-espresso sm:text-2xl">
                  See the travel-hacking math in action
                </h2>
              </div>
              {/* Route Tabs */}
              <div
                role="tablist"
                aria-label="Sample flight routes"
                className="flex flex-wrap gap-2 rounded-2xl bg-secondary/80 p-1.5"
              >
                {sampleRoutes.map(route => {
                  const isActive = selectedRoute.id === route.id
                  return (
                    <button
                      key={route.id}
                      role="tab"
                      aria-selected={isActive}
                      type="button"
                      onClick={() => setSelectedRoute(route)}
                      className={cn(
                        "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all sm:text-sm",
                        isActive
                          ? "bg-espresso text-white shadow-sm"
                          : "text-muted-foreground hover:text-espresso",
                      )}
                    >
                      {route.origin} → {route.destination}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Route Comparison Display */}
            <div className="mt-6 grid gap-4 rounded-2xl border border-border/80 bg-background/80 p-5 sm:grid-cols-3 sm:p-6">
              {/* Normal Cash */}
              <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 text-left">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Normal cash price
                  </span>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-espresso line-through decoration-primary decoration-2 sm:text-4xl">
                    €{selectedRoute.cashEur.toLocaleString("en-GB")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Retail fare via Google Flights / airline</p>
                </div>
                <span className="mt-4 inline-block text-xs font-medium text-muted-foreground">
                  {selectedRoute.cabin}
                </span>
              </div>

              {/* Hacked Award */}
              <div className="flex flex-col justify-between rounded-2xl border border-espresso bg-espresso p-4 text-left text-white">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                      Hacked price
                    </span>
                    <Badge className="rounded-full bg-primary/20 text-[10px] text-white">
                      {selectedRoute.milesProgram}
                    </Badge>
                  </div>
                  <p className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                    €{selectedRoute.taxesEur.toLocaleString("en-GB")}
                  </p>
                  <p className="mt-1 text-xs text-white/70">
                    + {selectedRoute.miles.toLocaleString("en-GB")} Avios
                  </p>
                </div>
                <span className="mt-4 text-xs font-medium text-white/60">
                  Taxes in cash, fare in miles
                </span>
              </div>

              {/* Net Saving */}
              <div className="flex flex-col justify-between rounded-2xl border border-primary/30 bg-primary/10 p-4 text-left">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      You save in EUR
                    </span>
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                      {selectedRoute.savingsPercent}% OFF
                    </span>
                  </div>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-espresso sm:text-4xl">
                    €{selectedRoute.savedEur.toLocaleString("en-GB")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Real cash kept in your pocket
                  </p>
                </div>
                <Button asChild variant="primary" size="sm" className="mt-4 min-h-10 w-full rounded-xl">
                  <Link href={`/quick?origin=${selectedRoute.origin}&destination=${selectedRoute.destination}`}>
                    Verify this route
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          </motion.div>
        </section>

        {/* ================= THREE PATHWAYS / CARDS ================= */}
        <section aria-labelledby="paths-heading" className="flex flex-col">
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Choose your approach
            </span>
            <h2 id="paths-heading" className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-espresso sm:text-4xl md:text-5xl">
              Three ways to unlock savings
            </h2>
            <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
              Whether you have a trip tomorrow, a summer holiday in mind, or everyday spending to optimize.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {mainPaths.map(path => {
              const Icon = path.icon
              const isDark = path.variant === "dark"

              return (
                <motion.div
                  key={path.href}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -6,
                          boxShadow: "0 24px 50px rgba(35, 27, 21, 0.12)",
                        }
                  }
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                  className="h-full rounded-3xl"
                >
                  <Link
                    href={path.href}
                    aria-label={`${path.title}: ${path.description}`}
                    className="group block h-full rounded-3xl"
                  >
                    <Card
                      variant={path.variant}
                      className={cn(
                        "h-full min-h-[340px] justify-between transition-all",
                        isDark ? "hover:border-espresso/80" : "hover:border-primary/40",
                      )}
                    >
                      <CardHeader className="flex-row items-center justify-between p-6 pb-0 sm:p-7 sm:pb-0">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-current/45">
                          {path.number}
                        </span>
                        <div className="flex items-center gap-2">
                          {path.badge && (
                            <span className={cn(
                              "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                              isDark ? "bg-white/15 text-white" : "bg-primary/15 text-primary",
                            )}>
                              {path.badge}
                            </span>
                          )}
                          <span className="grid size-11 place-items-center rounded-full border border-current/15 bg-primary/10 text-primary">
                            <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="mt-8 px-6 pb-0 sm:px-7 sm:pb-0">
                        <CardTitle className="text-2xl leading-tight sm:text-3xl">
                          {path.title}
                        </CardTitle>
                        <CardDescription
                          className={cn(
                            "mt-3 text-base leading-relaxed sm:text-base",
                            isDark ? "text-white/70" : "text-espresso/75",
                          )}
                        >
                          {path.description}
                        </CardDescription>
                      </CardContent>

                      <CardFooter className="mt-auto justify-between border-t border-current/15 px-6 pb-6 pt-5 sm:px-7 sm:pb-7">
                        <span className={cn(
                          "rounded-full px-4 py-1.5 text-xs font-semibold",
                          isDark
                            ? "bg-white text-espresso"
                            : "bg-primary text-primary-foreground",
                        )}>
                          {path.footer}
                        </span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="size-5 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* ================= HOW IT WORKS (3 STEPS) ================= */}
        <section aria-labelledby="how-it-works-heading" className="rounded-3xl border border-border bg-card p-8 sm:p-12 lg:p-16">
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Simple 3-step process
            </span>
            <h2 id="how-it-works-heading" className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-espresso sm:text-4xl">
              How A Una Milla works
            </h2>
            <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
              No complex point spreadsheets or hidden trial accounts. Just pure travel math.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-background/60 p-6 text-left">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-espresso">
                01
              </span>
              <h3 className="text-xl font-semibold text-espresso">Enter your journey</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Tell us your route, travel dates, preferred cabin (Economy or Business), and any miles you already hold in Iberia, BA, or Qatar.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-background/60 p-6 text-left">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-espresso">
                02
              </span>
              <h3 className="text-xl font-semibold text-espresso">Compare normal vs hacked</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We run the official award chart formulas against retail cash fares. You see the exact euros saved and estimated cents-per-mile valuation.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-background/60 p-6 text-left">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-espresso">
                03
              </span>
              <h3 className="text-xl font-semibold text-espresso">Book directly with the airline</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Follow our 3-step checklist to confirm seat availability on SeatSpy and complete the booking on Iberia.com with zero agent markups.
              </p>
            </div>
          </div>
        </section>

        {/* ================= PLAN AHEAD / CARD EARN SIMULATOR ================= */}
        <section aria-labelledby="earn-calculator-heading" className="rounded-3xl border border-espresso bg-espresso p-8 text-white sm:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left text */}
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Spanish Card Strategy
              </span>
              <h2 id="earn-calculator-heading" className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl md:text-5xl">
                Turn monthly spending into flights
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">
                You don’t have to fly millions of miles to accumulate points. Everyday spending on Spanish cards like Revolut or Amex earns RevPoints and Avios every single month.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-white/85">
                  <CheckCircle2 className="size-5 text-primary shrink-0" />
                  <span>Revolut RevPoints transfer 1:1 to Iberia, BA & Qatar</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/85">
                  <CheckCircle2 className="size-5 text-primary shrink-0" />
                  <span>Amex Membership Rewards transfer directly to Avios</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/85">
                  <CheckCircle2 className="size-5 text-primary shrink-0" />
                  <span>Never transfer until you confirm award seat space</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Simulator */}
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md lg:col-span-7 sm:p-8">
              <div className="flex flex-col gap-6">
                {/* Spend slider / selector */}
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="spend-range" className="text-sm font-medium text-white/85">
                      Your monthly card spend
                    </label>
                    <span className="text-2xl font-bold text-primary tabular-nums">
                      €{monthlySpend.toLocaleString("en-GB")}/mo
                    </span>
                  </div>
                  <input
                    id="spend-range"
                    type="range"
                    min="500"
                    max="6000"
                    step="250"
                    value={monthlySpend}
                    onChange={e => setMonthlySpend(Number(e.target.value))}
                    className="mt-3 w-full accent-primary cursor-pointer"
                  />
                  <div className="mt-1 flex justify-between text-xs text-white/40">
                    <span>€500</span>
                    <span>€2,000</span>
                    <span>€4,000</span>
                    <span>€6,000+</span>
                  </div>
                </div>

                {/* Card Tier Selector */}
                <div>
                  <span className="text-sm font-medium text-white/85">Select your card tier</span>
                  <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {spendCards.map(card => {
                      const isSelected = selectedCard.name === card.name
                      return (
                        <button
                          key={card.name}
                          type="button"
                          onClick={() => setSelectedCard(card)}
                          className={cn(
                            "flex flex-col rounded-xl border p-3 text-left transition-all",
                            isSelected
                              ? "border-primary bg-primary/20 text-white"
                              : "border-white/10 bg-white/5 text-white/60 hover:border-white/30",
                          )}
                        >
                          <span className="text-xs font-semibold">{card.name}</span>
                          <span className="mt-1 text-[11px] text-white/50">{card.earnLabel}</span>
                          <span className="mt-2 text-[10px] text-primary">{card.annualFee}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Results projection card */}
                <div className="rounded-xl border border-primary/30 bg-primary/10 p-5">
                  <div className="grid gap-4 sm:grid-cols-3 sm:text-center">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-white/60">
                        Monthly points
                      </span>
                      <p className="mt-1 text-2xl font-bold text-white tabular-nums">
                        +{monthlyPoints.toLocaleString("en-GB")}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-white/60">
                        Yearly points
                      </span>
                      <p className="mt-1 text-2xl font-bold text-white tabular-nums">
                        {yearlyPoints.toLocaleString("en-GB")}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-primary font-bold">
                        To 85k Business Seat
                      </span>
                      <p className="mt-1 text-2xl font-bold text-primary tabular-nums">
                        ~{monthsToTarget} months
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-center text-xs text-white/60">
                    Calculated for Madrid → Johannesburg Business class (85,000 Avios).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHY TRAVEL HACKING COMPARISON ================= */}
        <section aria-labelledby="why-table-heading" className="flex flex-col">
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              The Reality Check
            </span>
            <h2 id="why-table-heading" className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-espresso sm:text-4xl md:text-5xl">
              Cash tickets vs. Travel hacking
            </h2>
            <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
              Why smart travelers fly long-haul business class for less than economy cash fares.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Cash Approach */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-destructive/10 text-destructive font-bold">
                  ✕
                </span>
                <h3 className="text-xl font-semibold text-espresso">The Old Way (Retail Cash)</h3>
              </div>
              <ul className="mt-6 flex flex-col gap-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-destructive">✕</span>
                  <span><strong>Volatile dynamic pricing:</strong> Fares double or triple during holidays and high-demand weeks.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-destructive">✕</span>
                  <span><strong>Overpriced business class:</strong> Paying €2,500–€4,500 out of pocket for long-haul lie-flat seats.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-destructive">✕</span>
                  <span><strong>Zero strategy:</strong> Everyday spending on debit cards earns zero travel value.</span>
                </li>
              </ul>
            </div>

            {/* Travel Hacking Approach */}
            <div className="rounded-3xl border border-primary/40 bg-card p-6 shadow-md shadow-primary/5 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary font-bold">
                  ✓
                </span>
                <h3 className="text-xl font-semibold text-espresso">The A Una Milla Way (Miles & Charts)</h3>
              </div>
              <ul className="mt-6 flex flex-col gap-4 text-sm text-espresso">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-primary">✓</span>
                  <span><strong>Fixed distance chart bands:</strong> Off-peak award redemptions require the exact same miles regardless of airline fare inflation.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-primary">✓</span>
                  <span><strong>Pay only taxes in cash:</strong> Fly business class for €300–€500 in genuine airport taxes plus accumulated miles.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-primary">✓</span>
                  <span><strong>Everyday spending power:</strong> Supermarket and fuel expenses turn directly into Avios via Spanish cards.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
        <section aria-labelledby="faq-heading" className="mx-auto w-full max-w-3xl">
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Got questions?
            </span>
            <h2 id="faq-heading" className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-espresso sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-10 flex flex-col gap-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index

              return (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-border bg-card transition-all"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="flex min-h-14 w-full items-center justify-between p-5 text-left text-base font-semibold text-espresso sm:text-lg"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        "size-5 shrink-0 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180 text-primary",
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-border/60 px-5 pb-5 pt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ================= FINAL CTA BANNER ================= */}
        <section className="relative overflow-hidden rounded-3xl border border-espresso bg-espresso px-6 py-12 text-center text-white shadow-2xl sm:px-12 sm:py-16">
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -top-24 flex justify-center opacity-25"
          >
            <div className="h-96 w-96 rounded-full bg-primary blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Ready to fly better?
            </span>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Stop overpaying for flights. Start traveling smart.
            </h2>
            <p className="mt-4 max-w-xl text-base text-white/75 sm:text-lg">
              Compare your next route in 30 seconds and keep thousands of euros where they belong—in your pocket.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild variant="primary" size="lg" className="min-h-12 rounded-full px-8 text-base shadow-lg shadow-primary/25">
                <Link href="/quick">
                  Try Quick flight
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-h-12 rounded-full border-white/20 bg-white/10 px-8 text-base text-white hover:bg-white/20">
                <Link href="/saved">View saved trips</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="border-t border-border pt-8 text-center text-xs font-medium text-muted-foreground sm:pt-10">
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-espresso">
              <Link href="/quick" className="hover:text-primary transition-colors">Quick flight</Link>
              <Link href="/trip" className="hover:text-primary transition-colors">Full trip</Link>
              <Link href="/plan" className="hover:text-primary transition-colors">Plan ahead</Link>
              <Link href="/saved" className="hover:text-primary transition-colors">Saved trips</Link>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              A Una Milla · Same trip. Much less money. Travel hacking, made simple.
            </p>
            <span className="font-semibold tracking-[0.08em] text-espresso">
              @aunamilladetudestino
            </span>
          </div>
        </footer>
      </motion.div>
    </div>
  )
}
