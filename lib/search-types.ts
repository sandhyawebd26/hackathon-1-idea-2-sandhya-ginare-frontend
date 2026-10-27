export type SearchMode = "quick" | "trip"
export type CabinClass = "economy" | "premium_economy" | "business" | "first"
export type DataSource = "sample" | "cached" | "live"
export type Recommendation = "use_miles" | "pay_cash"

export interface SearchLeg {
  origin: string
  destination: string
  departureDate: string
}

export interface SearchRequest {
  mode: SearchMode
  legs: SearchLeg[]
  cabin: CabinClass
  adults: number
  miles: {
    iberiaAvios: number
    baAvios: number
    qatarAvios: number
  }
  flexibleDates: boolean
  payCash?: boolean
}

export interface SearchResponse {
  mode: SearchMode
  route: {
    origin: string
    originCity: string
    destination: string
    destinationCity: string
    departureDate: string
    cabin: CabinClass
    adults: number
    legs?: SearchLeg[]
  }
  cash: {
    amountEur: number
    label: string
    dataSource: DataSource
    note?: string
  }
  hacked: {
    amountEur: number
    label: string
    hackTitle: string
    hackType?: string
    breakdown: {
      milesRequired: number
      program: string
      taxesEur: number
    }
  }
  savings: {
    amountEur: number
    percent: number
    recommendation: Recommendation
    headline: string
  }
  explain: {
    summary: string
    centsPerMile?: number
  }
  bookingSteps: Array<{
    step: number
    title: string
    body: string
    href: string
    external?: boolean
  }>
  alternativeHacks: Array<{
    title: string
    savingsEur: number
    note: string
    hackType?: string
  }>
  disclaimer: string
}

export interface ExplainResponse {
  summary: string
  centsPerMile?: number
}

export interface SavedTrip {
  id: string
  mode: SearchMode
  routeSummary: string
  departureDate: string
  savingsEur: number
  savedAt: string
  recommendation: Recommendation
}
