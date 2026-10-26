"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Plane, Route, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type CardVariant = "cream" | "dark"

type PathOption = {
  href: string
  title: string
  description: string
  footer: string
  icon: LucideIcon
  variant: CardVariant
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

export function TwoWaysIn() {
  const shouldReduceMotion = Boolean(useReducedMotion())

  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: shouldReduceMotion ? 0 : 0.08,
        staggerChildren: shouldReduceMotion ? 0 : 0.14,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="flex flex-1 flex-col">
      <section className="flex flex-1 flex-col py-12 sm:py-16 lg:py-20">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.065em] text-espresso sm:text-6xl lg:text-7xl">
            A Una Milla
          </h1>
          <p className="mt-5 text-xl font-medium tracking-[-0.025em] text-espresso sm:text-2xl">
            Same trip. Much less money.
          </p>
          <p className="mt-2 text-base leading-7 text-muted-foreground sm:text-lg">
            Travel hacking, made simple.
          </p>
        </motion.div>

        <h2 className="sr-only">Choose your path</h2>
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          className="mt-10 grid flex-1 grid-cols-1 items-stretch gap-4 md:mt-14 md:grid-cols-2 md:gap-6"
        >
          {paths.map((path, index) => {
            const Icon = path.icon

            return (
              <motion.div
                key={path.href}
                variants={cardVariants}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -5,
                        boxShadow: "0 22px 50px rgba(35, 27, 21, 0.14)",
                      }
                }
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
                    className="h-full min-h-[300px] justify-between sm:min-h-[330px]"
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
                          path.variant === "dark"
                            ? "text-white/70"
                            : "text-espresso/75",
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

        <footer className="mt-auto flex justify-center border-t border-border pt-6 text-xs font-medium tracking-[0.08em] text-muted-foreground sm:pt-8">
          @aunamilladetudestino
        </footer>
      </section>
    </div>
  )
}
