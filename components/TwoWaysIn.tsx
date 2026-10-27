"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Compass,
  MapPin,
  Plane,
  Route,
  Search,
  type LucideIcon,
} from "lucide-react"

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

type PathOption = {
  href: string
  title: string
  description: string
  footer: string
  icon: LucideIcon
  variant: CardVariant
}

type InfoItem = {
  title: string
  description: string
  icon: LucideIcon
}

const paths: PathOption[] = [
  {
    href: "/quick",
    title: "Quick flight",
    description: "One route, one answer. For when you know where you’re going.",
    footer: "Fast and simple",
    icon: Plane,
    variant: "cream",
  },
  {
    href: "/trip",
    title: "Full trip plan",
    description: "Several stops, dates and travellers. Where the biggest savings usually are.",
    footer: "Complete and detailed",
    icon: Route,
    variant: "dark",
  },
]

const steps: InfoItem[] = [
  {
    title: "Start with your destination",
    description: "Add a route, dates, and travellers—or begin with just the flight you have in mind.",
    icon: MapPin,
  },
  {
    title: "Explore your options",
    description: "Compare routes and connections, then look at the details that matter to your trip.",
    icon: Search,
  },
  {
    title: "Choose what works for you",
    description: "Weigh the time, price, and stops to find a plan that fits the way you want to travel.",
    icon: CheckCircle2,
  },
]

const benefits: InfoItem[] = [
  {
    title: "Start simple",
    description: "Check one flight when you want a quick answer, with no account needed to search.",
    icon: Plane,
  },
  {
    title: "Make room for every stop",
    description: "Plan a longer itinerary when your trip needs more than a single route.",
    icon: Route,
  },
  {
    title: "Keep the choice yours",
    description: "See practical alternatives and decide which trade-offs feel right for you.",
    icon: Compass,
  },
]

interface SectionHeadingProps {
  id: string
  eyebrow: string
  title: string
  description: string
  reduceMotion: boolean
}

function SectionHeading({ id, eyebrow, title, description, reduceMotion }: SectionHeadingProps) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
      className="max-w-2xl"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.045em] text-espresso sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
        {description}
      </p>
    </motion.div>
  )
}

export function TwoWaysIn() {
  const reduceMotion = Boolean(useReducedMotion())

  const staggerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reduceMotion ? 0 : 0.08,
        staggerChildren: reduceMotion ? 0 : 0.12,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.45,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="flex flex-1 flex-col">
      <section aria-labelledby="home-heading" className="pb-14 pt-12 sm:pb-20 sm:pt-16 lg:pt-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Travel hacking · Made simple
          </p>
          <h1
            id="home-heading"
            className="mt-4 text-5xl font-semibold leading-[0.98] tracking-[-0.065em] text-espresso sm:text-6xl lg:text-7xl"
          >
            A Una Milla
          </h1>
          <p className="mt-5 text-xl font-medium tracking-[-0.025em] text-espresso sm:text-2xl">
            Same trip. Much less money.
          </p>
          <p className="mt-2 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Find a smarter way to get there. Start with one flight or plan every stop along the way.
          </p>
        </motion.div>

        <h2 className="sr-only">Choose your path</h2>
        <motion.div
          variants={staggerVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          className="mt-10 grid grid-cols-1 items-stretch gap-4 md:mt-14 md:grid-cols-2 md:gap-6"
        >
          {paths.map((path, index) => {
            const Icon = path.icon

            return (
              <motion.div
                key={path.href}
                variants={itemVariants}
                whileHover={reduceMotion ? undefined : { y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="h-full rounded-3xl"
              >
                <Link
                  href={path.href}
                  aria-label={`${path.title}. ${path.description}`}
                  className="group block h-full rounded-3xl"
                >
                  <Card
                    variant={path.variant}
                    className="h-full min-h-[300px] justify-between transition-shadow duration-300 group-hover:shadow-xl sm:min-h-[330px]"
                  >
                    <CardHeader className="flex-row items-center justify-between p-6 pb-0 sm:p-8 sm:pb-0">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-current/45">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="grid size-12 place-items-center rounded-full border border-current/15 bg-primary/10 text-primary">
                        <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
                      </span>
                    </CardHeader>

                    <CardContent className="mt-10 px-6 pb-0 sm:px-8 sm:pb-0">
                      <CardTitle className="text-3xl leading-tight sm:text-4xl">
                        {path.title}
                      </CardTitle>
                      <CardDescription
                        className={cn(
                          "mt-3 max-w-md text-base leading-7 sm:text-lg",
                          path.variant === "dark" ? "text-white/70" : "text-espresso/75",
                        )}
                      >
                        {path.description}
                      </CardDescription>
                    </CardContent>

                    <CardFooter className="mt-auto justify-between border-t border-current/15 px-6 pb-6 pt-5 sm:px-8 sm:pb-8">
                      <span className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                        {path.footer}
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-5 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      <section
        aria-labelledby="how-it-works-heading"
        className="border-t border-border py-14 sm:py-20"
      >
        <SectionHeading
          id="how-it-works-heading"
          eyebrow="How it works"
          title="A clearer way to plan your route."
          description="Bring the trip you have in mind. We’ll help you explore the options, one decision at a time."
          reduceMotion={reduceMotion}
        />

        <motion.ol
          variants={staggerVariants}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-9 grid gap-4 md:grid-cols-3"
        >
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <motion.li key={step.title} variants={itemVariants}>
                <Card className="h-full gap-5 rounded-2xl border-border/80 bg-card p-5 shadow-none transition-shadow duration-300 hover:shadow-md sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold tracking-[0.12em] text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
                      <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg leading-snug">{step.title}</CardTitle>
                    <CardDescription className="mt-2 text-sm leading-6">
                      {step.description}
                    </CardDescription>
                  </div>
                </Card>
              </motion.li>
            )
          })}
        </motion.ol>
      </section>

      <section aria-labelledby="flexible-heading" className="py-3 sm:py-6">
        <div className="grid gap-8 rounded-3xl bg-secondary p-6 sm:p-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:p-12">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Made for real trips
            </p>
            <h2
              id="flexible-heading"
              className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.045em] text-espresso sm:text-4xl"
            >
              Travel planning that meets you where you are.
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Keep it quick when you know your destination. Add more detail when your journey has a few extra turns.
            </p>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="mt-6 min-h-11 transition-transform hover:-translate-y-0.5"
            >
              <Link href="/trip">
                Plan a full trip
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            variants={staggerVariants}
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon

              return (
                <motion.div
                  key={benefit.title}
                  variants={itemVariants}
                  className={cn(
                    "flex gap-4 py-5 first:pt-0 last:pb-0",
                    index > 0 && "border-t border-border/80",
                  )}
                >
                  <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full border border-border bg-background text-primary">
                    <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="font-semibold tracking-[-0.02em] text-espresso">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      <motion.section
        aria-labelledby="start-heading"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
        className="my-14 flex flex-col items-start gap-6 rounded-3xl bg-espresso p-6 text-white sm:my-20 sm:flex-row sm:items-center sm:justify-between sm:p-10"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Ready when you are
          </p>
          <h2
            id="start-heading"
            className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl"
          >
            Make your next route go further.
          </h2>
          <p className="mt-3 text-base leading-7 text-white/70">
            Start with a destination and see where a smarter route can take you.
          </p>
        </div>
        <Button
          asChild
          variant="primary"
          size="lg"
          className="min-h-12 shrink-0 transition-transform hover:-translate-y-0.5"
        >
          <Link href="/quick">
            Find a flight
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </motion.section>

      <footer className="mt-auto flex flex-col items-center justify-between gap-2 border-t border-border py-6 text-xs font-medium tracking-[0.08em] text-muted-foreground sm:flex-row">
        <span>@aunamilladetudestino</span>
        <span>Travel hacking · Made simple</span>
      </footer>
    </div>
  )
}
