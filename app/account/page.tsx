import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { PageEnter } from "@/components/PageEnter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getServerUser } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"

export const metadata: Metadata = {
  title: "Account",
  description: "Your A Una Milla traveler account.",
}

export default async function AccountPage() {
  if (!isSupabaseConfigured) {
    return (
      <PageEnter className="mx-auto flex w-full max-w-lg flex-col gap-6 py-10 sm:py-14">
        <h1 className="text-3xl font-semibold text-espresso">Account</h1>
        <p className="text-muted-foreground">
          Sign-in is not configured in this environment. You can still search and compare trips as a guest.
        </p>
        <Button asChild variant="primary">
          <Link href="/">Back home</Link>
        </Button>
      </PageEnter>
    )
  }

  const user = await getServerUser()
  if (!user?.email) {
    redirect("/login?next=/account")
  }

  return (
    <PageEnter className="mx-auto flex w-full max-w-lg flex-col gap-8 py-10 sm:py-14">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Traveler account</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-espresso">Account</h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          Email sign-in only. We never store card numbers or passport details.
        </p>
      </header>

      <Card variant="cream">
        <CardHeader>
          <CardTitle>Signed in</CardTitle>
          <CardDescription>Use this email to sync saved trips when database sync is enabled.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="text-lg font-medium text-espresso">{user.email}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild variant="primary">
              <Link href="/saved">Saved trips</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Search another route</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageEnter>
  )
}
