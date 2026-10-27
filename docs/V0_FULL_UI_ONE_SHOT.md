# v0 � one-shot full UI prompt

**Before paste:** v0 **GitHub disconnected** (ZIP only). Use **Switch to Folder-3** or current project with existing `SiteHeader`, `PageEnter`, cream/espresso/orange tokens.

**After export:** ZIP ? local repo ? your commits ? push once.

---

## Paste this entire block into v0

```
Continue and COMPLETE the "A Una Milla" travel-hacking app in this Next.js 14 App Router codebase. Keep existing design tokens (--brand-cream #F9F6F1, espresso #231B15, burnt orange #C07848), SiteHeader, PageEnter, Button, Card, sonner toasts, framer-motion. Product: "Same trip. Much less money." � compare NORMAL cash vs HACKED (miles + taxes), show � savings, explain why, guide booking on airline sites (no in-app payment).

SCOPE: Ship the FULL hackathon UI in one pass. Remove marketing placeholders. Hide old AI-chat demo from navigation (no links to /chat, /login, /signup in header; optional redirect those routes to /). Focus 100% on travel flows below.

---

PAGES & ROUTES

1) `/` � Landing "Two ways in"
   - Hero: "A Una Milla", "Same trip. Much less money.", "Travel hacking, made simple."
   - Two large animated cards: Quick flight ? /quick (cream) | Full trip plan ? /trip (dark espresso card)
   - Footer: @aunamilladetudestino
   - Staggered motion on cards

2) `/quick` � Quick flight search (client form)
   - Fields: origin IATA (default MAD), destination (default JNB), departure date, cabin (economy/premium/business/first), adults 1�4
   - Collapsible "Miles you already have": Iberia Avios, BA Avios, Qatar Avios (numbers)
   - Optional: flexible dates toggle (�3 days) � UI only, label "We'll check nearby dates"
   - CTAs: primary "See my savings" ? navigates to /results with query params; secondary "Try demo route" (MAD?JNB business)
   - On submit: call searchApi() (see lib/api.ts) with loading skeleton; on error show friendly retry + "Use demo data" fallback

3) `/trip` � Full trip plan (client form, max 3 legs)
   - Repeatable leg rows: origin, destination, date; add/remove leg (max 3)
   - Shared: adults, cabin, miles balances section
   - CTA "See trip savings" ? /results?mode=trip
   - Copy: "Where the biggest savings usually are"

4) `/results` � HERO jury screen (client)
   - Load from searchApi or fixture; read URL params
   - SavingsHero: animated count-up � saved + % pill + headline
   - PriceCompare: Normal � vs Hacked � with miles/taxes breakdown, program badge (e.g. Iberia Avios)
   - DataSourceBadge: sample | cached | live
   - Disclaimer callout (award not confirmed)
   - "Why this works" � explain.summary (+ optional centsPerMile)
   - BookingSteps � numbered timeline, external links open new tab
   - HackAlternatives � horizontal scroll cards
   - If recommendation pay_cash: savings �0, different headline, muted hacked card
   - Sticky mobile action bar: Save trip | Search again
   - Link "Show pay-cash example" toggles second mock (for demo)

5) `/saved` � Saved trips dashboard
   - Read trips from localStorage + future GET /api/trips (wire lib/api.ts listTrips)
   - Cards: route, date, � saved, date saved; empty state CTA to /quick
   - Header stat: "Total saved" sum of savingsEur

6) `/health-ui` (optional dev-only page) � shows "API: ok" when fetch /api/health succeeds else offline badge

---

DATA & API LAYER (UI-ready for Supabase/backend later)

Create `lib/search-types.ts` � TypeScript types matching SearchResponse below.

Create `fixtures/sample-search-response.json` and `fixtures/sample-pay-cash-response.json` in repo.

Create `lib/device-id.ts` � getOrCreateDeviceId() in localStorage.

Create `lib/api.ts`:
- search(payload): POST `/api/search` JSON; if fails or NEXT_PUBLIC_USE_FIXTURE=true, return sample fixture after 400ms delay (simulate network)
- explain(payload): POST `/api/explain` optional; fallback to fixture explain
- saveTrip(trip): POST `/api/trips` with header X-Device-Id; always mirror to localStorage on success/failure
- listTrips(): GET `/api/trips` with X-Device-Id; merge with localStorage fallback
- health(): GET `/api/health`

Create stub Route Handlers so UI works end-to-end without external keys:
- `app/api/health/route.ts` ? { ok: true }
- `app/api/search/route.ts` ? return sample JSON (MAD?JNB business) or pay-cash if query flag; accept mode quick|trip
- `app/api/explain/route.ts` ? return { summary: from fixture }
- `app/api/trips/route.ts` ? in-memory or read body; return saved list (simple JSON store in globalThis for demo)

Use Zod to validate API responses in client.

---

SearchResponse shape (implement exactly):

{
  "mode": "quick",
  "route": { "origin", "originCity", "destination", "destinationCity", "departureDate", "cabin", "adults" },
  "cash": { "amountEur", "label", "dataSource", "note?" },
  "hacked": { "amountEur", "label", "hackTitle", "hackType?", "breakdown": { "milesRequired", "program", "taxesEur" } },
  "savings": { "amountEur", "percent", "recommendation": "use_miles"|"pay_cash", "headline" },
  "explain": { "summary", "centsPerMile?" },
  "disclaimer": string,
  "bookingSteps": [{ "step", "title", "body", "href", "external?" }],
  "alternativeHacks": [{ "title", "savingsEur", "note", "hackType?" }]
}

Demo values MAD?JNB business: cash 2840, hacked 612 (85000 Avios + 412 taxes), savings 2228, 78%.

---

COMPONENTS (split cleanly)

components/SiteHeader.tsx � update nav: Home, Quick flight, Full trip, Saved
components/SavingsHero.tsx, PriceCompare.tsx, DataSourceBadge.tsx, BookingSteps.tsx, HackAlternatives.tsx, ResultsActionBar.tsx, SearchFormQuick.tsx, SearchFormTrip.tsx, SavingsSkeleton.tsx, ErrorBanner.tsx

---

UX / MOTION

- One strong animation: savings � count-up (~1.2s) on results only
- PageEnter fade on route changes; card hover lift on landing
- No slow spinners on forms � skeleton on results while loading
- Mobile-first, 44px tap targets, sticky results bar on sm breakpoint down
- sonner toast on save trip success/failure

---

TECH

- TypeScript strict-friendly, eslint clean
- engines node 22.x in package.json
- Do NOT add paid APIs or env secrets; document .env.example: NEXT_PUBLIC_USE_FIXTURE=true, NEXT_PUBLIC_API_URL optional (same-origin default)
- No purple gradients; premium fintech travel aesthetic
- Ensure `pnpm run build` passes

Deliver the complete navigable app: every link works, demo path never breaks, API stubs return fixture data until backend/Supabase is connected later.
```
