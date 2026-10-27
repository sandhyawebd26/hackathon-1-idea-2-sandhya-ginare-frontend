export type EarningPlanInput = {
  targetMiles: number
  currentBalance: number
  monthlySpendEur: number
  earnRatePerEur: number
}

export type EarningPlanResult = {
  gapMiles: number
  monthlyEarned: number
  monthsNeeded: number
  targetDateLabel: string
}

export function computeEarningPlan(input: EarningPlanInput): EarningPlanResult {
  const gapMiles = Math.max(0, input.targetMiles - input.currentBalance)
  const monthlyEarned = Math.max(1, Math.round(input.monthlySpendEur * input.earnRatePerEur))
  const monthsNeeded = gapMiles <= 0 ? 0 : Math.ceil(gapMiles / monthlyEarned)

  const targetDate = new Date()
  targetDate.setMonth(targetDate.getMonth() + monthsNeeded)
  const targetDateLabel = targetDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })

  return {
    gapMiles,
    monthlyEarned,
    monthsNeeded,
    targetDateLabel,
  }
}

export interface SpainCardOption {
  id: string
  name: string
  issuer: string
  earnRatePerEur: number
  monthlyFeeEur: number
  program: string
  welcomeBonusMiles: number
}

export function formatMonthlyFee(feeEur: number): string {
  if (feeEur <= 0) return "Free (€0)"
  return `€${feeEur}/mo`
}

export function cardFeeLabel(card: any): string {
  if (!card) return ""
  if (typeof card.monthlyFeeEur === "number" && card.monthlyFeeEur <= 0) {
    return "Free (€0)"
  }
  return card.monthlyFeeEur ? `€${card.monthlyFeeEur}/mo` : "Free"
}

export function cardPartnerSummary(card: any): string {
  if (!card) return ""
  const partners = Array.isArray(card.transferPartners)
    ? card.transferPartners.join(", ")
    : "Iberia Plus, British Airways Club, Qatar Privilege"
  return `${card.issuer ?? "Spanish Bank"} · Transfers to ${partners}`
}
