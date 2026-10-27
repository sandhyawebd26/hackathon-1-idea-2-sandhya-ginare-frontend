import { NextResponse } from "next/server"

import { catalogueMeta, listSpainCards } from "@/lib/catalogue/spain-cards"

export const dynamic = "force-dynamic"

export async function GET() {
  const meta = catalogueMeta()
  return NextResponse.json(
    {
      ok: true,
      data: listSpainCards(),
      meta: {
        version: meta.version,
        note: meta.note,
        illustrative: true,
      },
    },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  )
}
