"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config"

let browserClient: SupabaseClient | null = null

export function createClient() {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) return null

  browserClient ??= createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookieOptions: { secure: process.env.NODE_ENV === "production" },
  })

  return browserClient
}
