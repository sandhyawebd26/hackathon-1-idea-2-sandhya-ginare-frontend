import type { CashProvider, CashQuote, CashSearchInput } from "@/lib/providers/types"

const FIXTURE_CASH: Record<string, number> = {
  "MAD-JNB-business": 2840,
  "MAD-JNB-economy": 890,
  "MAD-MIA-business": 2950,
  "MAD-MIA-premium_economy": 1420,
  "MAD-MIA-economy": 680,
  "MAD-JFK-business": 2850,
  "MAD-JFK-economy": 650,
  "BCN-JFK-business": 2750,
  "BCN-JFK-premium_economy": 1350,
  "BCN-JFK-economy": 590,
  "MAD-EZE-business": 3200,
  "MAD-EZE-economy": 950,
  "MAD-BOG-business": 2650,
  "MAD-MEX-business": 2900,
  "MAD-NRT-business": 3600,
  "MAD-NRT-economy": 1100,
  "MAD-DOH-business": 2100,
  "MAD-LHR-business": 420,
  "MAD-LHR-economy": 186,
  "BCN-LHR-economy": 175,
}

export const fixtureCashProvider: CashProvider = {
  async search(input: CashSearchInput): Promise<CashQuote> {
    const key = `${input.origin}-${input.destination}-${input.cabin}`
    const amountEur = FIXTURE_CASH[key] ?? (input.cabin === "business" ? 2400 : 750)
    return {
      amountEur,
      provenance: "sample",
      note: "Illustrative cash fare from bundled sample data.",
      source: "fixture",
    }
  },
}
