import samplePayCashResponse from "@/fixtures/sample-pay-cash-response.json"
import sampleSearchResponse from "@/fixtures/sample-search-response.json"
import type { SearchRequest, SearchResponse } from "@/lib/search-types"

const cityByAirport: Record<string, string> = {
  BCN: "Barcelona",
  CDG: "Paris",
  CPT: "Cape Town",
  LHR: "London",
  MAD: "Madrid",
  JNB: "Johannesburg",
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export function createSearchFixture(request: SearchRequest): SearchResponse {
  const source = request.payCash ? samplePayCashResponse : sampleSearchResponse
  const response = clone(source) as SearchResponse
  const firstLeg = request.legs[0]
  const finalLeg = request.legs[request.legs.length - 1]

  if (!firstLeg || !finalLeg) {
    return response
  }

  response.mode = request.mode
  response.route = {
    origin: firstLeg.origin,
    originCity: cityByAirport[firstLeg.origin] ?? firstLeg.origin,
    destination: finalLeg.destination,
    destinationCity: cityByAirport[finalLeg.destination] ?? finalLeg.destination,
    departureDate: firstLeg.departureDate,
    cabin: request.cabin,
    adults: request.adults,
    legs: request.legs,
  }

  return response
}

export const demoSearchRequest: SearchRequest = {
  mode: "quick",
  legs: [{ origin: "MAD", destination: "JNB", departureDate: "2026-11-15" }],
  cabin: "business",
  adults: 1,
  miles: { iberiaAvios: 85000, baAvios: 0, qatarAvios: 0 },
  flexibleDates: false,
}
