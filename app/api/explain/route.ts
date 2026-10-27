import { NextResponse } from "next/server"
import { z } from "zod"

import { explainTrip } from "@/lib/llm/explain"

export const dynamic = "force-dynamic"

const explainRequestSchema = z.object({
  response: z.object({
    route: z.object({
      origin: z.string().min(3).max(3),
      destination: z.string().min(3).max(3),
    }),
    cash: z.object({
      amountEur: z.number().finite().min(0),
    }),
    hacked: z.object({
      amountEur: z.number().finite().min(0),
      breakdown: z.object({
        milesRequired: z.number().finite().min(0),
        program: z.string().min(1),
        taxesEur: z.number().finite().min(0),
      }),
    }),
    savings: z.object({
      amountEur: z.number().finite().min(0),
      percent: z.number().finite().min(0),
      recommendation: z.enum(["use_miles", "pay_cash"]),
    }),
  }),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = explainRequestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "A valid search result is required." }, { status: 400 })
  }

  const { response } = parsed.data
  const explained = await explainTrip({
    origin: response.route.origin,
    destination: response.route.destination,
    cashEur: response.cash.amountEur,
    hackedEur: response.hacked.amountEur,
    savingsEur: response.savings.amountEur,
    percent: response.savings.percent,
    milesRequired: response.hacked.breakdown.milesRequired,
    taxesEur: response.hacked.breakdown.taxesEur,
    program: response.hacked.breakdown.program,
    verdict: response.savings.recommendation,
  })

  const centsPerMile =
    response.savings.recommendation === "use_miles" && response.hacked.breakdown.milesRequired > 0
      ? Math.round(
          (response.savings.amountEur * 100 * 100) / response.hacked.breakdown.milesRequired,
        ) / 100
      : undefined

  return NextResponse.json(
    {
      summary: explained.summary,
      source: explained.source,
      ...(centsPerMile !== undefined ? { centsPerMile } : {}),
    },
    { headers: { "Cache-Control": "no-store" } },
  )
}
