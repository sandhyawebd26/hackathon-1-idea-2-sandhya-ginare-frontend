import cardsData from "@/data/spain-cards.json"

export type SpainCard = {
  id: string
  name: string
  issuer: string
  monthlyFeeEur: number
  annualFeeEur: number
  earnRateDebit: number
  earnRateDebitLabel: string
  transferPartners: string[]
  transferRatio: string
  description: string
}

export function listSpainCards(): SpainCard[] {
  return cardsData.cards as SpainCard[]
}

export function catalogueMeta() {
  return {
    version: cardsData.updatedAt ?? "illustrative",
    note: "Illustrative card data for demo and MCP only.",
  }
}
