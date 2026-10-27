import { serverEnv } from "@/lib/server/env"
import type { CashProvider, CashQuote, CashSearchInput } from "@/lib/providers/types"

const DUFFEL_VERSION = "v2"
const TIMEOUT_MS = 8000

/** Rough FX to EUR for indicative test fares only. */
const TO_EUR: Record<string, number> = {
  EUR: 1,
  GBP: 1.17,
  USD: 0.92,
}

function cabinToDuffel(
  cabin: CashSearchInput["cabin"],
): "economy" | "premium_economy" | "business" | "first" {
  return cabin
}

function amountToEur(amount: number, currency: string | undefined): number | null {
  if (!Number.isFinite(amount)) return null
  const rate = TO_EUR[(currency ?? "").toUpperCase()]
  if (!rate) return null
  return Math.round(amount * rate)
}

async function requestDuffelOffers(
  input: CashSearchInput,
  token: string,
  signal: AbortSignal,
): Promise<CashQuote | null> {
  const response = await fetch("https://api.duffel.com/air/offer_requests?return_offers=true", {
    method: "POST",
    signal,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Duffel-Version": DUFFEL_VERSION,
    },
    body: JSON.stringify({
      data: {
        slices: [
          {
            origin: input.origin,
            destination: input.destination,
            departure_date: input.departureDate,
          },
        ],
        passengers: Array.from({ length: input.adults }, () => ({ type: "adult" })),
        cabin_class: cabinToDuffel(input.cabin),
      },
    }),
  })

  if (!response.ok) {
    return null
  }

  const payload = (await response.json()) as {
    data?: {
      live_mode?: boolean
      offers?: Array<{ total_amount?: string; total_currency?: string }>
    }
  }

  if (payload.data?.live_mode === true) {
    return null
  }

  const offers = payload.data?.offers ?? []
  const priced: Array<{ amountEur: number; currency?: string }> = []
  for (const offer of offers) {
    const amount = Number.parseFloat(offer.total_amount ?? "")
    const amountEur = amountToEur(amount, offer.total_currency)
    if (amountEur !== null) {
      priced.push({ amountEur, currency: offer.total_currency })
    }
  }
  priced.sort((a, b) => a.amountEur - b.amountEur)

  const cheapest = priced[0]
  if (!cheapest) {
    return null
  }

  const currencyNote =
    cheapest.currency && cheapest.currency !== "EUR"
      ? ` Converted from ${cheapest.currency} for display.`
      : ""

  return {
    amountEur: cheapest.amountEur,
    provenance: "test_fare",
    note: `Duffel test data — not a market fare.${currencyNote}`,
    source: "duffel_test",
  }
}

async function searchOnce(input: CashSearchInput, token: string): Promise<CashQuote | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    return await requestDuffelOffers(input, token, controller.signal)
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

export const duffelCashProvider: CashProvider = {
  async search(input: CashSearchInput): Promise<CashQuote | null> {
    const token = serverEnv().duffelToken
    if (!token.startsWith("duffel_test_")) {
      return null
    }

    const first = await searchOnce(input, token)
    if (first) return first

    return searchOnce(input, token)
  },
}
