import { NextResponse } from "next/server"
import { z } from "zod"

import { createAdminClient } from "@/lib/supabase/admin"
import { serverEnv } from "@/lib/server/env"

export const dynamic = "force-dynamic"

const bodySchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(6).max(128),
})

const hits = globalThis as typeof globalThis & {
  __signupRate?: Map<string, number[]>
}
const byIp = hits.__signupRate ??= new Map<string, number[]>()

function rateLimited(ip: string) {
  const now = Date.now()
  const windowMs = 60_000
  const max = 8
  const recent = (byIp.get(ip) ?? []).filter(t => now - t < windowMs)
  if (recent.length >= max) {
    byIp.set(ip, recent)
    return true
  }
  recent.push(now)
  byIp.set(ip, recent)
  return false
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many signup attempts. Try again in a minute." }, { status: 429 })
  }

  const env = serverEnv()
  const admin = createAdminClient()
  if (!admin) {
    const hint = !env.supabaseUrl
      ? "Missing Supabase URL (NEXT_PUBLIC_SUPABASE_URL or NEXT_SUPABASE_URL on Vercel)."
      : !env.supabaseSecret
        ? "Missing SUPABASE_SECRET_KEY (service role) on Vercel."
        : "Sign-up is not configured on the server."
    return NextResponse.json({ error: hint }, { status: 503 })
  }

  const json = await request.json().catch(() => null)
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password (6+ characters)." }, { status: 400 })
  }

  const email = parsed.data.email.trim().toLowerCase()
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: parsed.data.password,
    email_confirm: true,
  })

  if (error) {
    const msg = error.message.toLowerCase()
    if (msg.includes("already") || msg.includes("registered")) {
      return NextResponse.json({ error: "This email already has an account. Try logging in." }, { status: 409 })
    }
    return NextResponse.json({ error: "Could not create the account. Try again." }, { status: 400 })
  }

  return NextResponse.json({ ok: true, userId: data.user?.id ?? null })
}
