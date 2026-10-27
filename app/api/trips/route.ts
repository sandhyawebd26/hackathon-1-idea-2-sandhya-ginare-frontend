import { NextResponse } from "next/server"

import { savedTripSchema } from "@/lib/search-validation"
import { getServerUser } from "@/lib/supabase/server"
import type { SavedTrip } from "@/lib/search-types"

export const dynamic = "force-dynamic"

const globalTrips = globalThis as typeof globalThis & {
  __aUnaMillaTrips?: Map<string, SavedTrip[]>
}
const tripsByOwner = globalTrips.__aUnaMillaTrips ??= new Map<string, SavedTrip[]>()

function getDeviceId(request: Request) {
  const deviceId = request.headers.get("x-device-id") ?? ""
  return /^[a-zA-Z0-9_-]{8,80}$/.test(deviceId) ? deviceId : null
}

async function getOwnerKey(request: Request) {
  const user = await getServerUser()
  if (user) return `user:${user.id}`

  const deviceId = getDeviceId(request)
  return deviceId ? `device:${deviceId}` : null
}

export async function GET(request: Request) {
  const ownerKey = await getOwnerKey(request)
  if (!ownerKey) {
    return NextResponse.json({ error: "A valid device id is required." }, { status: 400 })
  }

  const trips = [...(tripsByOwner.get(ownerKey) ?? [])].sort(
    (left, right) => Date.parse(right.savedAt) - Date.parse(left.savedAt),
  )

  return NextResponse.json(
    { trips },
    { headers: { "Cache-Control": "no-store" } },
  )
}

export async function POST(request: Request) {
  const ownerKey = await getOwnerKey(request)
  if (!ownerKey) {
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

  const existingTrips = tripsByOwner.get(ownerKey) ?? []
  const trips = [parsed.data, ...existingTrips.filter(trip => trip.id !== parsed.data.id)].slice(0, 50)
  tripsByOwner.set(ownerKey, trips)

  return NextResponse.json(
    { trip: parsed.data },
    { headers: { "Cache-Control": "no-store" } },
  )
}
