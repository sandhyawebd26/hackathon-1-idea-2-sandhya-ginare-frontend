import cardsData from "@/data/spain-cards.json"

export type SpainCard = {
  id: string
  name: string
  issuer: string
  earnSummary: string
  transferNote: string
  illustrative: boolean
}

export function listSpainCards(): SpainCard[] {
  return cardsData.cards as SpainCard[]
}

export function catalogueMeta() {
  return {
    version: cardsData.version,
    note: cardsData.note,
  }
}
