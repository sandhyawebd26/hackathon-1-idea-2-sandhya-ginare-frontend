"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { href: "/", label: "Home" },
  { href: "/quick", label: "Quick flight" },
  { href: "/trip", label: "Full trip" },
  { href: "/saved", label: "Saved" },
]

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

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

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-2 sm:flex"
        >
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

        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="size-11 shrink-0 sm:hidden"
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
          className="border-t border-border py-3 sm:hidden"
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
        </nav>
      )}
    </header>
  )
}
