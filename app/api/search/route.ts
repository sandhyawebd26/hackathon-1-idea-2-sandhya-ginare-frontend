import { NextResponse } from "next/server"

import { createSearchFixture } from "@/lib/search-demo"
import { searchRequestSchema } from "@/lib/search-validation"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0)
  if (contentLength > 16_384) {
    return NextResponse.json({ error: "Search request is too large." }, { status: 413 })
  }

  const body = await request.json().catch(() => null)
  const parsed = searchRequestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Check the route, dates, and traveller details.",
        issues: parsed.error.issues.map(issue => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    )
  }

  return NextResponse.json(createSearchFixture(parsed.data), {
    headers: { "Cache-Control": "no-store" },
  })
}
