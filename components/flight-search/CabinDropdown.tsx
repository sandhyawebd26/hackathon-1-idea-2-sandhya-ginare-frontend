"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check, Sparkles, Bed, Armchair } from "lucide-react"
import type { CabinClass } from "@/lib/search-types"
import { cn } from "@/lib/utils"

interface CabinOption {
  value: CabinClass
  label: string
  subtitle: string
  badge?: string
  icon: typeof Armchair
}

const CABIN_OPTIONS: CabinOption[] = [
  {
    value: "economy",
    label: "Economy Class",
    subtitle: "Standard seating · Lowest Avios required",
    icon: Armchair,
  },
  {
    value: "premium_economy",
    label: "Premium Economy",
    subtitle: "Wide recliners, priority boarding & 2 checked bags",
    badge: "2x Space",
    icon: Armchair,
  },
  {
    value: "business",
    label: "Business Class",
    subtitle: "180° Lie-flat suites, lounge access & champagne",
    badge: "Max Value (€/Avios)",
    icon: Bed,
  },
  {
    value: "first",
    label: "First Class Suites",
    subtitle: "Private cabins, caviar service & concierge",
    badge: "Ultra Luxury",
    icon: Sparkles,
  },
]

interface CabinDropdownProps {
  value: CabinClass
  onChange: (value: CabinClass) => void
}

export function CabinDropdown({ value, onChange }: CabinDropdownProps) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selected = CABIN_OPTIONS.find(o => o.value === value) || CABIN_OPTIONS[2]
  const Icon = selected.icon

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
        <Icon className="size-3.5 text-primary" />
        Cabin Class
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-2xl border bg-background px-3.5 text-left transition-all",
          "hover:border-primary/50 hover:bg-cream/40 focus:outline-none focus:ring-2 focus:ring-primary/20",
          open && "border-primary ring-2 ring-primary/20 bg-cream/30",
          "border-border"
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm font-semibold text-espresso">
              {selected.label}
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              {selected.subtitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {selected.badge && (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {selected.badge}
            </span>
          )}
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              open && "rotate-180 text-primary"
            )}
          />
        </div>
      </button>

      {/* Popover Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-2xl border border-border/80 bg-background/98 p-2 shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="space-y-1">
            {CABIN_OPTIONS.map((option) => {
              const isSelected = option.value === value
              const OptionIcon = option.icon

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl p-2.5 text-left transition-colors",
                    isSelected
                      ? "bg-primary/15 text-espresso font-semibold"
                      : "hover:bg-cream text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    )}>
                      <OptionIcon className="size-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-espresso">
                          {option.label}
                        </span>
                        {option.badge && (
                          <span className="rounded-full bg-primary/15 px-2 py-0.2 text-[10px] font-bold text-primary">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground truncate">
                        {option.subtitle}
                      </span>
                    </div>
                  </div>

                  {isSelected && <Check className="size-4 text-primary shrink-0 ml-2" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
