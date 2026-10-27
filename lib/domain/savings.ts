import type { Provenance, SavingsResult } from "@/lib/domain/types"
import { percentSaving } from "@/lib/domain/money"
import chart from "@/data/avios-chart.json"

type Cabin = "economy" | "premium_economy" | "business" | "first"

export type ChartRow = {
  origin: string
  destination: string
  cabin: string
  program: string
  milesRequired: number
  taxesEur: number
}

export function lookupAviosChart(
  origin: string,
  destination: string,
  cabin: Cabin,
): ChartRow | null {
  const rows = chart.routes as ChartRow[]
  return (
    rows.find(
      row =>
        row.origin === origin.toUpperCase() &&
        row.destination === destination.toUpperCase() &&
        row.cabin === cabin,
    ) ?? null
  )
}

export function computeSavings(input: {
  cashEur: number
  origin: string
  destination: string
  cabin: Cabin
  provenanceCash: Provenance
  forcePayCash?: boolean
}): SavingsResult {
  const cashMinor = Math.round(input.cashEur * 100)
  const row = lookupAviosChart(input.origin, input.destination, input.cabin)

  const taxesMinor = row ? Math.round(row.taxesEur * 100) : cashMinor
  const milesRequired = row?.milesRequired ?? 0
  const program = row?.program ?? "Iberia Avios"
  const hackedMinor = input.forcePayCash || !row ? cashMinor : taxesMinor
  const savingsMinor = cashMinor - hackedMinor
  const verdict: SavingsResult["verdict"] =
    input.forcePayCash || savingsMinor <= 0 ? "pay_cash" : "use_miles"
  const percent = verdict === "pay_cash" ? 0 : percentSaving(cashMinor, Math.max(savingsMinor, 0))

  const headline =
    verdict === "pay_cash"
      ? "Paying cash is better on this trip."
      : `Same trip. €${(Math.max(savingsMinor, 0) / 100).toLocaleString("en-GB", { maximumFractionDigits: 0 })} less.`

  return {
    cashMinor,
    hackedMinor: verdict === "pay_cash" ? cashMinor : hackedMinor,
    savingsMinor: verdict === "pay_cash" ? 0 : Math.max(savingsMinor, 0),
    percent,
    verdict,
    headline,
    milesRequired,
    taxesMinor,
    program,
    provenanceCash: input.provenanceCash,
    provenanceHacked: "chart",
  }
}
