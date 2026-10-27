import type { Provenance } from "@/lib/domain/types"

export type CashQuote = {
  amountEur: number
  provenance: Provenance
  note: string
  source: "fixture" | "duffel_test" | "scrappa"
}

export type CashSearchInput = {
  origin: string
  destination: string
  departureDate: string
  cabin: "economy" | "premium_economy" | "business" | "first"
  adults: number
}

export type CashProvider = {
  search(input: CashSearchInput): Promise<CashQuote | null>
}
