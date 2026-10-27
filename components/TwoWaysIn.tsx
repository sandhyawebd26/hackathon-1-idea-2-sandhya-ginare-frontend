"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  Plane,
  Route,
  ShieldCheck,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const paths = [
  {
    href: "/quick",
    title: "Quick flight",
    description: "One route, one clear comparison. Start with the flight you already have in mind.",
    footer: "A few details, then your answer",
    icon: Plane,
    variant: "cream" as const,
  },
  {
    href: "/trip",
    title: "Full trip plan",
    description: "Map several stops, dates, and travellers to see how the whole journey fits together.",
    footer: "Build the complete itinerary",
    icon: Route,
    variant: "dark" as const,
  },
]

const benefits = [
  {
    number: "01",
    title: "Know what your miles are worth",
    description: "See the cash fare, award cost, taxes, and estimated difference side by side.",
  },
  {
    number: "02",
    title: "Make the trade-offs visible",
    description: "Compare a miles booking with paying cash before you commit to either one.",
  },
  {
    number: "03",
    title: "Keep your next move simple",
    description: "Get a practical checklist for checking availability and booking with confidence.",
  },
]

const steps = [
  { title: "Share your route", description: "Add the airports, dates, cabin, and points you already have." },
  { title: "Compare the options", description: "See an illustrative cash-versus-miles breakdown with fees included." },
  { title: "Choose your next move", description: "Use the booking checklist to confirm the details directly with the provider." },
]

export function TwoWaysIn() {
  const shouldReduceMotion = Boolean(useReducedMotion())
  const revealTransition = {
    duration: shouldReduceMotion ? 0 : 0.55,
    ease: [0.22, 1, 0.36, 1] as const,
  }
  const staggerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: shouldReduceMotion ? 0 : 0.08,
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  }
  const itemVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: revealTransition },
  }

  return (
    <div className="flex flex-1 flex-col">
      <section className="grid flex-1 items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-14 lg:py-20">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition}
          className="max-w-2xl"
        >
          <Badge variant="outline" className="rounded-full border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-brand-gold">
            <Compass aria-hidden="true" className="mr-2 size-3.5" />
            A calmer way to travel further
          </Badge>
          <h1 className="mt-6 max-w-2xl font-display text-5xl leading-[0.98] tracking-[-0.055em] text-brand-paper sm:text-6xl lg:text-7xl">
            Make every mile <span className="text-brand-gold">mean more.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Same trip. Much less money. See how the points you already have could change the cost of your next flight.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild variant="primary" size="lg" className="group min-h-12 rounded-full px-6">
              <Link href="/quick">
                Compare a flight
                <ArrowRight data-icon="inline-end" aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="min-h-12 rounded-full px-6">
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><Check aria-hidden="true" className="size-4 text-brand-gold" /> Search without an account</span>
            <span className="inline-flex items-center gap-2"><Check aria-hidden="true" className="size-4 text-brand-gold" /> Fees shown in the comparison</span>
          </div>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 22, rotate: 1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ ...revealTransition, delay: shouldReduceMotion ? 0 : 0.12 }}
          whileHover={shouldReduceMotion ? undefined : { y: -4 }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div aria-hidden="true" className="absolute -inset-6 rounded-[2.5rem] bg-brand-indigo/25 blur-3xl" />
          <Card variant="cream" className="relative overflow-hidden rounded-[2rem] border-white/10 bg-card/90 shadow-2xl shadow-brand-ink/40 backdrop-blur">
            <CardHeader className="flex-row items-start justify-between gap-4 p-6 pb-0 sm:p-8 sm:pb-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">A sample comparison</p>
                <CardTitle className="mt-2 text-2xl tracking-tight text-brand-paper">Your next route</CardTitle>
              </div>
              <Badge variant="outline" className="rounded-full border-white/10 bg-white/5 text-muted-foreground">Illustrative</Badge>
            </CardHeader>
            <CardContent className="p-6 pt-5 sm:p-8 sm:pt-6">
              <div className="rounded-2xl border border-white/8 bg-brand-ink/60 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                  <span>Madrid · MAD</span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-paper">Business</span>
                  <span>J’burg · JNB</span>
                </div>
                <div className="mt-5 flex items-center gap-3" aria-hidden="true">
                  <span className="size-2 rounded-full bg-brand-gold shadow-[0_0_18px_rgb(var(--brand-gold)/0.7)]" />
                  <motion.div
                    initial={shouldReduceMotion ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.4, ease: "easeOut" }}
                    className="h-px flex-1 origin-left bg-gradient-to-r from-brand-gold/70 via-brand-indigo to-brand-gold/70"
                  />
                  <Plane className="size-4 -rotate-12 text-brand-gold" />
                  <span className="size-2 rounded-full bg-brand-gold shadow-[0_0_18px_rgb(var(--brand-gold)/0.7)]" />
                </div>
                <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                  <span>15 Nov 2026</span>
                  <span>Round trip</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs text-muted-foreground">Typical cash fare</p>
                  <p className="mt-2 text-2xl font-semibold tabular-nums text-brand-paper">€2,840</p>
                </div>
                <div className="rounded-2xl border border-brand-gold/20 bg-brand-gold/[0.06] p-4">
                  <p className="text-xs text-muted-foreground">Avios + taxes</p>
                  <p className="mt-2 text-2xl font-semibold tabular-nums text-brand-gold">€612</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="mx-6 mb-6 mt-0 flex items-center justify-between gap-4 rounded-2xl border border-brand-gold/20 bg-brand-indigo/25 px-4 py-4 sm:mx-8 sm:mb-8">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Estimated difference</p>
                <p className="mt-1 text-xl font-semibold text-brand-paper">€2,228 less</p>
              </div>
              <ShieldCheck aria-hidden="true" className="size-6 shrink-0 text-brand-gold" />
            </CardFooter>
          </Card>
          <p className="relative mt-3 text-center text-xs text-muted-foreground">
            Example only · confirm live award availability and fees before booking.
          </p>
        </motion.div>
      </section>

      <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-28 border-t border-white/8 py-14 sm:py-16">
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={staggerVariants}
          className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12"
        >
          <motion.div variants={itemVariants}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">A better way to plan</p>
            <h2 id="how-heading" className="mt-3 max-w-md font-display text-3xl leading-tight tracking-tight text-brand-paper sm:text-4xl">
              Clarity before you book.
            </h2>
            <p className="mt-4 max-w-md leading-7 text-muted-foreground">
              A Una Milla brings the important numbers into one place, so you can decide with your eyes open.
            </p>
          </motion.div>
          <div className="grid gap-3 sm:grid-cols-3">
            {benefits.map(item => (
              <motion.article
                key={item.number}
                variants={itemVariants}
                className="rounded-2xl border border-white/8 bg-card/75 p-5 transition-colors hover:border-brand-gold/25 sm:p-6"
              >
                <span className="font-mono text-xs font-semibold tracking-[0.16em] text-brand-gold">{item.number}</span>
                <h3 className="mt-5 text-lg font-semibold leading-snug text-brand-paper">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      <section aria-labelledby="steps-heading" className="border-t border-white/8 py-14 sm:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">Three simple steps</p>
            <h2 id="steps-heading" className="mt-3 font-display text-3xl tracking-tight text-brand-paper sm:text-4xl">From route to next move.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">Your search is private to your session. Sign in only when you want to save a trip.</p>
        </div>
        <motion.ol
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerVariants}
          className="mt-8 grid gap-3 md:grid-cols-3"
        >
          {steps.map((step, index) => (
            <motion.li key={step.title} variants={itemVariants} className="relative flex gap-4 rounded-2xl border border-white/8 bg-card/65 p-5 sm:p-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-brand-gold/25 bg-brand-gold/10 font-mono text-sm font-semibold text-brand-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-semibold text-brand-paper">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </section>

      <section id="start" aria-labelledby="start-heading" className="border-t border-white/8 py-14 sm:py-16">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">Choose your starting point</p>
            <h2 id="start-heading" className="mt-3 font-display text-3xl tracking-tight text-brand-paper sm:text-4xl">One flight or the whole journey.</h2>
          </div>
          <Link href="/chat" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-brand-gold">
            Ask the travel assistant <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <motion.div
          variants={staggerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-4 md:grid-cols-2"
        >
          {paths.map((path, index) => {
            const Icon = path.icon

            return (
              <motion.div
                key={path.href}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? undefined : { y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="h-full rounded-3xl"
              >
                <Link href={path.href} className="group block h-full rounded-3xl" aria-label={`${path.title}. ${path.description}`}>
                  <Card variant={path.variant} className="h-full min-h-[270px] justify-between rounded-3xl p-0 sm:min-h-[300px]">
                    <CardHeader className="flex-row items-center justify-between p-6 pb-0 sm:p-8 sm:pb-0">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-current/50">0{index + 1}</span>
                      <span className="grid size-12 place-items-center rounded-full border border-current/15 bg-brand-gold/10 text-brand-gold">
                        <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
                      </span>
                    </CardHeader>
                    <CardContent className="mt-8 px-6 pb-0 sm:px-8 sm:pb-0">
                      <CardTitle className="text-3xl leading-tight tracking-tight sm:text-4xl">{path.title}</CardTitle>
                      <CardDescription className="mt-3 max-w-lg text-base leading-7 text-current/70">{path.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="mt-auto justify-between border-t border-current/15 px-6 pb-6 pt-5 sm:px-8 sm:pb-8">
                      <span className="text-sm font-medium text-current/75">{path.footer}</span>
                      <ArrowUpRight aria-hidden="true" className="size-5 text-brand-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      <section className="mb-12 overflow-hidden rounded-[2rem] border border-brand-gold/20 bg-gradient-to-br from-brand-indigo/45 via-card to-card px-6 py-8 sm:mb-16 sm:px-10 sm:py-10">
        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">Ready when you are</p>
            <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight text-brand-paper sm:text-4xl">The next great trip starts with one comparison.</h2>
            <p className="mt-3 max-w-xl leading-7 text-muted-foreground">No account needed to explore. Just bring a route and the points you have.</p>
          </div>
          <Button asChild variant="primary" size="lg" className="group min-h-12 shrink-0 rounded-full px-6">
            <Link href="/quick">
              Start with a flight
              <ArrowRight data-icon="inline-end" aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
