import type { User as SupabaseUser } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase/config"

export const DEMO_AUTH_STORAGE_KEY = "aunamilla-demo-user"

export interface AuthUser {
  id: string | null
  email: string
  mode: "supabase" | "demo"
}

export function toAuthUser(user: Pick<SupabaseUser, "id" | "email"> | null | undefined) {
  if (!user?.email) return null

  return {
    id: user.id,
    email: user.email,
    mode: "supabase" as const,
  }
}

export function createDemoAuthUser(email: string): AuthUser {
  try {
    window.localStorage.setItem(DEMO_AUTH_STORAGE_KEY, JSON.stringify({ email }))
  } catch {
    // Keep the current preview session usable when browser storage is unavailable.
  }

  return { id: null, email, mode: "demo" }
}

export function readDemoAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null

  try {
    const serialized = window.localStorage.getItem(DEMO_AUTH_STORAGE_KEY)
    if (!serialized) return null

    const parsed: unknown = JSON.parse(serialized)
    if (typeof parsed !== "object" || parsed === null || !("email" in parsed)) return null
    if (typeof parsed.email !== "string" || !parsed.email) return null

    return { id: null, email: parsed.email, mode: "demo" }
  } catch {
    return null
  }
}

export function clearDemoAuthUser() {
  try {
    window.localStorage.removeItem(DEMO_AUTH_STORAGE_KEY)
  } catch {
    // Nothing else is required when browser storage is unavailable.
  }
}

export async function loadAuthUser(): Promise<AuthUser | null> {
  if (typeof window === "undefined") return null

  if (!isSupabaseConfigured) return readDemoAuthUser()

  const supabase = createClient()
  if (!supabase) return null

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    return error ? null : toAuthUser(user)
  } catch {
    return null
  }
}
