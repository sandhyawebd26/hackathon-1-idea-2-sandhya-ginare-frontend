"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Compass } from "lucide-react"
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
  { href: "/saved", label: "Saved trips" },
  { href: "/chat", label: "Assistant" },
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
  const pathname = usePathname() ?? "/"
  const shouldReduceMotion = Boolean(useReducedMotion())
  const { user, isLoading, setUser } = useAuthUser()

  useEffect(() => {
    if (!mobileOpen) return

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false)
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [mobileOpen])

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)
  }

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
    <header className="sticky top-0 z-40 -mx-4 border-b border-white/8 bg-background/85 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
      <div className="mx-auto flex h-[4.5rem] w-full items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="A Una Milla home"
          className="flex min-w-0 items-center gap-3 rounded-sm"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-brand-gold/30 bg-brand-indigo/40 text-brand-gold shadow-lg shadow-brand-indigo/20">
            <Compass aria-hidden="true" className="size-5" strokeWidth={1.7} />
          </span>
          <span className="flex min-w-0 flex-col gap-1">
            <span className="font-display text-lg font-semibold leading-none tracking-tight text-brand-paper">
              A Una Milla
            </span>
            <span className="hidden text-[9px] font-semibold uppercase leading-none tracking-[0.16em] text-muted-foreground sm:block">
              Same trip · smarter miles
            </span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {navigation.map(item => {
            const active = isActive(item.href)
            const isPrimary = item.href === "/quick"

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors",
                  isPrimary
                    ? "bg-primary px-4 text-primary-foreground shadow-sm shadow-brand-gold/10 hover:bg-primary/90"
                    : active
                      ? "bg-brand-indigo/40 text-brand-paper ring-1 ring-brand-indigo/70"
                      : "text-muted-foreground hover:bg-white/5 hover:text-brand-paper",
                )}
              >
                {item.label}
                {isPrimary && <ArrowUpRight aria-hidden="true" className="size-4" />}
              </Link>
            )
          })}
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

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.nav
            id="mobile-site-navigation"
            aria-label="Mobile navigation"
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/8 py-3 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {navigation.map(item => {
                const active = isActive(item.href)
                const isPrimary = item.href === "/quick"

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex min-h-11 items-center justify-between rounded-xl px-3 text-sm font-medium transition-colors",
                      isPrimary
                        ? "bg-primary text-primary-foreground"
                        : active
                          ? "bg-brand-indigo/40 text-brand-paper"
                          : "text-muted-foreground hover:bg-white/5 hover:text-brand-paper",
                    )}
                  >
                    {item.label}
                    {isPrimary && <ArrowUpRight aria-hidden="true" className="size-4" />}
                  </Link>
                )
              })}
            </div>
            <div className="mt-3 border-t border-white/8 pt-3">
              <SessionControls
                user={user}
                isLoading={isLoading}
                isSigningOut={isSigningOut}
                mobile
                onSignOut={handleSignOut}
              />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
