"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Coins,
  Cpu,
  CreditCard,
  DollarSign,
  ExternalLink,
  Layers,
  LineChart,
  Lock,
  Percent,
  Plane,
  Server,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PartnerApi {
  name: string
  referenceUrl: string
  role: string
  estimatedCost: string
  searchHorizon: string
  dataProvided: string
  spainSuitability: string
  pros: string
}

const partnerApis: PartnerApi[] = [
  {
    name: "AwardTravelFinder Enterprise API",
    referenceUrl: "https://awardtravelfinder.com/enterprise-api",
    role: "Primary Real-time Award Availability",
    estimatedCost: "$499/mo (15k queries) or ~$0.03/call",
    searchHorizon: "Up to 355–360 days ahead",
    dataProvided: "Real-time award seats, cabin availability (Business, First, Economy), points required, tax breakdown across Oneworld & Star Alliance.",
    spainSuitability: "Exceptional. Native support for Iberia Plus, British Airways Club, and Qatar Privilege Club.",
    pros: "Direct award inventory with official mileage tables; ideal for live booking assistant.",
  },
  {
    name: "SeatSpy Enterprise API",
    referenceUrl: "https://www.seatspy.com",
    role: "Full Calendar Availability Heatmaps",
    estimatedCost: "~$350–$750/mo flat enterprise tier",
    searchHorizon: "Up to 355 days ahead",
    dataProvided: "365-day seat count calendar snapshots for Iberia, British Airways, Virgin Atlantic, and American Airlines.",
    spainSuitability: "High. Industry standard for Iberia Madrid hub availability sweeps.",
    pros: "Instant batch queries without per-date rate limits; ideal for caching full-year availability.",
  },
  {
    name: "Seats.aero Partner API",
    referenceUrl: "https://seats.aero",
    role: "Global Award Inventory Scraping & Alerts",
    estimatedCost: "$250/mo Pro / Commercial API",
    searchHorizon: "60 to 365 days (varies by airline)",
    dataProvided: "Live cached award flights across 20+ airline frequent flyer programs.",
    spainSuitability: "Moderate. Strong Oneworld coverage, but smaller focus on local Spanish card transfers.",
    pros: "Cost-effective broad coverage for secondary regional connections.",
  },
  {
    name: "Duffel Flights API",
    referenceUrl: "https://duffel.com",
    role: "Commercial Cash Fares & NDC Direct Ticketing",
    estimatedCost: "Free search API; €1.50–€3.00 per booked ticket",
    searchHorizon: "Up to 330–360 days ahead",
    dataProvided: "Direct IATA NDC connection, live airline cash fares, baggage selection, and direct ticketing.",
    spainSuitability: "High. Integrated with Iberia, Vueling, and British Airways.",
    pros: "Allows in-app cash flight bookings with custom service markup (€15–€25/booking).",
  },
  {
    name: "Amadeus Travel API",
    referenceUrl: "https://developers.amadeus.com",
    role: "Global Retail Airline Intelligence & Schedules",
    estimatedCost: "Free 2k calls/mo, then €0.002 per call",
    searchHorizon: "Up to 365 days ahead",
    dataProvided: "Global airline schedules, delay probability, benchmark retail cash pricing.",
    spainSuitability: "High. Global headquarters in Madrid; complete European route coverage.",
    pros: "Benchmark comparison for Google Flights retail prices.",
  },
]

export function FeasibilityIntelligence() {
  const [activeTab, setActiveTab] = useState<"api" | "costs" | "revenue" | "loyalty">("api")

  return (
    <div className="mx-auto w-full max-w-6xl py-8 sm:py-14">
      <Alert className="mb-8 border-primary/25 bg-primary/5 text-left">
        <AlertTitle>Research & pitch appendix</AlertTitle>
        <AlertDescription>
          Partner costs and revenue figures are for jury discussion — the live product uses Fixture/Duffel TEST cash, chart miles, and illustrative Spain card JSON.
        </AlertDescription>
      </Alert>
      {/* Page Header */}
      <div className="flex flex-col items-center text-center">
        <Badge className="border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Feasibility & Architecture Analysis
        </Badge>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-espresso sm:text-5xl">
          API Costs, Feasibility & Revenue Model
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Complete engineering and economic evaluation of building an AI-Powered Flight Booking
          Assistant operating with Spanish loyalty programs (Iberia Plus, RevPoints, Amex).
        </p>

        {/* Tab Switcher */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("api")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm",
              activeTab === "api"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-espresso"
            )}
          >
            <Server className="size-4" />
            <span>Partner API Comparison</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("costs")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm",
              activeTab === "costs"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-espresso"
            )}
          >
            <DollarSign className="size-4" />
            <span>Operating Costs & Unit Economics</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("revenue")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm",
              activeTab === "revenue"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-espresso"
            )}
          >
            <TrendingUp className="size-4" />
            <span>Booking Providers & Markups</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("loyalty")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm",
              activeTab === "loyalty"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-espresso"
            )}
          >
            <Coins className="size-4" />
            <span>Spain Loyalty Mapping</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Partner API Comparison */}
      {activeTab === "api" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-10 flex flex-col gap-6"
        >
          {/* Reference Notice */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-xs">
            <span className="font-medium text-espresso">
              Primary Reference API:{" "}
              <strong className="text-primary font-bold">
                https://awardtravelfinder.com/enterprise-api
              </strong>
            </span>
            <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <a
                href="https://awardtravelfinder.com/enterprise-api"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>View Enterprise Spec</span>
                <ExternalLink className="size-3" />
              </a>
            </Button>
          </div>

          {/* Cards for each partner */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {partnerApis.map((api, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-md transition-all hover:border-primary/50"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-espresso">{api.name}</h3>
                    <Badge className="border-border bg-secondary text-[11px] font-semibold text-espresso">
                      {api.searchHorizon}
                    </Badge>
                  </div>
                  <span className="text-xs font-semibold text-primary">{api.role}</span>

                  <div className="mt-4 flex flex-col gap-2.5 text-xs">
                    <div className="rounded-xl border border-border/60 bg-secondary/30 p-2.5">
                      <span className="font-semibold text-espresso">Estimated Cost: </span>
                      <span className="text-muted-foreground">{api.estimatedCost}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-espresso">Data Provided: </span>
                      <p className="mt-0.5 text-muted-foreground leading-relaxed">
                        {api.dataProvided}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-espresso">Spain Loyalty Fit: </span>
                      <p className="mt-0.5 text-muted-foreground leading-relaxed">
                        {api.spainSuitability}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-border/60 pt-3 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  ✓ {api.pros}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 2: Operating Costs & Unit Economics */}
      {activeTab === "costs" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-10 flex flex-col gap-8"
        >
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Cost per User Query
              </span>
              <p className="mt-2 text-2xl font-bold text-espresso">~€0.025</p>
              <span className="text-[11px] text-muted-foreground">API + LLM inference</span>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pro Subscription
              </span>
              <p className="mt-2 text-2xl font-bold text-primary">€19 / mo</p>
              <span className="text-[11px] text-muted-foreground">100 queries included</span>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Gross Profit Margin
              </span>
              <p className="mt-2 text-2xl font-bold text-emerald-600">81.5%</p>
              <span className="text-[11px] text-muted-foreground">At 5% conversion rate</span>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Max Search Horizon
              </span>
              <p className="mt-2 text-2xl font-bold text-espresso">355–360 Days</p>
              <span className="text-[11px] text-muted-foreground">Full schedule release</span>
            </div>
          </div>

          {/* Detailed Financial Model Breakdown */}
          <div className="rounded-3xl border border-border/80 bg-card p-7 shadow-lg sm:p-8">
            <h3 className="text-xl font-bold text-espresso">
              Monthly Unit Economics (1,000 Active Monthly Users)
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Based on 950 Free Explorer users (5 searches/mo) and 50 Pro Travel Hackers (avg 35 searches/mo).
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3">Cost Component</th>
                    <th className="pb-3">Provider</th>
                    <th className="pb-3">Monthly Volume</th>
                    <th className="pb-3">Monthly Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-espresso">
                  <tr>
                    <td className="py-3 font-semibold">Award Flight Queries</td>
                    <td className="py-3 text-muted-foreground">AwardTravelFinder / SeatSpy</td>
                    <td className="py-3">6,500 API calls</td>
                    <td className="py-3 font-bold">€130.00</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">AI Assistant Inference</td>
                    <td className="py-3 text-muted-foreground">Gemini 1.5 Flash / GPT-4o-mini</td>
                    <td className="py-3">12,000 chat turns</td>
                    <td className="py-3 font-bold">€18.00</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">Database & Auth Hosting</td>
                    <td className="py-3 text-muted-foreground">Supabase Pro Tier</td>
                    <td className="py-3">1,000 user profiles</td>
                    <td className="py-3 font-bold">€25.00</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">Edge Web Hosting</td>
                    <td className="py-3 text-muted-foreground">Vercel Pro</td>
                    <td className="py-3">50GB bandwidth</td>
                    <td className="py-3 font-bold">€20.00</td>
                  </tr>
                  <tr className="bg-secondary/40 font-bold">
                    <td className="py-3">TOTAL OPERATING COST</td>
                    <td className="py-3">—</td>
                    <td className="py-3">—</td>
                    <td className="py-3 text-destructive">€193.00 / mo</td>
                  </tr>
                  <tr className="bg-primary/10 font-bold text-primary">
                    <td className="py-3">SUBSCRIPTION REVENUE</td>
                    <td className="py-3">Stripe Payments</td>
                    <td className="py-3">50 Pro users @ €19/mo</td>
                    <td className="py-3">€950.00 / mo</td>
                  </tr>
                  <tr className="bg-emerald-50 dark:bg-emerald-950 font-bold text-emerald-800 dark:text-emerald-300">
                    <td className="py-3">NET MONTHLY PROFIT</td>
                    <td className="py-3">—</td>
                    <td className="py-3">—</td>
                    <td className="py-3">€757.00 / mo (79.7% margin)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: Booking Providers & Revenue Models */}
      {activeTab === "revenue" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {/* Stream 1 */}
          <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-md">
            <div>
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-espresso">
                1. Direct Airline Referral (Zero Markup)
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Users book award tickets directly on <strong>Iberia.com</strong> or <strong>ba.com</strong> using our prefilled deep links.
              </p>
              <div className="mt-4 rounded-xl border border-border/60 bg-secondary/30 p-3 text-xs">
                <span className="font-semibold text-espresso">Why this wins: </span>
                <p className="mt-1 text-muted-foreground">
                  Airlines strictly restrict third-party award markups. By keeping award booking at 0% markup, we establish absolute user trust and drive subscriptions.
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-border/60 pt-3 text-[11px] font-bold text-primary">
              Monetized via Pro Subscriptions
            </div>
          </div>

          {/* Stream 2 */}
          <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-md">
            <div>
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Plane className="size-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-espresso">
                2. Duffel NDC Direct Ticketing (With Markup)
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                For commercial cash bookings and split cash/miles itineraries, integrate Duffel Flights API.
              </p>
              <div className="mt-4 rounded-xl border border-border/60 bg-secondary/30 p-3 text-xs">
                <span className="font-semibold text-espresso">Markup Capabilities: </span>
                <p className="mt-1 text-muted-foreground">
                  Apply a <strong>€15 to €25 convenience fee</strong> per booking for concierge automatic check-in, seat selection, and WhatsApp disruption support.
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-border/60 pt-3 text-[11px] font-bold text-emerald-600">
              €15–€25 Net per Ticketed Booking
            </div>
          </div>

          {/* Stream 3 */}
          <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-md">
            <div>
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Building2 className="size-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-espresso">
                3. High-Value Affiliate Programs
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Partner with travel and financial brands that reward commissions and bonus points to users.
              </p>
              <div className="mt-4 rounded-xl border border-border/60 bg-secondary/30 p-3 text-xs">
                <span className="font-semibold text-espresso">Partner Commissions: </span>
                <ul className="mt-1 flex flex-col gap-1 text-muted-foreground">
                  <li>• <strong>Revolut Spain:</strong> €25–€40 CPA per Metal account</li>
                  <li>• <strong>Amex Spain:</strong> €75–€120 CPA per Platinum approval</li>
                  <li>• <strong>Booking.com / Rocketmiles:</strong> 4–6% hotel booking commission</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 border-t border-border/60 pt-3 text-[11px] font-bold text-amber-600">
              High Affiliate CPA Potential
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 4: Spain Loyalty Mapping */}
      {activeTab === "loyalty" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-10 rounded-3xl border border-border/80 bg-card p-7 shadow-lg sm:p-8"
        >
          <h3 className="text-xl font-bold text-espresso">
            Spanish Loyalty Program & Earning Architecture
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            How A Una Milla bridges Spanish bank products with global Oneworld airline inventory.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-secondary/30 p-4">
              <span className="text-xs font-bold text-espresso">Iberia Plus & British Airways</span>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Avios balance is 100% unified. Users can transfer Avios back and forth with 0 conversion fees between Iberia Plus, BA Executive Club, and Qatar Privilege Club.
              </p>
              <div className="mt-3 text-xs font-bold text-primary">
                Avios Pooling & Multi-alliance
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/30 p-4">
              <span className="text-xs font-bold text-espresso">Revolut Spain (RevPoints)</span>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Spanish users earn 1 to 1.5 RevPoints per €1-2 spent on Standard, Plus, Premium, Metal, and Ultra tiers. Converts 1:1 into Avios in seconds.
              </p>
              <div className="mt-3 text-xs font-bold text-primary">
                Everyday Spending Power
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/30 p-4">
              <span className="text-xs font-bold text-espresso">British Airways Avios Booster</span>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Multiply any flight or credit card points by 3x for ~€0.0105 per Avios. The cheapest official method in Europe to top off an award balance.
              </p>
              <div className="mt-3 text-xs font-bold text-primary">
                Instant Point Multiplier
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
