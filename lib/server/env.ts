export type ProviderMode = "fixture" | "duffel_test" | "scrappa"
export type AuthMode = "guest" | "supabase"

function read(name: string): string {
  return (process.env[name] ?? "").trim()
}

export function serverEnv() {
  const supabaseUrl =
    read("NEXT_PUBLIC_SUPABASE_URL") || read("NEXT_PUBLIC_SUPABASE_PROJECT_URL")
  const supabaseAnon =
    read("NEXT_PUBLIC_SUPABASE_ANON_KEY") || read("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")

  const duffel =
    read("DUFFEL_ACCESS_TOKEN") || read("DUFFEL_API_KEY") || read("NEXT_PUBLIC_DUFFEL_API_KEY")

  const supabaseSecret =
    read("SUPABASE_SECRET_KEY") || read("NEXT_PUBLIC_SUPABASE_SECRET_KEY")

  const providerModeRaw = read("PROVIDER_MODE")
  let providerMode = (providerModeRaw || "fixture") as ProviderMode
  if (
    !providerModeRaw &&
    duffel.startsWith("duffel_test_")
  ) {
    providerMode = "duffel_test"
  }
  if (providerMode === "duffel_test" && !duffel.startsWith("duffel_test_")) {
    providerMode = "fixture"
  }

  const authMode = (read("AUTH_MODE") || "guest") as AuthMode

  return {
    providerMode: (["fixture", "duffel_test", "scrappa"] as const).includes(providerMode)
      ? providerMode
      : ("fixture" as const),
    authMode: authMode === "supabase" ? ("supabase" as const) : ("guest" as const),
    supabaseUrl,
    supabaseAnon,
    supabaseSecret,
    duffelToken: duffel,
    geminiKey: read("GEMINI_API_KEY"),
    groqKey: read("GROQ_API_KEY"),
    aiEnabled: read("AI_EXPLANATIONS_ENABLED") !== "false",
  }
}

export function envPresence() {
  const e = serverEnv()
  return {
    supabaseUrl: Boolean(e.supabaseUrl),
    supabaseAnon: Boolean(e.supabaseAnon),
    supabaseSecret: Boolean(e.supabaseSecret),
    duffel: Boolean(e.duffelToken),
    gemini: Boolean(e.geminiKey),
    groq: Boolean(e.groqKey),
    providerMode: e.providerMode,
    authMode: e.authMode,
  }
}
