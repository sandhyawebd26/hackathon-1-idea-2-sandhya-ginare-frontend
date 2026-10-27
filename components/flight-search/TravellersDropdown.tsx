"use client"

import { useState, useRef, useEffect } from "react"
import { Users, ChevronDown, Plus, Minus, UserCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface TravellersDropdownProps {
  adults: number
  onChange: (count: number) => void
}

export function TravellersDropdown({ adults, onChange }: TravellersDropdownProps) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <div className="relative flex flex-col gap-1.5" ref={dropdownRef}>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Users className="size-3.5 text-primary" />
        Travellers
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-2xl border bg-background px-3.5 text-left transition-all",
          "hover:border-primary/50 hover:bg-cream/40 focus:outline-none focus:ring-2 focus:ring-primary/20",
          open && "border-primary ring-2 ring-primary/20 bg-cream/30",
          "border-border"
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserCheck className="size-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm font-semibold text-espresso">
              {adults} {adults === 1 ? "Adult" : "Adults"}
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              Age 12+ · standard award seats
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-foreground">
            {adults}
          </span>
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              open && "rotate-180 text-primary"
            )}
          />
        </div>
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-2xl border border-border/80 bg-background/98 p-4 shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-espresso">Adult Passengers</span>
              <span className="text-xs text-muted-foreground">Ages 12 and older</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={adults <= 1}
                onClick={() => onChange(Math.max(1, adults - 1))}
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-secondary text-foreground hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease passenger count"
              >
                <Minus className="size-3.5" />
              </button>

              <span className="w-5 text-center font-bold text-espresso text-sm tabular-nums">
                {adults}
              </span>

              <button
                type="button"
                disabled={adults >= 4}
                onClick={() => onChange(Math.min(4, adults + 1))}
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase passenger count"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-cream/70 p-2.5 border border-border/50 text-[11px] text-muted-foreground leading-relaxed">
            💡 Award flights allow up to 4 passengers on a single booking reference with Iberia Plus and British Airways.
          </div>
        </div>
      )}
    </div>
  )
}
