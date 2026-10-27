import type { SearchLeg } from "@/lib/search-types"

export function routeSummary(legs: SearchLeg[]) {
  return legs.map(leg => `${leg.origin} → ${leg.destination}`).join(" · ")
}

export function formatEuro(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatTravelDate(value: string) {
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}
