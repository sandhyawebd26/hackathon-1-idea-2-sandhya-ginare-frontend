export type Provenance =
  | "sample"
  | "cached"
  | "chart"
  | "test_fare"
  | "indicative"
  | "user"

export type Money = {
  minor: number
  currency: "EUR"
}

export type SavingsVerdict = "use_miles" | "pay_cash"

export type SavingsResult = {
  cashMinor: number
  hackedMinor: number
  savingsMinor: number
  percent: number
  verdict: SavingsVerdict
  headline: string
  milesRequired: number
  taxesMinor: number
  program: string
  provenanceCash: Provenance
  provenanceHacked: Provenance
}
