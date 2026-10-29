import "server-only"

import { createClient } from "@supabase/supabase-js"

import { serverEnv } from "@/lib/server/env"

export function createAdminClient() {
  const { supabaseUrl, supabaseSecret } = serverEnv()
  if (!supabaseUrl || !supabaseSecret) return null

  return createClient(supabaseUrl, supabaseSecret, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        "X-Client-Info": "a-una-milla-admin",
      },
    },
  })
}
