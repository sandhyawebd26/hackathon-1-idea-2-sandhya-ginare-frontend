import "server-only"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config"

export async function createClient() {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) return null

  const cookieStore = cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookieOptions: { secure: process.env.NODE_ENV === "production" },
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Server Components cannot write cookies; middleware refreshes the session.
        }
      },
    },
  })
}

export async function getServerUser() {
  const supabase = await createClient()
  if (!supabase) return null

  const { data: { user }, error } = await supabase.auth.getUser()
  return error ? null : user
}
