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

export const metadata = {
  title: 'Quick flight'
}

export default function QuickFlightPage() {
  return (
    <PageEnter className="flex flex-1">
      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-16 sm:py-24">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          Quick flight / 001
        </p>
        <h1 className="mt-5 max-w-xl text-4xl font-medium leading-tight tracking-[-0.06em] sm:text-5xl">
          A simpler way to take off.
        </h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
          We&apos;re preparing a more thoughtful place to plan your next trip.
        </p>

        <Card variant="cream" className="mt-9 rounded-3xl">
          <CardHeader>
            <CardDescription className="font-semibold uppercase tracking-[0.16em] text-primary">
              Coming soon
            </CardDescription>
            <CardTitle>Quick flight search</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              Flight search will take shape here.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="secondary">
              <Link href="/">Back home</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </PageEnter>
  )
}
