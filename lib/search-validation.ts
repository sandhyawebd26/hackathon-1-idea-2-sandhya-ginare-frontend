import { z } from "zod"

const airportCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, "Use a valid three-letter airport code.")

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid travel date.")
  .refine(value => !Number.isNaN(Date.parse(`${value}T12:00:00`)), "Choose a valid travel date.")

const legSchema = z
  .object({
    origin: airportCodeSchema,
    destination: airportCodeSchema,
    departureDate: dateSchema,
  })
  .refine(leg => leg.origin !== leg.destination, {
    message: "Choose two different airports.",
    path: ["destination"],
  })

export const searchRequestSchema = z
  .object({
    mode: z.enum(["quick", "trip"]),
    legs: z.array(legSchema).min(1).max(3),
    cabin: z.enum(["economy", "premium_economy", "business", "first"]),
    adults: z.number().int().min(1).max(4),
    miles: z.object({
      iberiaAvios: z.number().int().min(0).max(1_000_000),
      baAvios: z.number().int().min(0).max(1_000_000),
      qatarAvios: z.number().int().min(0).max(1_000_000),
    }),
    flexibleDates: z.boolean().default(false),
    payCash: z.boolean().optional(),
  })
  .superRefine((request, context) => {
    if (request.mode === "quick" && request.legs.length !== 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Quick flight searches need exactly one route.",
        path: ["legs"],
      })
    }

    if (request.mode === "trip" && request.legs.length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A full trip plan needs at least two legs.",
        path: ["legs"],
      })
    }
  })

export const savedTripSchema = z.object({
  id: z.string().min(8).max(80),
  mode: z.enum(["quick", "trip"]),
  routeSummary: z.string().trim().min(3).max(140),
  departureDate: dateSchema,
  savingsEur: z.number().finite().min(0).max(1_000_000),
  savedAt: z.string().datetime(),
  recommendation: z.enum(["use_miles", "pay_cash"]),
})

export type ValidatedSearchRequest = z.infer<typeof searchRequestSchema>
