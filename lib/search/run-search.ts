import { createSearchFixture } from "@/lib/search-demo"
import { computeSavings } from "@/lib/domain/savings"
import { minorToEuros } from "@/lib/domain/money"
import { searchCashFareWithStatus } from "@/lib/providers/registry"
import { explainTrip } from "@/lib/llm/explain"
import { serverEnv } from "@/lib/server/env"
import type { SearchMeta, SearchRequest, SearchResponse } from "@/lib/search-types"

function dataSourceFromProvenance(
  provenance: string,
): SearchResponse["cash"]["dataSource"] {
  if (provenance === "cached") return "cached"
  if (provenance === "test_fare") return "test"
  if (provenance === "indicative") return "live"
  return "sample"
}

export type RunSearchResult = {
  data: SearchResponse
  meta: SearchMeta
}

export async function runSearch(request: SearchRequest): Promise<RunSearchResult> {
  const base = createSearchFixture(request)
  const origin = request.legs[0]?.origin ?? "MAD"
  const destination = request.legs[request.legs.length - 1]?.destination ?? "JNB"
  const departureDate = request.legs[0]?.departureDate ?? "2026-11-15"

  const { quote: cash, cashStatus } = await searchCashFareWithStatus({
    origin,
    destination,
    departureDate,
    cabin: request.cabin,
    adults: request.adults,
  })

  const savings = computeSavings({
    cashEur: cash.amountEur,
    origin,
    destination,
    cabin: request.cabin,
    provenanceCash: cash.provenance,
    forcePayCash: request.payCash,
  })

  const cashEur = minorToEuros(savings.cashMinor)
  const hackedEur = minorToEuros(savings.hackedMinor)
  const savingsEur = minorToEuros(savings.savingsMinor)
  const taxesEur = minorToEuros(savings.taxesMinor)

  const explained = await explainTrip({
    origin,
    destination,
    cashEur,
    hackedEur,
    savingsEur,
    percent: savings.percent,
    milesRequired: savings.milesRequired,
    taxesEur,
    program: savings.program,
    verdict: savings.verdict,
  })

  const env = serverEnv()

  const data: SearchResponse = {
    ...base,
    cash: {
      amountEur: cashEur,
      label: cash.source === "duffel_test" ? "Duffel test cash fare" : "Typical cash fare",
      dataSource: dataSourceFromProvenance(cash.provenance),
      note: cash.note,
    },
    hacked: {
      amountEur: hackedEur,
      label: "Avios + taxes",
      hackTitle: `${savings.program} award`,
      hackType: "award ticket",
      breakdown: {
        milesRequired: savings.milesRequired,
        program: savings.program,
        taxesEur,
      },
    },
    savings: {
      amountEur: savingsEur,
      percent: savings.percent,
      recommendation: savings.verdict,
      headline: savings.headline,
    },
    explain: {
      summary: explained.summary,
    },
    disclaimer:
      "Chart price only. Award seats are not confirmed until you search on the airline. Duffel test fares are not market prices.",
    meta: {
      providerMode: env.providerMode,
      cashSource: cash.source,
      cashStatus,
    },
  }

  return {
    data,
    meta: {
      providerMode: env.providerMode,
      cashSource: cash.source,
      cashStatus,
    },
  }
}
