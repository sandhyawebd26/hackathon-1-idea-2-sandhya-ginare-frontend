import { NextResponse } from "next/server"
import { z } from "zod"

export const dynamic = "force-dynamic"

const explainRequestSchema = z.object({
  response: z.object({
    explain: z.object({
      summary: z.string().trim().min(1).max(1000),
      centsPerMile: z.number().finite().min(0).max(1000).optional(),
    }),
  }),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = explainRequestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "A valid search result is required." }, { status: 400 })
  }

  return NextResponse.json(parsed.data.response.explain, {
    headers: { "Cache-Control": "no-store" },
  })
}
