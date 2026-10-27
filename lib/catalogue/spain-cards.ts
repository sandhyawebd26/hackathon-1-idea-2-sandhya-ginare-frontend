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

type LegacySpainCardRow = {
  id: string
  name: string
  issuer: string
  earnSummary?: string
  transferNote?: string
  illustrative?: boolean
}

type RichSpainCardRow = SpainCard

function isRichCard(row: LegacySpainCardRow | RichSpainCardRow): row is RichSpainCardRow {
  return typeof (row as RichSpainCardRow).earnRateDebit === "number"
}

function normalizeCard(row: LegacySpainCardRow | RichSpainCardRow): SpainCard {
  if (isRichCard(row)) {
    return row
  }

  const earnSummary = row.earnSummary ?? "Illustrative earn rate. Verify with issuer."
  const transferNote = row.transferNote ?? "Transfer partners vary. Confirm before moving points."

  return {
    id: row.id,
    name: row.name,
    issuer: row.issuer,
    monthlyFeeEur: 0,
    annualFeeEur: 0,
    earnRateDebit: 0.25,
    earnRateDebitLabel: earnSummary,
    transferPartners: ["Iberia Plus", "British Airways", "Qatar Airways"],
    transferRatio: "1:1",
    description: transferNote,
  }
}

export function listSpainCards(): SpainCard[] {
  const rows = cardsData.cards as Array<LegacySpainCardRow | RichSpainCardRow>
  return rows.map(normalizeCard)
}

export function catalogueMeta() {
  return {
    version: cardsData.updatedAt ?? "illustrative",
    note: "Illustrative card data for demo and MCP only.",
  }
}
