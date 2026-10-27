import type { User as SupabaseUser } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase/config"

export interface AuthUser {
  id: string
  email: string
}

export function toAuthUser(user: Pick<SupabaseUser, "id" | "email"> | null | undefined) {
  if (!user?.email) return null

  return {
    id: user.id,
    email: user.email,
  }
}

export async function loadAuthUser(): Promise<AuthUser | null> {
  if (typeof window === "undefined" || !isSupabaseConfigured) return null

  const supabase = createClient()
  if (!supabase) return null

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    return error ? null : toAuthUser(user)
  } catch {
    return null
  }
}
