import { NextResponse } from "next/server"

import { runSearch } from "@/lib/search/run-search"
import { searchRequestSchema } from "@/lib/search-validation"

export const dynamic = "force-dynamic"

const globalRateLimit = globalThis as typeof globalThis & {
  __aUnaMillaSearchRate?: Map<string, number[]>
}
const hitsByIp = globalRateLimit.__aUnaMillaSearchRate ??= new Map<string, number[]>()

const WINDOW_MS = 60_000
const MAX_REQUESTS = 30

function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hitsByIp.get(ip) ?? []).filter(time => now - time < WINDOW_MS)
  if (recent.length >= MAX_REQUESTS) {
    hitsByIp.set(ip, recent)
    return true
  }
  recent.push(now)
  hitsByIp.set(ip, recent)
  return false
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many searches. Please wait a minute and try again." },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    )
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0)
  if (contentLength > 16_384) {
    return NextResponse.json(
      { ok: false, error: "Search request is too large." },
      { status: 413 },
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = searchRequestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Check the route, dates, and traveller details.",
        issues: parsed.error.issues.map(issue => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    )
  }

  try {
    const { data, meta } = await runSearch(parsed.data)
    return NextResponse.json(
      { ok: true, data, meta },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed."
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    )
  }
}
