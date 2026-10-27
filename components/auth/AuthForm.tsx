"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Plane,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  UserCheck,
} from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toAuthUser } from "@/lib/auth-client"
import { createClient } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { useAuthUser } from "@/lib/use-auth-user"
import { cn } from "@/lib/utils"

type AuthMode = "login" | "signup"
type FieldErrors = Partial<Record<"email" | "password" | "confirmPassword", string>>

interface AuthFormProps {
  mode: AuthMode
  nextPath: string
}

function getAuthErrorMessage(error: unknown, mode: AuthMode) {
  const message = error instanceof Error ? error.message.toLowerCase() : ""
  const authError =
    typeof error === "object" && error !== null
      ? (error as { status?: unknown; code?: string; msg?: string })
      : {}
  const status = authError.status
  const code = authError.code ?? ""

  if (message.includes("authentication is not configured")) {
    return "Account access is not available right now. You can still search and plan trips."
  }

  if (
    code === "over_email_send_rate_limit" ||
    status === 429 ||
    message.includes("rate limit") ||
    message.includes("too many requests") ||
    message.includes("email rate limit")
  ) {
    return mode === "signup"
      ? "Supabase email rate limit reached. In your Supabase dashboard turn off “Confirm email” to enable instant signups, or create a test user under Authentication → Users."
      : "Too many sign-in attempts. Please wait a few minutes and try again."
  }

  if (message.includes("email not confirmed")) {
    return "Please confirm your email using the link sent before logging in."
  }

  if (
    message.includes("weak password") ||
    message.includes("password should be at least") ||
    message.includes("password must be at least")
  ) {
    return "Choose a stronger password (minimum 6 characters)."
  }

  if (
    mode === "login" &&
    (message.includes("invalid login credentials") ||
      message.includes("invalid credentials") ||
      message.includes("user not found"))
  ) {
    return "Email or password is incorrect."
  }

  if (mode === "signup" && (message.includes("already registered") || message.includes("already exists"))) {
    return "An account with this email already exists. Try logging in instead."
  }

  return mode === "login"
    ? "We couldn’t sign you in. Please check your credentials and try again."
    : "We couldn’t create your account. Please try again."
}

function isSafeNextPath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("\\")
}

export function AuthForm({ mode, nextPath }: AuthFormProps) {
  const router = useRouter()
  const { setUser } = useAuthUser()
  const destination = isSafeNextPath(nextPath) ? nextPath : "/saved"
  const alternateHref = `${mode === "login" ? "/signup" : "/login"}?next=${encodeURIComponent(destination)}`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState("")
  const [isOAuthLoading, setIsOAuthLoading] = useState(false)

  async function handleGoogleSignIn() {
    setFormError("")
    setIsOAuthLoading(true)
    try {
      const supabase = createClient()
      if (!supabase) throw new Error("Authentication is not configured")

      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      })
      if (error) throw error
    } catch (error) {
      const message = getAuthErrorMessage(error, mode)
      setFormError(message)
      toast.error(message)
      setIsOAuthLoading(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError("")

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "").trim().toLowerCase()
    const password = String(formData.get("password") ?? "")
    const confirmPassword = String(formData.get("confirmPassword") ?? "")
    const errors: FieldErrors = {}

    if (!email) {
      errors.email = "Enter your email address."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address."
    }

    if (!password) {
      errors.password = "Enter your password."
    } else if (password.length < 6) {
      errors.password = "Use at least 6 characters."
    }

    if (mode === "signup") {
      if (!confirmPassword) {
        errors.confirmPassword = "Confirm your password."
      } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match."
      }
    }

    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      toast.error("Please fill in the required fields.")
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      if (!supabase) throw new Error("Authentication is not configured")

      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error

        const user = toAuthUser(data.user)
        if (!user) throw new Error("Authentication did not return a user")

        await setUser(user)
        toast.success("Welcome back to A Una Milla!")
        router.replace(destination)
        router.refresh()
        return
      }

      const signupResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const signupPayload = (await signupResponse.json().catch(() => null)) as {
        ok?: boolean
        error?: string
      } | null
      if (!signupResponse.ok) {
        throw new Error(signupPayload?.error ?? "Could not create your account.")
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      const user = toAuthUser(data.user)
      if (!user) throw new Error("Account was created but sign-in failed. Try logging in.")

      await setUser(user)
      toast.success("Account created successfully!")
      router.replace(destination)
      router.refresh()
    } catch (error) {
      const message = getAuthErrorMessage(error, mode)
      setFormError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl py-8 sm:py-14">
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        {/* Left Value Showcase Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-foreground p-8 text-background shadow-2xl lg:col-span-5 sm:p-10"
        >
          {/* Subtle decorative glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 size-60 rounded-full bg-primary/15 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-primary animate-pulse" />
              <Badge className="border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                Travel Hacking · VIP Access
              </Badge>
            </div>

            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Unlock business class for pennies on the euro.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-background/80">
                Join smart Spanish travelers who turn everyday card spend into unforgettable
                long-haul business seats.
              </p>
            </div>

            {/* Live Example Card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs text-background/70">
                <span className="flex items-center gap-1.5 font-medium">
                  <Plane className="size-3.5 text-primary" /> Madrid (MAD) → JNB
                </span>
                <span className="rounded-full bg-primary/20 px-2 py-0.5 font-bold text-primary">
                  78% OFF
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between border-t border-white/10 pt-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-background/60">Retail Cash</span>
                  <p className="text-sm font-semibold text-background/70 line-through">€2,840</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">Your Net Price</span>
                  <p className="text-lg font-bold text-white">€412 <span className="text-xs font-normal text-background/70">+ 85k Avios</span></p>
                </div>
              </div>
            </div>

            {/* Feature List */}
            <ul className="flex flex-col gap-3 text-xs text-background/85">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                <span>Real-time Iberia Plus, BA & Qatar award inventory</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                <span>Spanish card optimizer (Revolut RevPoints & Amex)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                <span>AI Booking Assistant to plan trips from 0 to 100%</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="size-4 shrink-0 text-primary" />
                <span>Zero markup: Book direct on airline official portals</span>
              </li>
            </ul>
          </div>

          <div className="relative z-10 mt-8 border-t border-white/10 pt-6">
            <p className="text-xs italic text-background/70">
              “Saved €2,200 on my flight to Cape Town within 10 minutes of using A Una Milla.”
            </p>
            <p className="mt-1 text-[11px] font-semibold text-primary">— Carlos M., Madrid</p>
          </div>
        </motion.div>

        {/* Right Auth Form Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7"
        >
          <Card className="rounded-3xl border border-border/80 bg-card p-6 shadow-xl sm:p-10">
            {/* Mode Segment Switcher */}
            <div className="mb-6 flex rounded-xl border border-border bg-secondary/50 p-1">
              <Link
                href={`/login?next=${encodeURIComponent(destination)}`}
                className={cn(
                  "flex-1 rounded-lg py-2.5 text-center text-sm font-semibold transition-all",
                  mode === "login"
                    ? "bg-background text-espresso shadow-sm"
                    : "text-muted-foreground hover:text-espresso"
                )}
              >
                Log in
              </Link>
              <Link
                href={`/signup?next=${encodeURIComponent(destination)}`}
                className={cn(
                  "flex-1 rounded-lg py-2.5 text-center text-sm font-semibold transition-all",
                  mode === "signup"
                    ? "bg-background text-espresso shadow-sm"
                    : "text-muted-foreground hover:text-espresso"
                )}
              >
                Create account
              </Link>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-[-0.03em] text-espresso sm:text-3xl">
                {mode === "login" ? "Welcome back" : "Start saving on flights"}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {mode === "login"
                  ? "Access your saved flight routes, custom miles strategy, and alerts."
                  : "Sign up in 30 seconds to sync your flight comparisons across devices."}
              </p>
            </div>

            <CardContent className="flex flex-col gap-5 p-0">
              {!isSupabaseConfigured && (
                <Alert className="border-primary/25 bg-primary/10 text-foreground">
                  <AlertTitle>Account access preview</AlertTitle>
                  <AlertDescription>
                    Auth is running in guest demonstration mode. You can still use all flight tools.
                  </AlertDescription>
                </Alert>
              )}

              {/* Google Social Login */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-12 w-full rounded-xl border-border bg-background text-sm font-medium hover:bg-secondary/70"
                disabled={isSubmitting || isOAuthLoading || !isSupabaseConfigured}
                onClick={() => void handleGoogleSignIn()}
              >
                <svg className="mr-2.5 size-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {isOAuthLoading ? "Connecting with Google…" : "Continue with Google"}
              </Button>

              <div className="relative flex items-center gap-3 py-1">
                <span className="h-px flex-1 bg-border" aria-hidden />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  or with email
                </span>
                <span className="h-px flex-1 bg-border" aria-hidden />
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <FieldGroup className="gap-4">
                  <Field data-invalid={Boolean(fieldErrors.email)}>
                    <FieldLabel htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-espresso">
                      Email address
                    </FieldLabel>
                    <div className="relative mt-1">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="you@domain.com"
                        required
                        aria-invalid={Boolean(fieldErrors.email)}
                        className="h-12 rounded-xl border-border bg-background pl-10 text-sm focus:border-primary"
                      />
                    </div>
                    {fieldErrors.email ? (
                      <p className="mt-1 text-xs text-destructive">{fieldErrors.email}</p>
                    ) : null}
                  </Field>

                  <Field data-invalid={Boolean(fieldErrors.password)}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-espresso">
                        Password
                      </FieldLabel>
                      {mode === "login" && (
                        <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer">
                          Forgot password?
                        </span>
                      )}
                    </div>
                    <div className="relative mt-1">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                        minLength={6}
                        placeholder="Minimum 6 characters"
                        required
                        aria-invalid={Boolean(fieldErrors.password)}
                        className="h-12 rounded-xl border-border bg-background pl-10 pr-10 text-sm focus:border-primary"
                      />
                      <button
                        type="button"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-espresso"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword(current => !current)}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {fieldErrors.password ? (
                      <p className="mt-1 text-xs text-destructive">{fieldErrors.password}</p>
                    ) : null}
                  </Field>

                  {mode === "signup" && (
                    <Field data-invalid={Boolean(fieldErrors.confirmPassword)}>
                      <FieldLabel htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-espresso">
                        Confirm password
                      </FieldLabel>
                      <div className="relative mt-1">
                        <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmation ? "text" : "password"}
                          autoComplete="new-password"
                          minLength={6}
                          placeholder="Re-type your password"
                          required
                          aria-invalid={Boolean(fieldErrors.confirmPassword)}
                          className="h-12 rounded-xl border-border bg-background pl-10 pr-10 text-sm focus:border-primary"
                        />
                        <button
                          type="button"
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-espresso"
                          aria-label={showConfirmation ? "Hide confirm password" : "Show confirm password"}
                          onClick={() => setShowConfirmation(current => !current)}
                        >
                          {showConfirmation ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                      {fieldErrors.confirmPassword ? (
                        <p className="mt-1 text-xs text-destructive">{fieldErrors.confirmPassword}</p>
                      ) : null}
                    </Field>
                  )}
                </FieldGroup>

                {formError ? (
                  <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                    {formError}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="mt-2 h-12 w-full rounded-xl text-sm font-semibold shadow-md transition-transform active:scale-[0.99]"
                  disabled={isSubmitting || !isSupabaseConfigured}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-espresso border-t-transparent" />
                      {mode === "login" ? "Logging in…" : "Creating account…"}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {mode === "login" ? "Log in" : "Create free account"}
                      <ArrowRight className="size-4" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Guest / Browse fallback */}
              <div className="mt-2 flex flex-col items-center gap-2 border-t border-border pt-4 text-center text-xs text-muted-foreground">
                <p>
                  {mode === "login" ? "Don't have an account yet?" : "Already have an account?"}{" "}
                  <Link href={alternateHref} className="font-semibold text-primary hover:underline">
                    {mode === "login" ? "Sign up free" : "Log in here"}
                  </Link>
                </p>
                <Link
                  href="/quick"
                  className="font-medium text-muted-foreground underline decoration-border hover:text-espresso"
                >
                  Skip for now and search flights as guest →
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
