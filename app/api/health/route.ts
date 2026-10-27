import { NextResponse } from "next/server"

import { envPresence } from "@/lib/server/env"

export async function GET() {
  const env = envPresence()

  return NextResponse.json(
    {
      ok: true,
      providerMode: env.providerMode,
      authMode: env.authMode,
      integrations: {
        duffel: env.duffel,
        supabase: env.supabaseUrl && env.supabaseAnon,
        gemini: env.gemini,
        groq: env.groq,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  )
}
