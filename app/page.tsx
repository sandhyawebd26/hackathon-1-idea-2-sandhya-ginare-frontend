import { PlaneTakeoff } from 'lucide-react'
import Link from 'next/link'

import { PageEnter } from '@/components/PageEnter'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export default function HomePage() {
  return (
    <PageEnter className="flex flex-1 flex-col">
      <section className="grid flex-1 items-center gap-12 py-14 sm:py-20 md:grid-cols-[1.05fr_0.95fr] md:gap-16 lg:py-24">
        <div className="max-w-[39rem]">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.17em] text-primary">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
            Travel, thoughtfully financed
          </p>

          <h1 className="mt-7 text-[clamp(3.5rem,8vw,6.5rem)] font-medium leading-[0.94] tracking-[-0.075em]">
            Go farther.
            <span className="block text-primary">Keep more.</span>
          </h1>

          <p className="mt-7 text-lg font-medium tracking-tight sm:text-xl">
            Same trip. Much less money.
          </p>
          <p className="mt-3 max-w-lg text-base leading-7 text-muted-foreground">
            We&apos;re building a smarter way to make every journey feel more within reach.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" variant="primary">
              <Link href="/quick">Explore quick flight</Link>
            </Button>
          </div>
        </div>

        <Card
          variant="dark"
          className="flex min-h-[360px] w-full flex-col justify-between gap-8 overflow-hidden rounded-[2rem] p-6 shadow-lg shadow-foreground/10 sm:min-h-[420px] sm:p-8 md:justify-self-end"
        >
          <CardHeader className="flex-row items-start justify-between gap-6 p-0">
            <div className="flex flex-col gap-3">
              <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.2em] text-background/55">
                A UNA MILLA / 001
              </CardDescription>
              <CardTitle className="text-sm font-semibold text-background">
                The travel-fintech idea
              </CardTitle>
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-background/20 bg-background/5 text-primary">
              <PlaneTakeoff aria-hidden="true" className="size-5" strokeWidth={1.7} />
            </span>
          </CardHeader>

          <CardContent className="p-0">
            <p className="max-w-xs text-3xl font-medium leading-[1.08] tracking-[-0.04em] sm:text-4xl">
              More of the world. Less of the cost.
            </p>
          </CardContent>

          <CardFooter className="mt-auto flex-col items-stretch gap-4 p-0">
            <span aria-hidden="true" className="h-px w-full bg-background/15" />
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-background/45">
              <span>Travel, better considered</span>
              <span>01 / 01</span>
            </div>
          </CardFooter>
        </Card>
      </section>
    </PageEnter>
  )
}
