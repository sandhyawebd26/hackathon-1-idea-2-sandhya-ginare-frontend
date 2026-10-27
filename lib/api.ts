import { getOrCreateDeviceId } from "@/lib/device-id"
import { createSearchFixture, demoSearchRequest } from "@/lib/search-demo"
import { savedTripSchema, searchRequestSchema } from "@/lib/search-validation"
import type {
  ExplainResponse,
  SavedTrip,
  SearchRequest,
  SearchResponse,
} from "@/lib/search-types"

export const PENDING_SEARCH_KEY = "a-una-milla:pending-search"
const SAVED_TRIPS_KEY_PREFIX = "a-una-milla:saved-trips:"
const useFixtures = process.env.NEXT_PUBLIC_USE_FIXTURE === "true"

const delay = (milliseconds = 360) =>
  new Promise(resolve => window.setTimeout(resolve, milliseconds))

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    ...init,
  })
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      typeof payload?.error === "string" ? payload.error : "The request could not be completed.",
    )
  }

  return payload as T
}

export async function search(request: SearchRequest): Promise<SearchResponse> {
  if (useFixtures) {
    await delay()
    return createSearchFixture(request)
  }

  try {
    return await requestJson<SearchResponse>("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    })
  } catch {
    await delay(420)
    return createSearchFixture(request)
  }
}

export async function explain(body: { response: SearchResponse }): Promise<ExplainResponse> {
  if (useFixtures) {
    await delay()
    return body.response.explain
  }

  try {
    return await requestJson<ExplainResponse>("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch {
    await delay(360)
    return body.response.explain
  }
}

export async function health(): Promise<{ ok: boolean }> {
  try {
    return await requestJson<{ ok: boolean }>("/api/health")
  } catch {
    return { ok: false }
  }
}

export function storePendingSearch(request: SearchRequest) {
  if (typeof window === "undefined") return

  try {
    window.sessionStorage.setItem(PENDING_SEARCH_KEY, JSON.stringify(request))
  } catch {
    // Results falls back to the demo route if session storage is unavailable.
  }
}

export function readPendingSearch(): SearchRequest {
  if (typeof window === "undefined") return demoSearchRequest

  try {
    const serialized = window.sessionStorage.getItem(PENDING_SEARCH_KEY)
    if (!serialized) return demoSearchRequest

    const parsed = searchRequestSchema.safeParse(JSON.parse(serialized))
    return parsed.success ? parsed.data : demoSearchRequest
  } catch {
    return demoSearchRequest
  }
}

function storageKey(deviceId: string) {
  return `${SAVED_TRIPS_KEY_PREFIX}${deviceId}`
}

function readLocalTrips(deviceId: string): SavedTrip[] {
  if (typeof window === "undefined") return []

  try {
    const serialized = window.localStorage.getItem(storageKey(deviceId))
    if (!serialized) return []

    const parsed = savedTripSchema.array().safeParse(JSON.parse(serialized))
    return parsed.success ? parsed.data : []
  } catch {
    return []
  }
}

function writeLocalTrips(deviceId: string, trips: SavedTrip[]) {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(storageKey(deviceId), JSON.stringify(trips))
  } catch {
    // The API store remains available when browser storage is disabled.
  }
}

function mergeTrips(localTrips: SavedTrip[], remoteTrips: SavedTrip[]) {
  const byId = new Map<string, SavedTrip>()
  for (const trip of localTrips) byId.set(trip.id, trip)
  for (const trip of remoteTrips) byId.set(trip.id, trip)

  return Array.from(byId.values()).sort(
    (left, right) => Date.parse(right.savedAt) - Date.parse(left.savedAt),
  )
}

export async function saveTrip(trip: SavedTrip, userId?: string): Promise<SavedTrip> {
  const deviceId = getOrCreateDeviceId()
  const localTrips = readLocalTrips(deviceId)
  const localVersion = mergeTrips(localTrips, [trip])
  writeLocalTrips(deviceId, localVersion)

  if (useFixtures) {
    await delay()
    return trip
  }

  try {
    const result = await requestJson<{ trip: SavedTrip }>("/api/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Device-Id": deviceId,
      },
      body: JSON.stringify({ trip, ...(userId ? { userId } : {}) }),
    })
    writeLocalTrips(deviceId, mergeTrips(localVersion, [result.trip]))
    return result.trip
  } catch {
    await delay(360)
    return trip
  }
}

export async function listTrips(): Promise<SavedTrip[]> {
  const deviceId = getOrCreateDeviceId()
  const localTrips = readLocalTrips(deviceId)

  if (useFixtures) {
    await delay()
    return localTrips
  }

  try {
    const result = await requestJson<{ trips: SavedTrip[] }>("/api/trips", {
      headers: { "X-Device-Id": deviceId },
    })
    const trips = mergeTrips(localTrips, result.trips)
    writeLocalTrips(deviceId, trips)
    return trips
  } catch {
    await delay(360)
    return localTrips
  }
}
