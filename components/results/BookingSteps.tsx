import { ExternalLinkIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { SearchResponse } from "@/lib/search-types"

interface BookingStepsProps {
  steps: SearchResponse["bookingSteps"]
}

export function BookingSteps({ steps }: BookingStepsProps) {
  return (
    <section aria-labelledby="booking-steps-heading" className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Your next moves
        </p>
        <h2 id="booking-steps-heading" className="mt-2 text-2xl font-semibold tracking-tight text-espresso sm:text-3xl">
          How to book it
        </h2>
      </div>

      <ol className="grid gap-4 lg:grid-cols-3">
        {steps.map(step => (
          <li key={step.step} className="min-w-0">
            <Card variant="cream" className="h-full">
              <CardHeader>
                <span className="grid size-10 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-espresso" aria-label={`Step ${step.step}`}>
                  {String(step.step).padStart(2, "0")}
                </span>
                <CardTitle className="pt-2 text-lg leading-snug">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-sm leading-6 text-muted-foreground">
                  {step.body}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild variant="secondary" size="sm" className="min-h-11">
                    <a
                      href={step.href}
                      target={step.external ? "_blank" : undefined}
                      rel={step.external ? "noopener noreferrer" : undefined}
                    >
                      {step.href.includes("seatspy") ? "Check SeatSpy" : "Visit Iberia"}

                    <ExternalLinkIcon data-icon="inline-end" aria-hidden="true" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  )
}
