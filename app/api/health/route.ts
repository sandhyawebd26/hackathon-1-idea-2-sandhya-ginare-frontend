import { NextResponse } from "next/server"

import { catalogueMeta } from "@/lib/catalogue/spain-cards"
import { envPresence } from "@/lib/server/env"

export async function GET() {
  const env = envPresence()
  const cards = catalogueMeta()

  return NextResponse.json(
    {
      ok: true,
      providerMode: env.providerMode,
      authMode: env.authMode,
      catalogue: {
        spainCardsVersion: cards.version,
      },
      integrations: {
        duffel: env.duffel,
        supabase: env.supabaseUrl && env.supabaseAnon,
        supabaseSignup: env.supabaseUrl && env.supabaseSecret,
        gemini: env.gemini,
        groq: env.groq,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  )
}
