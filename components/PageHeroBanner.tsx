import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PageHeroBannerProps = {
  badge: string
  title: ReactNode
  description?: string
  children?: ReactNode
  className?: string
}

export function PageHeroBanner({
  badge,
  title,
  description,
  children,
  className,
}: PageHeroBannerProps) {
  return (
    <section
      className={cn(
        "relative -mx-4 overflow-hidden rounded-[2rem] border border-border/60 sm:-mx-6",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[#F9F6F1]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-[#F9F6F1]/90 to-[#E8DED3]/80"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 top-8 size-72 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 size-80 rounded-full bg-espresso/5 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C07848' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 px-4 py-10 sm:px-10 sm:py-12 md:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm backdrop-blur-sm">
            <span className="flex size-2 rounded-full bg-primary" aria-hidden />
            {badge}
          </div>
          <div className="mt-5 max-w-2xl text-left">{title}</div>
          {description ? (
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  )
}
