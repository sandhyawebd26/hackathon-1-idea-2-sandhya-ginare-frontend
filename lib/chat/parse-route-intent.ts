import type { CabinClass, SearchLeg } from "@/lib/search-types"
import { demoSearchRequest } from "@/lib/search-demo"
import { presetRoutes } from "@/lib/plan/preset-routes"

const airportHints: Array<{ codes: string[]; words: string[]; origin?: string; dest?: string }> = [
  { codes: ["MAD"], words: ["madrid"] },
  { codes: ["JNB"], words: ["johannesburg", "jnb", "south africa"] },
  { codes: ["BCN"], words: ["barcelona", "bcn"] },
  { codes: ["JFK"], words: ["new york", "jfk", "nyc"] },
  { codes: ["LHR"], words: ["london", "lhr"] },
  { codes: ["EZE"], words: ["buenos aires", "eze"] },
]

function detectCodes(text: string): string[] {
  const lower = text.toLowerCase()
  const found = new Set<string>()
  for (const hint of airportHints) {
    if (hint.codes.some(code => lower.includes(code.toLowerCase()))) {
      found.add(hint.codes[0])
    }
    if (hint.words.some(word => lower.includes(word))) {
      found.add(hint.codes[0])
    }
  }
  return Array.from(found)
}

function cabinFromText(text: string): CabinClass {
  const lower = text.toLowerCase()
  if (lower.includes("first")) return "first"
  if (lower.includes("premium")) return "premium_economy"
  if (lower.includes("economy") && !lower.includes("premium")) return "economy"
  return "business"
}

export function buildSearchRequestFromMessage(content: string) {
  const lower = content.toLowerCase()
  const codes = detectCodes(lower)

  let preset = presetRoutes.find(route => {
    if (lower.includes("jnb") || lower.includes("johannesburg")) return route.id === "mad-jnb"
    if (lower.includes("jfk") || lower.includes("new york")) return route.id === "bcn-jfk"
    if (lower.includes("lhr") || lower.includes("london")) return route.id === "mad-lhr"
    if (lower.includes("eze") || lower.includes("buenos")) return route.id === "mad-eze"
    return false
  })

  if (!preset && codes.length >= 2) {
    preset = presetRoutes.find(
      route => route.origin === codes[0] && route.destination === codes[1],
    )
  }

  const origin = preset?.origin ?? codes[0] ?? demoSearchRequest.legs[0].origin
  const destination = preset?.destination ?? codes[1] ?? demoSearchRequest.legs[0].destination
  const departureDate = preset?.departureDate ?? demoSearchRequest.legs[0].departureDate

  const leg: SearchLeg = { origin, destination, departureDate }

  return {
    mode: "quick" as const,
    legs: [leg],
    cabin: cabinFromText(content),
    adults: 1,
    miles: { iberiaAvios: 0, baAvios: 0, qatarAvios: 0 },
    flexibleDates: false,
  }
}

export function isFlightSearchIntent(content: string): boolean {
  const lower = content.toLowerCase()
  const earnOnly =
    (lower.includes("earn") || lower.includes("revolut") || lower.includes("strategy")) &&
    !lower.includes("compare") &&
    !lower.includes("flight") &&
    !lower.includes("search") &&
    !lower.includes("jnb") &&
    !lower.includes("jfk") &&
    !lower.includes("madrid to") &&
    !lower.includes("barcelona to")
  if (earnOnly) return false

  return (
    lower.includes("compare") ||
    lower.includes("flight") ||
    lower.includes("search") ||
    lower.includes("business class") ||
    lower.includes("jnb") ||
    lower.includes("jfk") ||
    lower.includes("johannesburg") ||
    lower.includes("madrid") ||
    lower.includes("barcelona") ||
    lower.includes("new york")
  )
}
