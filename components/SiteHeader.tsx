"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { clearDemoAuthUser, type AuthUser } from "@/lib/auth-client"
import { createClient } from "@/lib/supabase/client"
import { useAuthUser } from "@/lib/use-auth-user"
import { cn } from "@/lib/utils"

const navigation = [
  { href: "/", label: "Home" },
  { href: "/quick", label: "Quick flight" },
  { href: "/trip", label: "Full trip" },
  { href: "/saved", label: "Saved" },
]

interface SessionControlsProps {
  user: AuthUser | null
  isLoading: boolean
  isSigningOut: boolean
  mobile?: boolean
  onSignOut: () => void
}

function SessionControls({ user, isLoading, isSigningOut, mobile = false, onSignOut }: SessionControlsProps) {
  if (isLoading) {
    return <span className="sr-only" aria-live="polite">Checking account status</span>
  }

  if (!user) {
    return (
      <div className={cn("flex items-center gap-2", mobile && "w-full")}>
        <Button asChild variant="outline" size="sm" className={cn("min-h-11 rounded-full px-4", mobile && "flex-1")}>
          <Link href="/login">Log in</Link>
        </Button>
        <Button asChild variant="primary" size="sm" className={cn("min-h-11 px-4", mobile && "flex-1")}>
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("flex min-w-0 items-center gap-2", mobile && "w-full justify-between")}>
      <div className="flex min-w-0 items-center gap-2">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold uppercase text-espresso"
        >
          {user.email.slice(0, 1)}
        </span>
        <span className="max-w-32 truncate text-sm font-medium text-foreground" title={user.email}>
          {user.email}
        </span>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="min-h-11 shrink-0 rounded-full px-4"
        disabled={isSigningOut}
        onClick={onSignOut}
      >
        {isSigningOut ? "Signing out…" : "Sign out"}
      </Button>
    </div>
  )
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { user, isLoading, setUser } = useAuthUser()

  async function handleSignOut() {
    setIsSigningOut(true)

    try {
      const supabase = createClient()
      if (supabase) {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
      } else {
        clearDemoAuthUser()
      }

      await setUser(null)
      setMobileOpen(false)
      toast.success("Signed out")
    } catch {
      toast.error("Could not sign out. Please try again.")
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 -mx-4 border-b border-border bg-background/95 px-4 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="A Una Milla home"
          className="flex min-w-0 flex-col gap-1 rounded-sm"
        >
          <span className="text-[9px] font-semibold uppercase leading-none tracking-[0.19em] text-primary">
            Travel hacking · Made simple
          </span>
          <span className="text-[18px] font-semibold leading-none tracking-[-0.045em]">
            A Una Milla
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {navigation.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                item.label === "Quick flight"
                  ? "inline-flex items-center gap-2 bg-foreground px-4 text-background hover:bg-foreground/90"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {item.label}
              {item.label === "Quick flight" && (
                <ArrowUpRight aria-hidden="true" className="size-4" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 md:block">
          <SessionControls
            user={user}
            isLoading={isLoading}
            isSigningOut={isSigningOut}
            onSignOut={handleSignOut}
          />
        </div>

        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="size-11 shrink-0 md:hidden"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-site-navigation"
          onClick={() => setMobileOpen(open => !open)}
        >
          {mobileOpen ? (
            <Cross2Icon data-icon="inline-start" aria-hidden="true" />
          ) : (
            <HamburgerMenuIcon data-icon="inline-start" aria-hidden="true" />
          )}
        </Button>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-site-navigation"
          aria-label="Mobile navigation"
          className="border-t border-border py-3 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {navigation.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex min-h-11 items-center justify-between rounded-xl px-3 text-sm font-medium transition-colors",
                  item.label === "Quick flight"
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {item.label}
                {item.label === "Quick flight" && (
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                )}
              </Link>
            ))}
          </div>
          <div className="mt-3 border-t border-border pt-3">
            <SessionControls
              user={user}
              isLoading={isLoading}
              isSigningOut={isSigningOut}
              mobile
              onSignOut={handleSignOut}
            />
          </div>
        </nav>
      )}
    </header>
  )
}
