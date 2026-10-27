"use client"

import { useState, type FormEvent } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ArrowTopRightIcon,
  Cross2Icon,
  MinusIcon,
  PlusIcon,
} from "@radix-ui/react-icons"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { storePendingSearch } from "@/lib/api"
import { searchRequestSchema } from "@/lib/search-validation"
import type { CabinClass, SearchLeg, SearchMode } from "@/lib/search-types"
import { cn } from "@/lib/utils"

type FormLeg = SearchLeg & { id: string }
type FormErrors = Record<string, string>

interface FlightSearchFormProps {
  mode: SearchMode
}

interface TextFieldProps {
  id: string
  label: string
  value: string
  error?: string
  type?: "text" | "date"
  placeholder?: string
  onChange: (value: string) => void
}

function TextField({
  id,
  label,
  value,
  error,
  type = "text",
  placeholder,
  onChange,
}: TextFieldProps) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        autoCapitalize={type === "text" ? "characters" : undefined}
        maxLength={type === "text" ? 3 : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-12 rounded-xl border-white/10 bg-brand-ink/55 px-4 text-base placeholder:text-muted-foreground/70"
        onChange={event => onChange(event.currentTarget.value)}
      />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </Field>
  )
}

function initialLegs(mode: SearchMode): FormLeg[] {
  if (mode === "trip") {
    return [
      { id: "leg-1", origin: "MAD", destination: "JNB", departureDate: "2026-11-15" },
      { id: "leg-2", origin: "JNB", destination: "MAD", departureDate: "2026-11-28" },
    ]
  }

  return [{ id: "leg-1", origin: "MAD", destination: "JNB", departureDate: "2026-11-15" }]
}

const cabinOptions: Array<{ value: CabinClass; label: string }> = [
  { value: "economy", label: "Economy" },
  { value: "premium_economy", label: "Premium economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First" },
]

export function FlightSearchForm({ mode }: FlightSearchFormProps) {
  const router = useRouter()
  const [legs, setLegs] = useState(() => initialLegs(mode))
  const [cabin, setCabin] = useState<CabinClass>("business")
  const [adults, setAdults] = useState(1)
  const [flexibleDates, setFlexibleDates] = useState(false)
  const [miles, setMiles] = useState({ iberiaAvios: 85000, baAvios: 0, qatarAvios: 0 })
  const [errors, setErrors] = useState<FormErrors>({})
  const shouldReduceMotion = Boolean(useReducedMotion())

  const title = mode === "quick" ? "Quick flight" : "Full trip plan"
  const firstLeg = legs[0]
  const lastLeg = legs[legs.length - 1]
  const totalMiles = Object.values(miles).reduce((total, amount) => total + amount, 0)

  function updateLeg(index: number, key: keyof SearchLeg, value: string) {
    const normalizedValue = key === "departureDate"
      ? value
      : value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3)

    setLegs(current => current.map((leg, legIndex) =>
      legIndex === index ? { ...leg, [key]: normalizedValue } : leg,
    ))
    setErrors(current => {
      const next = { ...current }
      delete next[`legs.${index}.${key}`]
      delete next.legs
      return next
    })
  }

  function addLeg() {
    if (legs.length >= 3) return

    const previousLeg = legs[legs.length - 1]
    const nextDate = new Date(`${previousLeg.departureDate || "2026-11-15"}T12:00:00`)
    nextDate.setDate(nextDate.getDate() + 7)

    setLegs(current => [
      ...current,
      {
        id: `leg-${Date.now()}`,
        origin: previousLeg.destination,
        destination: "",
        departureDate: nextDate.toISOString().slice(0, 10),
      },
    ])
  }

  function removeLeg(id: string) {
    setLegs(current => current.filter(leg => leg.id !== id))
    setErrors({})
  }

  function updateMiles(key: keyof typeof miles, rawValue: string) {
    const amount = Number.parseInt(rawValue, 10)
    setMiles(current => ({ ...current, [key]: Number.isFinite(amount) ? Math.max(0, amount) : 0 }))
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const parsed = searchRequestSchema.safeParse({
      mode,
      legs: legs.map(({ origin, destination, departureDate }) => ({ origin, destination, departureDate })),
      cabin,
      adults,
      miles,
      flexibleDates,
    })

    if (!parsed.success) {
      const nextErrors: FormErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "form"
        nextErrors[key] ??= issue.message
      }
      setErrors(nextErrors)
      return
    }

    setErrors({})
    storePendingSearch(parsed.data)
    router.push("/results")
  }

  function loadDemoRoute() {
    const demo = searchRequestSchema.parse({
      mode,
      legs: initialLegs(mode).map(({ origin, destination, departureDate }) => ({
        origin,
        destination,
        departureDate,
      })),
      cabin: "business",
      adults: 1,
      miles: { iberiaAvios: 85000, baAvios: 0, qatarAvios: 0 },
      flexibleDates: false,
    })
    storePendingSearch(demo)
    router.push("/results")
  }

  return (
    <div className="mx-auto w-full max-w-6xl pb-16 pt-10 sm:pb-20 sm:pt-14">
      <div className="mb-8 max-w-2xl sm:mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
          {mode === "quick" ? "One route · one clear answer" : "Every stop · one considered plan"}
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-[-0.045em] text-brand-paper sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-base font-medium leading-7 text-muted-foreground sm:text-lg">
          {mode === "quick" ? "One route, one answer." : "Complete and detailed."}
        </p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          {mode === "quick"
            ? "Start with the flight you already have in mind."
            : "Add several stops and dates to uncover the biggest savings on complex trips."}
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <form onSubmit={submitSearch} noValidate className="flex flex-col gap-5">
        {errors.form && (
          <Alert variant="destructive">
            <AlertTitle>Check your trip details</AlertTitle>
            <AlertDescription>{errors.form}</AlertDescription>
          </Alert>
        )}
        {errors.legs && (
          <Alert variant="destructive">
            <AlertTitle>Check your itinerary</AlertTitle>
            <AlertDescription>{errors.legs}</AlertDescription>
          </Alert>
        )}

        <FieldSet className="rounded-3xl border border-white/10 bg-card/85 p-5 shadow-lg shadow-brand-ink/15 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <FieldLegend className="mb-0 text-lg font-semibold tracking-tight">
              {mode === "quick" ? "Your route" : "Your itinerary"}
            </FieldLegend>
            {mode === "trip" && (
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                {legs.length} of 3 legs
              </span>
            )}
          </div>

          <FieldGroup className="gap-4">
            <AnimatePresence initial={false}>
              {legs.map((leg, index) => (
                <motion.div
                  key={leg.id}
                  layout
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
                >
                  <FieldSet className="rounded-2xl border border-white/10 bg-brand-ink/45 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <FieldLegend variant="label" className="mb-0 font-semibold">
                    {mode === "quick" ? "Flight details" : `Leg ${index + 1}`}
                  </FieldLegend>
                  {mode === "trip" && legs.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-11"
                      aria-label={`Remove leg ${index + 1}`}
                      onClick={() => removeLeg(leg.id)}
                    >
                      <Cross2Icon data-icon="inline-start" aria-hidden="true" />
                    </Button>
                  )}
                </div>
                <FieldGroup className="grid gap-4 sm:grid-cols-3">
                  <TextField
                    id={`leg-${index}-origin`}
                    label="From · airport code"
                    value={leg.origin}
                    placeholder="MAD"
                    error={errors[`legs.${index}.origin`]}
                    onChange={value => updateLeg(index, "origin", value)}
                  />
                  <TextField
                    id={`leg-${index}-destination`}
                    label="To · airport code"
                    value={leg.destination}
                    placeholder="JNB"
                    error={errors[`legs.${index}.destination`]}
                    onChange={value => updateLeg(index, "destination", value)}
                  />
                  <TextField
                    id={`leg-${index}-date`}
                    label="Departure date"
                    type="date"
                    value={leg.departureDate}
                    error={errors[`legs.${index}.departureDate`]}
                    onChange={value => updateLeg(index, "departureDate", value)}
                  />
                </FieldGroup>
                  </FieldSet>
                </motion.div>
              ))}
            </AnimatePresence>
          </FieldGroup>

          {mode === "trip" && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={legs.length >= 3}
                onClick={addLeg}
              >
                <PlusIcon data-icon="inline-start" aria-hidden="true" />
                Add a stop
              </Button>
              <p className="text-xs text-muted-foreground">Up to 3 legs per plan</p>
            </div>
          )}
        </FieldSet>

        <FieldSet className="rounded-3xl border border-white/10 bg-card/85 p-5 shadow-lg shadow-brand-ink/15 sm:p-7">
          <FieldLegend className="text-lg font-semibold tracking-tight">
            Travellers & cabin
          </FieldLegend>
          <FieldGroup className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="cabin-class">Cabin class</FieldLabel>
              <Select value={cabin} onValueChange={value => setCabin(value as CabinClass)}>
                <SelectTrigger id="cabin-class" className="h-12 rounded-xl border-white/10 bg-brand-ink/55 text-base">
                  <SelectValue placeholder="Choose a cabin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {cabinOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldTitle>Adults</FieldTitle>
              <div role="group" aria-label="Number of adults" className="flex h-11 items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="size-11"
                  aria-label="Remove one adult"
                  disabled={adults <= 1}
                  onClick={() => setAdults(count => Math.max(1, count - 1))}
                >
                  <MinusIcon data-icon="inline-start" aria-hidden="true" />
                </Button>
                <output aria-live="polite" className="min-w-8 text-center font-semibold tabular-nums">
                  {adults}
                </output>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="size-11"
                  aria-label="Add one adult"
                  disabled={adults >= 4}
                  onClick={() => setAdults(count => Math.min(4, count + 1))}
                >
                  <PlusIcon data-icon="inline-start" aria-hidden="true" />
                </Button>
                <span className="text-sm text-muted-foreground">1–4 travellers</span>
              </div>
            </Field>
          </FieldGroup>

          <Field orientation="horizontal" className="mt-5 items-center justify-between rounded-2xl border border-white/10 bg-brand-ink/45 p-4">
            <FieldGroup className="gap-1">
              <FieldLabel htmlFor="flexible-dates">Flexible dates (±3 days)</FieldLabel>
              <FieldDescription>This is a UI preference; the sample uses the selected date.</FieldDescription>
            </FieldGroup>
            <Switch
              id="flexible-dates"
              checked={flexibleDates}
              onCheckedChange={setFlexibleDates}
              aria-label="Flexible dates"
            />
          </Field>
        </FieldSet>

        <details className="rounded-3xl border border-white/10 bg-card/85 px-5 py-4 shadow-lg shadow-brand-ink/10 sm:px-7">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-semibold [&::-webkit-details-marker]:hidden">
            Miles you already have
            <span className="text-xs font-medium text-muted-foreground">Optional</span>
          </summary>
          <FieldGroup className="mt-4 grid gap-4 sm:grid-cols-3">
            <MilesField
              id="iberia-avios"
              label="Iberia Avios"
              value={miles.iberiaAvios}
              onChange={value => updateMiles("iberiaAvios", value)}
            />
            <MilesField
              id="ba-avios"
              label="British Airways Avios"
              value={miles.baAvios}
              onChange={value => updateMiles("baAvios", value)}
            />
            <MilesField
              id="qatar-avios"
              label="Qatar Avios"
              value={miles.qatarAvios}
              onChange={value => updateMiles("qatarAvios", value)}
            />
          </FieldGroup>
        </details>

        <Field orientation="horizontal" className="items-center justify-between gap-4">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="min-h-11"
            onClick={loadDemoRoute}
          >
            Try demo route
          </Button>
          <Button type="submit" variant="primary" size="lg" className="min-h-12 rounded-full px-6">
            {mode === "quick" ? "See my savings" : "See trip savings"}
            <ArrowTopRightIcon data-icon="inline-end" aria-hidden="true" />
          </Button>
        </Field>
      </form>

      <aside aria-label="Live trip summary" className="flex flex-col gap-4 lg:sticky lg:top-24">
        <Card variant="dark" className="gap-0 overflow-hidden rounded-3xl">
          <CardHeader className="p-5 pb-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">Your details</p>
            <CardTitle className="mt-2 text-xl text-brand-paper">Trip snapshot</CardTitle>
            <CardDescription className="text-white/65">A live preview of the information you entered.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 p-5 pt-5">
            <div className="rounded-2xl border border-white/10 bg-brand-ink/25 p-4" aria-live="polite">
              <p className="text-xs font-medium text-white/60">Route</p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-brand-paper">
                {firstLeg?.origin || "Origin"} <span className="text-brand-gold">→</span> {lastLeg?.destination || "Destination"}
              </p>
              <p className="mt-2 text-xs text-white/60">
                {legs.length === 1 ? "One flight" : `${legs.length} flight legs`} · {adults} {adults === 1 ? "traveller" : "travellers"}
              </p>
            </div>
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-white/60">Cabin</dt>
                <dd className="font-medium capitalize text-brand-paper">{cabinOptions.find(option => option.value === cabin)?.label}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-white/60">Miles on hand</dt>
                <dd className="font-medium tabular-nums text-brand-paper">{totalMiles.toLocaleString("en-GB")}</dd>
              </div>
            </dl>
            <p className="border-t border-white/10 pt-4 text-xs leading-5 text-white/60">
              Availability and prices are illustrative. Confirm the final award and fees with the airline before booking.
            </p>
          </CardContent>
        </Card>

        <div className="rounded-3xl border border-brand-gold/15 bg-card/75 p-5">
          <p className="text-sm font-semibold text-brand-paper">No account needed to compare</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Sign in only if you want to keep a comparison in your travel notebook.</p>
        </div>
      </aside>
      </div>
    </div>
  )
}

interface MilesFieldProps {
  id: string
  label: string
  value: number
  onChange: (value: string) => void
}

function MilesField({ id, label, value, onChange }: MilesFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        type="number"
        min={0}
        max={1000000}
        step={1000}
        inputMode="numeric"
        value={value}
        className={cn("h-12 rounded-xl border-white/10 bg-brand-ink/55 px-4 text-base")}
        onChange={event => onChange(event.currentTarget.value)}
      />
    </Field>
  )
}
