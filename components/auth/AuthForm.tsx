"use client"

import { useState, type FormEvent } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Bookmark, Plane, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toAuthUser } from "@/lib/auth-client"
import { createClient } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { useAuthUser } from "@/lib/use-auth-user"

type AuthMode = "login" | "signup"
type FieldErrors = Partial<Record<"email" | "password" | "confirmPassword", string>>

interface AuthFormProps {
  mode: AuthMode
  nextPath: string
}

function getAuthErrorMessage(error: unknown, mode: AuthMode) {
  const message = error instanceof Error ? error.message.toLowerCase() : ""
  const status =
    typeof error === "object" && error !== null && "status" in error
      ? (error as { status?: unknown }).status
      : undefined

  if (status === 429 || message.includes("rate limit") || message.includes("too many requests")) {
    return "Too many attempts. Please wait a moment and try again."
  }

  if (message.includes("email not confirmed")) {
    return "Please confirm your email using the link we sent before logging in."
  }

  if (
    message.includes("weak password") ||
    message.includes("password should be at least") ||
    message.includes("password must be at least")
  ) {
    return "Choose a stronger password that meets the account requirements."
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
    return "We couldn’t create the account. If you already signed up, try logging in."
  }

  return mode === "login"
    ? "We couldn’t sign you in. Please try again."
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
  const [confirmationSent, setConfirmationSent] = useState(false)

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
      toast.error("Please check the highlighted fields.")
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      if (!supabase) {
        throw new Error("Account access is not configured.")
      }

      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error

        const user = toAuthUser(data.user)
        if (!user) throw new Error("Authentication did not return a user")

        await setUser(user)
        toast.success("Welcome back")
        router.replace(destination)
        router.refresh()
        return
      }

      const emailRedirectTo =
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
        `${window.location.origin}/auth/callback`
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo },
      })
      if (error) throw error

      const user = toAuthUser(data.user)
      if (data.session && user) {
        await setUser(user)
        toast.success("Account created")
        router.replace(destination)
        router.refresh()
        return
      }

      setConfirmationSent(true)
      toast.success("Check your email", {
        description: "Use the confirmation link to finish creating your account.",
      })
    } catch (error) {
      const message = getAuthErrorMessage(error, mode)
      setFormError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const title = mode === "login" ? "Welcome back" : "Create your account"
  const description =
    mode === "login"
      ? "Sign in to return to the routes and comparisons you saved."
      : "Build a travel notebook for the routes you want to revisit."
  const shouldReduceMotion = Boolean(useReducedMotion())
  const entrance = {
    duration: shouldReduceMotion ? 0 : 0.5,
    ease: [0.22, 1, 0.36, 1] as const,
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-8 py-10 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
      <motion.section
        initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={entrance}
        className="max-w-xl"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
          Your travel notebook
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight tracking-[-0.045em] text-brand-paper sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="flex gap-4 rounded-2xl border border-white/10 bg-card/65 p-4 sm:p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-gold/10 text-brand-gold">
              <Bookmark aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold text-brand-paper">Keep useful comparisons close</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Save the routes you want to compare again.</p>
            </div>
          </div>
          <div className="flex gap-4 rounded-2xl border border-white/10 bg-card/65 p-4 sm:p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-indigo/50 text-brand-gold">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold text-brand-paper">Your booking stays yours</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Compare here, then confirm your fare directly with the provider.</p>
            </div>
          </div>
        </div>
        <Link href="/quick" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-brand-gold">
          <Plane aria-hidden="true" className="size-4" />
          Keep exploring without an account
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </motion.section>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...entrance, delay: shouldReduceMotion ? 0 : 0.1 }}
      >
        <Card variant="cream" className="border-white/10 bg-card/90 shadow-2xl shadow-brand-ink/35">
          <CardHeader className="gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-brand-gold/25 bg-brand-gold/10 text-brand-gold">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </div>
            <CardTitle className="text-2xl text-brand-paper">Account access</CardTitle>
            <CardDescription className="text-sm leading-6">
              Email and password only. No phone number or payment details.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {!isSupabaseConfigured && (
              <Alert className="border-brand-gold/25 bg-brand-gold/10 text-brand-paper">
                <AlertTitle>Account sign-in is unavailable</AlertTitle>
                <AlertDescription>
                  You can still compare flights without an account. Saved account features are not configured in this preview.
                </AlertDescription>
              </Alert>
            )}

            {confirmationSent ? (
              <div className="flex flex-col gap-4">
                <Alert className="border-brand-gold/25 bg-brand-gold/10 text-brand-paper">
                  <AlertTitle>Check your email</AlertTitle>
                  <AlertDescription>
                    Follow the confirmation link we sent to finish creating your account.
                  </AlertDescription>
                </Alert>
                <Button asChild variant="primary" size="lg" className="min-h-12 w-full rounded-full">
                  <Link href={`/login?next=${encodeURIComponent(destination)}`}>Continue to log in</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <FieldGroup className="gap-4">
                  <Field data-invalid={Boolean(fieldErrors.email)}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      required
                      aria-invalid={Boolean(fieldErrors.email)}
                      className="h-12 rounded-xl border-white/10 bg-brand-ink/45 px-4"
                    />
                    <div className="min-h-5">
                      {fieldErrors.email ? <FieldError>{fieldErrors.email}</FieldError> : null}
                    </div>
                  </Field>

                  <Field data-invalid={Boolean(fieldErrors.password)}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      minLength={6}
                      required
                      aria-invalid={Boolean(fieldErrors.password)}
                      className="h-12 rounded-xl border-white/10 bg-brand-ink/45 px-4"
                    />
                    <div className="flex min-h-11 justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="min-h-11 text-muted-foreground hover:text-brand-paper"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword(current => !current)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </div>
                    <div className="min-h-5">
                      {fieldErrors.password ? <FieldError>{fieldErrors.password}</FieldError> : null}
                    </div>
                  </Field>

                  {mode === "signup" && (
                    <Field data-invalid={Boolean(fieldErrors.confirmPassword)}>
                      <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmation ? "text" : "password"}
                        autoComplete="new-password"
                        minLength={6}
                        required
                        aria-invalid={Boolean(fieldErrors.confirmPassword)}
                        className="h-12 rounded-xl border-white/10 bg-brand-ink/45 px-4"
                      />
                      <div className="flex min-h-11 justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="min-h-11 text-muted-foreground hover:text-brand-paper"
                          aria-label={showConfirmation ? "Hide confirmation password" : "Show confirmation password"}
                          aria-pressed={showConfirmation}
                          onClick={() => setShowConfirmation(current => !current)}
                        >
                          {showConfirmation ? "Hide" : "Show"}
                        </Button>
                      </div>
                      <div className="min-h-5">
                        {fieldErrors.confirmPassword ? <FieldError>{fieldErrors.confirmPassword}</FieldError> : null}
                      </div>
                    </Field>
                  )}
                </FieldGroup>

                <div aria-live="polite" className="min-h-6">
                  {formError ? <p role="alert" className="text-sm text-destructive">{formError}</p> : null}
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="min-h-12 w-full rounded-full"
                  disabled={isSubmitting || !isSupabaseConfigured}
                >
                  {isSubmitting
                    ? mode === "login"
                      ? "Logging in…"
                      : "Creating account…"
                    : mode === "login"
                      ? "Log in"
                      : "Create account"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 border-t border-white/10 pt-4">
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "New to A Una Milla?" : "Already have an account?"}
            </p>
            <Button asChild variant="link" size="sm" className="min-h-11 px-0">
              <Link href={alternateHref}>{mode === "login" ? "Sign up" : "Log in"}</Link>
            </Button>
            <p className="text-sm text-muted-foreground">You can search without an account.</p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
