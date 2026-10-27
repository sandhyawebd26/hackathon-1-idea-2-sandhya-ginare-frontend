"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search, Check, PlaneTakeoff, PlaneLanding } from "lucide-react"
import { AIRPORTS, SPANISH_HUBS, POPULAR_DESTINATIONS, getAirport, searchAirports, type Airport } from "@/lib/airports"
import { cn } from "@/lib/utils"

interface AirportDropdownProps {
  id: string
  label: string
  value: string
  type: "origin" | "destination"
  error?: string
  onChange: (code: string) => void
}

export function AirportDropdown({
  id,
  label,
  value,
  type,
  error,
  onChange,
}: AirportDropdownProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "spain" | "popular">(type === "origin" ? "spain" : "popular")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const selectedAirport = getAirport(value) || {
    code: value || "???",
    city: value ? `Airport (${value})` : "Select Airport",
    name: "",
    country: "",
    flag: "✈️",
    region: "europe" as const,
  }

  // Filter airports based on search and active tab
  const filteredAirports = search
    ? searchAirports(search)
    : activeTab === "spain"
    ? SPANISH_HUBS
    : activeTab === "popular"
    ? POPULAR_DESTINATIONS
    : AIRPORTS

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  function handleSelect(code: string) {
    onChange(code)
    setOpen(false)
    setSearch("")
  }

  const Icon = type === "origin" ? PlaneTakeoff : PlaneLanding

  return (
    <div className="relative flex flex-col gap-1.5" ref={dropdownRef}>
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Icon className="size-3.5 text-primary" />
        {label}
      </label>

      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-2xl border bg-background px-3.5 text-left transition-all",
          "hover:border-primary/50 hover:bg-cream/40 focus:outline-none focus:ring-2 focus:ring-primary/20",
          open && "border-primary ring-2 ring-primary/20 bg-cream/30",
          error ? "border-destructive ring-1 ring-destructive/30" : "border-border"
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl shrink-0" aria-hidden="true">
            {selectedAirport.flag}
          </span>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm font-semibold text-espresso">
              {selectedAirport.city}
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              {selectedAirport.name || "Select route hub"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary font-mono tracking-wider">
            {selectedAirport.code}
          </span>
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              open && "rotate-180 text-primary"
            )}
          />
        </div>
      </button>

      {error && <p className="text-xs font-medium text-destructive mt-0.5">{error}</p>}

      {/* Dynamic Popover Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-2xl border border-border/80 bg-background/98 p-2 shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Search Bar inside Dropdown */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              placeholder="Search by city, airport, or IATA code..."
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl bg-secondary/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Quick Category Segment Filters */}
          {!search && (
            <div className="flex items-center gap-1 mb-2 border-b border-border/60 pb-2 px-1">
              <button
                type="button"
                onClick={() => setActiveTab("spain")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                  activeTab === "spain"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                🇪🇸 Spain Hubs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("popular")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                  activeTab === "popular"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                ✈️ Popular
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                  activeTab === "all"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                All Airports
              </button>
            </div>
          )}

          {/* Airport List */}
          <div className="max-h-60 overflow-y-auto space-y-0.5 pr-1 [scrollbar-width:thin]">
            {filteredAirports.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No airports found matching &ldquo;{search}&rdquo;
              </div>
            ) : (
              filteredAirports.map((airport) => {
                const isSelected = airport.code === value
                return (
                  <button
                    key={airport.code}
                    type="button"
                    onClick={() => handleSelect(airport.code)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition-colors",
                      isSelected
                        ? "bg-primary/15 text-espresso font-semibold"
                        : "hover:bg-cream text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{airport.flag}</span>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-espresso truncate text-sm">
                            {airport.city}
                          </span>
                          {airport.isHub && (
                            <span className="rounded bg-primary/20 px-1.5 py-0.2 text-[9px] font-bold text-primary">
                              HUB
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground truncate">
                          {airport.name} · {airport.country}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold text-primary bg-secondary/80 px-1.5 py-0.5 rounded text-xs">
                        {airport.code}
                      </span>
                      {isSelected && <Check className="size-4 text-primary shrink-0" />}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
