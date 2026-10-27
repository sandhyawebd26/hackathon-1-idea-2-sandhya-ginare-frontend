import { serverEnv } from "@/lib/server/env"
import { duffelCashProvider } from "@/lib/providers/duffel-cash"
import { fixtureCashProvider } from "@/lib/providers/fixture-cash"
import type { CashQuote, CashSearchInput } from "@/lib/providers/types"

export async function searchCashFare(input: CashSearchInput): Promise<CashQuote> {
  const mode = serverEnv().providerMode

  if (mode === "duffel_test") {
    const live = await duffelCashProvider.search(input)
    if (live) {
      return live
    }
  }

  const fixture = await fixtureCashProvider.search(input)
  if (!fixture) {
    throw new Error("Fixture cash quote is required as a fallback.")
  }
  return fixture
}
