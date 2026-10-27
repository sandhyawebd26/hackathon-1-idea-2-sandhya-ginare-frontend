'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass } from 'lucide-react'

const footerLinks = [
  { href: '/quick', label: 'Quick flight' },
  { href: '/trip', label: 'Plan a trip' },
  { href: '/saved', label: 'Saved trips' },
  { href: '/chat', label: 'Travel assistant' },
]

export function SiteFooter() {
  const pathname = usePathname() ?? '/'

  if (pathname.startsWith('/chat') || pathname.startsWith('/share')) return null

  return (
    <footer className="-mx-4 mt-auto border-t border-white/8 bg-background/50 px-4 py-7 sm:-mx-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex w-fit items-center gap-3 rounded-md">
            <span className="grid size-10 place-items-center rounded-2xl border border-brand-gold/25 bg-brand-indigo/35 text-brand-gold">
              <Compass aria-hidden="true" className="size-5" strokeWidth={1.7} />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="font-display text-lg leading-none tracking-tight text-brand-paper">A Una Milla</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Same trip. Smarter miles.</span>
            </span>
          </Link>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2">
            {footerLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="min-h-11 rounded-sm py-3 text-sm text-muted-foreground transition-colors hover:text-brand-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/8 pt-4 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} A Una Milla</span>
          <span>All estimates are illustrative; confirm award availability and fees before booking.</span>
        </div>
      </div>
    </footer>
  )
}
