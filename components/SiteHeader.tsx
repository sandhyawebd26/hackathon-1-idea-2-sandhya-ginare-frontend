"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Sparkles } from "lucide-react"
import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { type AuthUser } from "@/lib/auth-client"
import { createClient } from "@/lib/supabase/client"
import { useAuthUser } from "@/lib/use-auth-user"
import { cn } from "@/lib/utils"

type NavItem = {
  href: string
  label: string
  highlight?: boolean
  compact?: "xl"
}

const navigation: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/quick", label: "Quick flight" },
  { href: "/trip", label: "Full trip", compact: "xl" as const },
  { href: "/plan", label: "Plan & earn", compact: "xl" as const },
  { href: "/chat", label: "AI Assistant", highlight: true },
  { href: "/pricing", label: "Plans", compact: "xl" as const },
  { href: "/feasibility", label: "API & Partners", compact: "xl" as const },
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
        <Button asChild variant="outline" size="sm" className={cn("min-h-10 rounded-full px-3.5 text-xs font-medium", mobile && "flex-1")}>
          <Link href="/login">Log in</Link>
        </Button>
        <Button asChild variant="primary" size="sm" className={cn("min-h-10 px-3.5 text-xs font-medium", mobile && "flex-1")}>
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    )
  }

  const initial = (user.email ? user.email.slice(0, 1) : "U").toUpperCase()

  return (
    <div className={cn("flex min-w-0 items-center gap-2", mobile && "w-full justify-between")}>
      <Link
        href="/account"
        title={`Account: ${user.email}`}
        aria-label={`Account settings for ${user.email}`}
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold uppercase text-espresso transition-all hover:bg-primary/30 hover:ring-2 hover:ring-primary/40"
      >
        <span>{initial}</span>
      </Link>

      {mobile && (
        <div className="flex min-w-0 flex-1 flex-col px-2">
          <span className="truncate text-xs font-medium text-foreground">{user.email}</span>
          <span className="text-[10px] text-muted-foreground">Logged in</span>
        </div>
      )}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-9 shrink-0 rounded-full px-3 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
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
      if (!supabase) throw new Error("Authentication is not configured")

      const { error } = await supabase.auth.signOut()
      if (error) throw error

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
      <div className="mx-auto flex min-h-16 w-full flex-wrap items-center justify-between gap-x-3 gap-y-2 py-2 lg:h-16 lg:flex-nowrap lg:py-0">
        <Link
          href="/"
          aria-label="A Una Milla home"
          className="flex min-w-0 shrink-0 flex-col gap-0.5 rounded-sm lg:max-w-[9rem]"
        >
          <span className="hidden text-[9px] font-semibold uppercase leading-none tracking-[0.19em] text-primary sm:block">
            Travel hacking · Made simple
          </span>
          <span className="text-base font-semibold leading-none tracking-[-0.045em] sm:text-[18px]">
            A Una Milla
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="order-3 flex w-full min-w-0 items-center gap-0.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] md:order-none md:w-auto md:flex-1 md:justify-center lg:gap-1 [&::-webkit-scrollbar]:hidden"
        >
          {navigation.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:py-2 sm:text-sm",
                item.compact === "xl" && "hidden xl:inline-flex",
                item.label === "Quick flight"
                  ? "inline-flex items-center gap-1.5 bg-foreground px-3 text-background hover:bg-foreground/90 sm:px-4"
                  : item.label === "AI Assistant"
                    ? "inline-flex items-center gap-1.5 bg-primary/10 text-primary hover:bg-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {item.label === "AI Assistant" && (
                <Sparkles aria-hidden="true" className="size-3.5 text-primary" />
              )}
              {item.label}
              {item.label === "Quick flight" && (
                <ArrowUpRight aria-hidden="true" className="size-4" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 lg:block">
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
          className="size-11 shrink-0 lg:hidden"
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
          className="border-t border-border py-3 lg:hidden"
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
