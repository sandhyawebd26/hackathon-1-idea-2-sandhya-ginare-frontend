import Link from "next/link"

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

interface SavedTripsGateProps {
  className?: string
}

export function SavedTripsGate({ className }: SavedTripsGateProps) {
  return (
    <Card variant="cream" className={cn("w-full border-border/80", className)}>
      <CardHeader className="gap-3 pr-14">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Your travel notebook
        </p>
        <CardTitle className="text-2xl leading-tight tracking-[-0.035em] text-espresso">
          Sign in to save trips across devices
        </CardTitle>
        <CardDescription className="text-base leading-7">
          Create an account to keep the routes and comparisons you want to revisit.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="primary" size="lg" className="min-h-11 w-full">
          <Link href="/login?next=/saved">Log in</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="min-h-11 w-full">
          <Link href="/signup?next=/saved">Sign up</Link>
        </Button>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">You can search without an account.</p>
      </CardFooter>
    </Card>
  )
}
