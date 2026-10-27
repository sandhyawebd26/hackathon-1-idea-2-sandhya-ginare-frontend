/** Browser-safe Supabase project URL + anon key (see .env.example). */
function read(name: string): string {
  return (process.env[name] ?? "").trim()
}

/** Values exposed to the client must resolve to NEXT_PUBLIC_* (or next.config.js env mapping). */
export function supabasePublicUrl(): string {
  return (
    read("NEXT_PUBLIC_SUPABASE_URL") ||
    read("NEXT_SUPABASE_URL") ||
    read("SUPABASE_URL")
  )
}

export function supabasePublicAnonKey(): string {
  return (
    read("NEXT_PUBLIC_SUPABASE_ANON_KEY") ||
    read("NEXT_SUPABASE_ANON_KEY") ||
    read("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
    read("SUPABASE_ANON_KEY") ||
    read("SUPABASE_PUBLISHABLE_KEY")
  )
}
