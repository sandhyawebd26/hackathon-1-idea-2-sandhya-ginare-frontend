import type { CashProvider, CashQuote, CashSearchInput } from "@/lib/providers/types"

const FIXTURE_CASH: Record<string, number> = {
  "MAD-JNB-business": 2840,
  "MAD-LHR-economy": 186,
}

export const fixtureCashProvider: CashProvider = {
  async search(input: CashSearchInput): Promise<CashQuote> {
    const key = `${input.origin}-${input.destination}-${input.cabin}`
    const amountEur = FIXTURE_CASH[key] ?? 980
    return {
      amountEur,
      provenance: "sample",
      note: "Illustrative cash fare from bundled sample data.",
      source: "fixture",
    }
  },
}
