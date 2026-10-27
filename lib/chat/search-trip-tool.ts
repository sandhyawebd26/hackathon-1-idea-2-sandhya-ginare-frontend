import "server-only"

import type { FlightOptionProps } from "@/components/flight-generative-ui/FlightOptionCard"
import { buildSearchRequestFromMessage } from "@/lib/chat/parse-route-intent"
import { formatTravelDate } from "@/lib/route-label"
import { runSearch } from "@/lib/search/run-search"
import type { SearchResponse } from "@/lib/search-types"

function cabinLabel(cabin: SearchResponse["route"]["cabin"]): FlightOptionProps["cabin"] {
  if (cabin === "economy") return "Economy"
  if (cabin === "premium_economy") return "Premium Economy"
  return "Business Class"
}

function programLabel(program: string): FlightOptionProps["program"] {
  if (program.toLowerCase().includes("british")) return "British Airways Club"
  if (program.toLowerCase().includes("qatar")) return "Qatar Privilege"
  return "Iberia Plus"
}

export function searchResponseToFlightCard(data: SearchResponse): FlightOptionProps {
  const step = data.bookingSteps[0]
  const airlineLabel = data.cash.label.split("\u00b7")[0]?.trim() || "Iberia"
  return {
    id: `${data.route.origin}-${data.route.destination}-${data.route.departureDate}`,
    airline: airlineLabel,
    flightNumber: "Award search",
    originCode: data.route.origin,
    originCity: data.route.originCity,
    destCode: data.route.destination,
    destCity: data.route.destinationCity,
    departureDate: formatTravelDate(data.route.departureDate),
    cabin: cabinLabel(data.route.cabin),
    duration: "See airline",
    stops: "Direct",
    cashPriceEur: data.cash.amountEur,
    awardAvios: data.hacked.breakdown.milesRequired,
    taxesEur: data.hacked.breakdown.taxesEur,
    bookingUrl: step?.href ?? "https://www.iberia.com",
    program: programLabel(data.hacked.breakdown.program),
  }
}

export async function searchTripForChat(content: string) {
  const request = buildSearchRequestFromMessage(content)
  const { data, meta } = await runSearch(request)
  const flight = searchResponseToFlightCard(data)
  const savings = data.savings
  const cashBadge =
    meta.cashSource === "duffel_test"
      ? "Duffel TEST cash"
      : meta.cashStatus === "fixture_fallback"
        ? "chart + fixture cash"
        : "fixture demo"

  const summary =
    savings.recommendation === "pay_cash"
      ? `On ${data.route.origin}-${data.route.destination}, cash (${data.cash.amountEur} EUR) beats miles this time. ${data.explain.summary}`
      : `Cash is about ${data.cash.amountEur} EUR; ${data.hacked.breakdown.program} asks ${data.hacked.breakdown.milesRequired.toLocaleString("en-GB")} miles + ${data.hacked.breakdown.taxesEur} EUR taxes. You could save about ${savings.amountEur} EUR (${savings.percent}%). Source: ${cashBadge}. Confirm award space before transferring points.`

  return { flight, summary, data, meta }
}
