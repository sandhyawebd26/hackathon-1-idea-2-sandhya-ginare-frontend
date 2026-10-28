/**
 * Client auth reads these at build time — use literal NEXT_PUBLIC_* names so Next inlines them.
 * (Dynamic process.env[name] in public-env.ts does not work in the browser bundle.)
 */
export const supabaseUrl = (
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  ""
).trim()

export const supabaseAnonKey = (
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  ""
).trim()

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
