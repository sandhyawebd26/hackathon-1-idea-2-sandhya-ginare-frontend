import type { Provenance, SavingsResult } from "@/lib/domain/types"
import { lookupAwardTaxesEur } from "@/lib/domain/award-taxes"
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
  const from = origin.toUpperCase()
  const to = destination.toUpperCase()
  if (from === to) return null

  return (
    rows.find(row => row.origin === from && row.destination === to && row.cabin === cabin) ??
    rows.find(row => row.origin === to && row.destination === from && row.cabin === cabin) ??
    null
  )
}

export type AwardLeg = { origin: string; destination: string }

function aggregateChartAward(
  legs: AwardLeg[] | undefined,
  fallbackOrigin: string,
  fallbackDestination: string,
  cabin: Cabin,
): {
  hasChart: boolean
  milesRequired: number
  taxesMinor: number
  program: string
} {
  const segments =
    legs?.filter(leg => leg.origin.toUpperCase() !== leg.destination.toUpperCase()) ?? []
  const pairs =
    segments.length > 0
      ? segments
      : [{ origin: fallbackOrigin, destination: fallbackDestination }]

  let milesRequired = 0
  let taxesMinor = 0
  let program = "Iberia Avios"
  let hasChart = false

  for (const leg of pairs) {
    const row = lookupAviosChart(leg.origin, leg.destination, cabin)
    if (!row) continue
    hasChart = true
    milesRequired += row.milesRequired
    taxesMinor += Math.round(
      lookupAwardTaxesEur(leg.origin, leg.destination, cabin) * 100,
    )
    program = row.program
  }

  return { hasChart, milesRequired, taxesMinor, program }
}

export function computeSavings(input: {
  cashEur: number
  origin: string
  destination: string
  cabin: Cabin
  legs?: AwardLeg[]
  provenanceCash: Provenance
  forcePayCash?: boolean
}): SavingsResult {
  const cashMinor = Math.round(input.cashEur * 100)
  const award = aggregateChartAward(
    input.legs,
    input.origin,
    input.destination,
    input.cabin,
  )

  const taxesMinor = award.hasChart ? award.taxesMinor : cashMinor
  const milesRequired = award.milesRequired
  const program = award.program
  const hackedMinor =
    input.forcePayCash || !award.hasChart ? cashMinor : taxesMinor
  const savingsMinor = cashMinor - hackedMinor
  const verdict: SavingsResult["verdict"] =
    input.forcePayCash || !award.hasChart || savingsMinor <= 0 ? "pay_cash" : "use_miles"
  const percent = verdict === "pay_cash" ? 0 : percentSaving(cashMinor, Math.max(savingsMinor, 0))

  const headline =
    verdict === "pay_cash"
      ? "Paying cash is better on this trip."
      : `Same trip. €${(Math.max(savingsMinor, 0) / 100).toLocaleString("en-GB", { maximumFractionDigits: 0 })} less.`

  return {
    cashMinor,
    hackedMinor: input.forcePayCash ? cashMinor : hackedMinor,
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
