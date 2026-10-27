import { serverEnv } from "@/lib/server/env"
import { duffelCashProvider } from "@/lib/providers/duffel-cash"
import { fixtureCashProvider } from "@/lib/providers/fixture-cash"
import type { CashQuote, CashSearchInput } from "@/lib/providers/types"
import type { CashProviderStatus } from "@/lib/search-types"

export type CashSearchResult = {
  quote: CashQuote
  cashStatus: CashProviderStatus
}

export async function searchCashFare(input: CashSearchInput): Promise<CashQuote> {
  const { quote } = await searchCashFareWithStatus(input)
  return quote
}

export async function searchCashFareWithStatus(
  input: CashSearchInput,
): Promise<CashSearchResult> {
  const mode = serverEnv().providerMode

  if (mode === "duffel_test") {
    const live = await duffelCashProvider.search(input)
    if (live) {
      return { quote: live, cashStatus: "ok" }
    }

    const fixture = await fixtureCashProvider.search(input)
    return { quote: fixture, cashStatus: "fixture_fallback" }
  }

  return { quote: await fixtureCashProvider.search(input), cashStatus: "ok" }
}
