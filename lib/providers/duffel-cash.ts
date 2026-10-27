import { serverEnv } from "@/lib/server/env"
import type { CashProvider, CashQuote, CashSearchInput } from "@/lib/providers/types"

const DUFFEL_VERSION = "v2"

function cabinToDuffel(
  cabin: CashSearchInput["cabin"],
): "economy" | "premium_economy" | "business" | "first" {
  return cabin
}

export const duffelCashProvider: CashProvider = {
  async search(input: CashSearchInput): Promise<CashQuote | null> {
    const token = serverEnv().duffelToken
    if (!token.startsWith("duffel_test_")) {
      return null
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)

    try {
      const response = await fetch("https://api.duffel.com/air/offer_requests?return_offers=true", {
        method: "POST",
        signal: controller.signal,
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
      const euroOffers = offers
        .map(offer => ({
          amount: Number.parseFloat(offer.total_amount ?? ""),
          currency: offer.total_currency,
        }))
        .filter(offer => offer.currency === "EUR" && Number.isFinite(offer.amount))
        .sort((a, b) => a.amount - b.amount)

      const cheapest = euroOffers[0]
      if (!cheapest) {
        return null
      }

      return {
        amountEur: Math.round(cheapest.amount),
        provenance: "test_fare",
        note: "Duffel test data — not a market fare.",
        source: "duffel_test",
      }
    } catch {
      return null
    } finally {
      clearTimeout(timer)
    }
  },
}
