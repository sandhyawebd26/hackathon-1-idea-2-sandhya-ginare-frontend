import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 -mx-4 border-b border-border bg-background/95 px-4 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="mx-auto flex h-16 w-full items-center justify-between">
        <Link
          href="/"
          aria-label="A Una Milla home"
          className="flex min-w-0 flex-col gap-1 rounded-sm"
        >
          <span className="text-[9px] font-semibold uppercase leading-none tracking-[0.19em] text-primary">
            HACKATHON 1 · A UNA MILLA
          </span>
          <span className="text-[18px] font-semibold leading-none tracking-[-0.045em]">
            A Una Milla
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-2 sm:flex">
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/quick"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Quick flight
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </nav>
      </div>
    </header>
  )
}
