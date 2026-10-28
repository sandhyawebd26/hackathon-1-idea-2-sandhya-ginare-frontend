"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function RouteProgress() {
  const pathname = usePathname()
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(true)
    const done = window.setTimeout(() => setActive(false), 500)
    return () => window.clearTimeout(done)
  }, [pathname])

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden bg-transparent transition-opacity duration-200",
        active ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        className={cn(
          "h-full w-1/3 bg-primary shadow-[0_0_8px_rgba(0,0,0,0.15)]",
          active && "animate-[route-progress_0.55s_ease-in-out_infinite]",
        )}
      />
    </div>
  )
}
