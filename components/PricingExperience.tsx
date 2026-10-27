"use client"

import { useState } from "react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Bell,
  Bot,
  Calendar,
  Check,
  CheckCircle2,
  Coins,
  CreditCard,
  HelpCircle,
  Lock,
  Plane,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PricingTier {
  id: "free" | "pro" | "elite"
  name: string
  tagline: string
  priceMonthly: number
  priceYearly: number
  apiRequests: string
  searchWindow: string
  isPopular?: boolean
  features: string[]
  missingFeatures?: string[]
  ctaText: string
}

const pricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Explorer",
    tagline: "For casual flyers testing the travel hacking waters.",
    priceMonthly: 0,
    priceYearly: 0,
    apiRequests: "5 live searches / month",
    searchWindow: "Up to 30 days ahead",
    features: [
      "5 live flight searches per month",
      "Search up to 30 days ahead",
      "Retail cash vs Avios calculator",
      "Standard Iberia & BA award charts",
      "Basic AI chat consultation",
      "Zero booking fees (direct airline links)",
    ],
    missingFeatures: [
      "355-day advance schedule search",
      "AwardTravelFinder live inventory",
      "Instant WhatsApp & Email seat alerts",
      "1-on-1 OpenClaw booking concierge",
    ],
    ctaText: "Current Plan",
  },
  {
    id: "pro",
    name: "Travel Hacker",
    tagline: "For travelers who want real-time business class award space & alerts.",
    priceMonthly: 19,
    priceYearly: 15,
    isPopular: true,
    apiRequests: "100 API searches / month",
    searchWindow: "Up to 355 days ahead (Full calendar)",
    features: [
      "100 live API searches per month",
      "Search up to 355 days ahead (full airline release)",
      "AwardTravelFinder & SeatSpy real-time seat inventory",
      "Revolut RevPoints & Amex Spain points roadmap",
      "Full Generative UI AI Flight Booking Assistant",
      "Save unlimited custom trip itineraries",
      "Instant award seat drop alerts (Email & WhatsApp)",
      "Priority API response caching",
    ],
    ctaText: "Upgrade to Pro",
  },
  {
    id: "elite",
    name: "Elite Concierge",
    tagline: "For frequent flyers and high-spend executives demanding zero friction.",
    priceMonthly: 49,
    priceYearly: 39,
    apiRequests: "Unlimited searches & tracking",
    searchWindow: "Up to 360 days ahead",
    features: [
      "Unlimited searches & seat tracking",
      "Search up to 360 days ahead across all alliances",
      "Full Enterprise API suite (AwardTravelFinder + SeatSpy + Duffel)",
      "1-on-1 OpenClaw dedicated AI booking concierge",
      "Hotel point accelerators (up to +15,000 bonus Avios)",
      "Multi-traveler family points pooling strategies",
      "Direct GDS/NDC assisted booking support",
      "24/7 VIP priority support",
    ],
    ctaText: "Get Elite Concierge",
  },
]

export function PricingExperience() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [activePlanId, setActivePlanId] = useState<string>("free")

  function handleSelectPlan(tier: PricingTier) {
    if (tier.id === "free") {
      toast.info("You are currently on the Free Explorer plan.")
      return
    }
    setSelectedTier(tier)
    setIsCheckoutOpen(true)
  }

  function handleSimulateStripePayment() {
    if (!selectedTier) return
    setIsProcessingPayment(true)
    setTimeout(() => {
      setIsProcessingPayment(false)
      setIsCheckoutOpen(false)
      setActivePlanId(selectedTier.id)
      toast.success(`Successfully upgraded to ${selectedTier.name}!`, {
        description: `Your ${selectedTier.apiRequests} and ${selectedTier.searchWindow} are now active.`,
      })
    }, 1800)
  }

  return (
    <div className="mx-auto w-full max-w-6xl py-8 sm:py-14">
      <Alert className="mb-8 border-primary/25 bg-primary/5 text-left">
        <AlertTitle>Demo pricing page</AlertTitle>
        <AlertDescription>
          Tiers and Stripe checkout are illustrative for the hackathon pitch — no real billing or subscriptions are charged.
        </AlertDescription>
      </Alert>
      {/* Page Header */}
      <div className="flex flex-col items-center text-center">
        <Badge className="border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Plans & API Usage Limits
        </Badge>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-espresso sm:text-5xl">
          Transparent plans for every traveler.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Connect directly with official airline award charts and enterprise inventory. Never pay
          commissions or flight markups.
        </p>

        {/* Monthly / Yearly Billing Toggle */}
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-card p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "rounded-xl px-5 py-2.5 text-xs font-bold transition-all sm:text-sm",
              billingCycle === "monthly"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-espresso"
            )}
          >
            Monthly billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all sm:text-sm",
              billingCycle === "yearly"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-espresso"
            )}
          >
            <span>Yearly billing</span>
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-extrabold text-primary">
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="mt-12 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
        {pricingTiers.map(tier => {
          const price = billingCycle === "monthly" ? tier.priceMonthly : tier.priceYearly
          const isCurrentActive = activePlanId === tier.id

          return (
            <motion.div
              key={tier.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "relative flex flex-col justify-between rounded-3xl border p-7 shadow-lg transition-all sm:p-8",
                tier.isPopular
                  ? "border-primary bg-card ring-2 ring-primary/20"
                  : "border-border/80 bg-card/80"
              )}
            >
              {/* Popular Badge */}
              {tier.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-espresso">{tier.name}</h3>
                  {isCurrentActive && (
                    <Badge className="border-emerald-500/30 bg-emerald-50 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Active
                    </Badge>
                  )}
                </div>
                <p className="mt-2 min-h-10 text-xs leading-relaxed text-muted-foreground">
                  {tier.tagline}
                </p>

                {/* Price Display */}
                <div className="mt-5 flex items-baseline gap-1 border-b border-border/60 pb-5">
                  <span className="text-4xl font-extrabold tracking-tight text-espresso sm:text-5xl">
                    €{price}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    / month {billingCycle === "yearly" && tier.priceMonthly > 0 ? "billed yearly" : ""}
                  </span>
                </div>

                {/* Key Usage Limits Callouts */}
                <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-border/80 bg-secondary/40 p-3.5 text-xs">
                  <div className="flex items-center justify-between font-semibold text-espresso">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Zap className="size-3.5 text-primary" /> API Requests:
                    </span>
                    <span>{tier.apiRequests}</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-espresso">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="size-3.5 text-primary" /> Search Horizon:
                    </span>
                    <span>{tier.searchWindow}</span>
                  </div>
                </div>

                {/* Feature List */}
                <div className="mt-6 flex flex-col gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Included Features
                  </span>
                  <ul className="flex flex-col gap-2.5 text-xs text-espresso">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {tier.missingFeatures && tier.missingFeatures.length > 0 && (
                    <ul className="mt-2 flex flex-col gap-2 text-xs text-muted-foreground/60 line-through">
                      {tier.missingFeatures.map((mFeature, mIdx) => (
                        <li key={mIdx} className="flex items-start gap-2.5">
                          <X className="mt-0.5 size-3.5 shrink-0" />
                          <span>{mFeature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4">
                <Button
                  type="button"
                  variant={tier.isPopular ? "primary" : "outline"}
                  size="lg"
                  disabled={isCurrentActive}
                  onClick={() => handleSelectPlan(tier)}
                  className="h-12 w-full rounded-xl text-sm font-semibold shadow-sm"
                >
                  {isCurrentActive ? "Active Plan" : tier.ctaText}
                </Button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="mt-14 rounded-3xl border border-border/80 bg-foreground p-8 text-background shadow-xl sm:p-10">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cancel Anytime</h4>
              <p className="text-xs text-background/70">No lock-ins. One-click pause or cancellation.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <CreditCard className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Stripe 256-bit Security</h4>
              <p className="text-xs text-background/70">Encrypted payments via official Stripe portal.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Coins className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Zero Booking Markup</h4>
              <p className="text-xs text-background/70">Book direct with the airline. 0% ticket fees.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Payment Simulator Modal */}
      <AnimatePresence>
        {isCheckoutOpen && selectedTier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="absolute right-5 top-5 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-espresso"
              >
                <X className="size-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CreditCard className="size-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Stripe Checkout
                </span>
              </div>

              <h3 className="mt-2 text-2xl font-bold text-espresso">
                Upgrade to {selectedTier.name}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Instant access to {selectedTier.apiRequests} and {selectedTier.searchWindow}.
              </p>

              {/* Order Summary */}
              <div className="my-5 rounded-2xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center justify-between text-sm font-semibold text-espresso">
                  <span>{selectedTier.name} Plan ({billingCycle})</span>
                  <span>
                    €{billingCycle === "monthly" ? selectedTier.priceMonthly : selectedTier.priceYearly * 12}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Billing interval</span>
                  <span className="capitalize">{billingCycle}</span>
                </div>
              </div>

              {/* Mock Stripe Payment Card Elements */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Card Information
                  </label>
                  <div className="mt-1 flex items-center rounded-xl border border-border bg-background px-3 py-2.5 shadow-sm">
                    <CreditCard className="size-4 text-muted-foreground mr-2" />
                    <input
                      type="text"
                      readOnly
                      value="•••• •••• •••• 4242"
                      className="w-full bg-transparent text-sm font-mono text-espresso outline-none"
                    />
                    <span className="text-xs font-semibold text-primary">TEST CARD</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Expires
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="12 / 28"
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-mono text-espresso outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      CVC
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="•••"
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-mono text-espresso outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Payment Button */}
              <Button
                type="button"
                variant="primary"
                size="lg"
                disabled={isProcessingPayment}
                onClick={handleSimulateStripePayment}
                className="mt-6 h-12 w-full rounded-xl text-sm font-semibold shadow-md"
              >
                {isProcessingPayment ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing via Stripe…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Lock className="size-4" />
                    Pay €{billingCycle === "monthly" ? selectedTier.priceMonthly : selectedTier.priceYearly} with Stripe
                  </span>
                )}
              </Button>

              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Simulated Stripe Sandbox. No actual funds will be charged.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
