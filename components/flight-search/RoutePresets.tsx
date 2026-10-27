"use client"

import { Sparkles } from "lucide-react"
import type { CabinClass } from "@/lib/search-types"
import { cn } from "@/lib/utils"

export interface RoutePreset {
  id: string
  label: string
  origin: string
  destination: string
  originFlag: string
  destFlag: string
  cabin: CabinClass
  aviosRequired: string
  typicalSavings: string
  badge?: string
}

export const PRESET_ROUTES: RoutePreset[] = [
  {
    id: "mad-mia",
    label: "Madrid → Miami",
    origin: "MAD",
    destination: "MIA",
    originFlag: "🇪🇸",
    destFlag: "🇺🇸",
    cabin: "business",
    aviosRequired: "42.5k Avios",
    typicalSavings: "Save €1,850",
    badge: "Most Popular",
  },
  {
    id: "mad-jnb",
    label: "Madrid → Johannesburg",
    origin: "MAD",
    destination: "JNB",
    originFlag: "🇪🇸",
    destFlag: "🇿🇦",
    cabin: "business",
    aviosRequired: "85k Avios",
    typicalSavings: "Save €2,228",
    badge: "78% OFF",
  },
  {
    id: "bcn-jfk",
    label: "Barcelona → New York",
    origin: "BCN",
    destination: "JFK",
    originFlag: "🇪🇸",
    destFlag: "🇺🇸",
    cabin: "premium_economy",
    aviosRequired: "25k Avios",
    typicalSavings: "Save €620",
    badge: "Direct LEVEL",
  },
  {
    id: "mad-nrt",
    label: "Madrid → Tokyo",
    origin: "MAD",
    destination: "NRT",
    originFlag: "🇪🇸",
    destFlag: "🇯🇵",
    cabin: "business",
    aviosRequired: "70k Avios",
    typicalSavings: "Save €3,100",
    badge: "Bucket List",
  },
  {
    id: "mad-eze",
    label: "Madrid → Buenos Aires",
    origin: "MAD",
    destination: "EZE",
    originFlag: "🇪🇸",
    destFlag: "🇦🇷",
    cabin: "business",
    aviosRequired: "51k Avios",
    typicalSavings: "Save €2,400",
  },
]

interface RoutePresetsProps {
  onSelect: (preset: RoutePreset) => void
  currentOrigin?: string
  currentDestination?: string
}

export function RoutePresets({ onSelect, currentOrigin, currentDestination }: RoutePresetsProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Sparkles className="size-3.5 text-primary" />
        Popular Spanish Sweet Spots
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESET_ROUTES.map((preset) => {
          const isActive = currentOrigin === preset.origin && currentDestination === preset.destination

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelect(preset)}
              className={cn(
                "group flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs transition-all",
                isActive
                  ? "border-primary bg-primary/10 text-espresso shadow-sm"
                  : "border-border/70 bg-background/80 hover:border-primary/40 hover:bg-cream text-foreground"
              )}
            >
              <span className="flex items-center gap-1 font-semibold">
                <span>{preset.originFlag}</span>
                <span>{preset.origin}</span>
                <span className="text-muted-foreground">→</span>
                <span>{preset.destFlag}</span>
                <span>{preset.destination}</span>
              </span>

              <span className="rounded bg-secondary/80 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground group-hover:text-primary transition-colors">
                {preset.aviosRequired}
              </span>

              <span className="text-[11px] font-semibold text-primary">
                {preset.typicalSavings}
              </span>

              {preset.badge && (
                <span className="rounded-full bg-primary/20 px-1.5 py-0.2 text-[9px] font-bold text-primary">
                  {preset.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
