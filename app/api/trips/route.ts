import { NextResponse } from "next/server"

import { savedTripSchema } from "@/lib/search-validation"
import type { SavedTrip } from "@/lib/search-types"

export const dynamic = "force-dynamic"

const globalTrips = globalThis as typeof globalThis & {
  __aUnaMillaTrips?: Map<string, SavedTrip[]>
}
const tripsByDevice = globalTrips.__aUnaMillaTrips ??= new Map<string, SavedTrip[]>()

function getDeviceId(request: Request) {
  const deviceId = request.headers.get("x-device-id") ?? ""
  return /^[a-zA-Z0-9_-]{8,80}$/.test(deviceId) ? deviceId : null
}

export async function GET(request: Request) {
  const deviceId = getDeviceId(request)
  if (!deviceId) {
    return NextResponse.json({ error: "A valid device id is required." }, { status: 400 })
  }

  const trips = [...(tripsByDevice.get(deviceId) ?? [])].sort(
    (left, right) => Date.parse(right.savedAt) - Date.parse(left.savedAt),
  )

  return NextResponse.json(
    { trips },
    { headers: { "Cache-Control": "no-store" } },
  )
}

export async function POST(request: Request) {
  const deviceId = getDeviceId(request)
  if (!deviceId) {
    return NextResponse.json({ error: "A valid device id is required." }, { status: 400 })
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0)
  if (contentLength > 8_192) {
    return NextResponse.json({ error: "Saved trip is too large." }, { status: 413 })
  }

  const body = await request.json().catch(() => null)
  const parsed = savedTripSchema.safeParse(body?.trip)
  if (!parsed.success) {
    return NextResponse.json({ error: "A valid saved trip is required." }, { status: 400 })
  }

  const existingTrips = tripsByDevice.get(deviceId) ?? []
  const trips = [parsed.data, ...existingTrips.filter(trip => trip.id !== parsed.data.id)].slice(0, 50)
  tripsByDevice.set(deviceId, trips)

  return NextResponse.json(
    { trip: parsed.data },
    { headers: { "Cache-Control": "no-store" } },
  )
}
