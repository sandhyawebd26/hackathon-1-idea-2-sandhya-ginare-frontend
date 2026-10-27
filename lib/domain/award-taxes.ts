import taxes from "@/data/award-taxes.json"

type Cabin = "economy" | "premium_economy" | "business" | "first"

export function lookupAwardTaxesEur(
  origin: string,
  destination: string,
  cabin: Cabin,
): number {
  const key = `${origin.toUpperCase()}-${destination.toUpperCase()}`
  const routeTaxes = (taxes.routes as Record<string, Partial<Record<Cabin, number>>>)[key]
  const fromRoute = routeTaxes?.[cabin]
  if (typeof fromRoute === "number" && Number.isFinite(fromRoute)) {
    return fromRoute
  }

  const fallback = (taxes.defaultEur as Record<Cabin, number>)[cabin]
  return typeof fallback === "number" ? fallback : 98
}
