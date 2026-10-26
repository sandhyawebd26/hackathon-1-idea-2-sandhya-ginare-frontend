# A Una Milla — Frontend

**Hackathon 1 · Idea 2** — Web app for *A Una Milla de Tu Destino*: **Same trip. Much less money.** Users compare **normal vs hacked** trip cost and see **savings in EUR**, then follow **booking steps** on airline sites (no in-app ticketing).

| | |
|---|---|
| **Repo** | [hackathon-1-idea-2-sandhya-ginare-frontend](https://github.com/sandhyawebd26/hackathon-1-idea-2-sandhya-ginare-frontend) |
| **Backend** | [hackathon-1-idea-2-sandhya-ginare-backend](https://github.com/sandhyawebd26/hackathon-1-idea-2-sandhya-ginare-backend) |
| **Live** | `https://<your-project>.vercel.app` *(add after deploy)* |

---

## Stack

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS**
- **Framer Motion** — savings count-up, card entrance (keep forms snappy)
- **Vercel** Hobby — frontend only; secrets stay on the API

**Design:** cream `#F9F6F1`, espresso `#231B15`, accent `#C07848`. Savings must dominate the results screen.

---

## 5–6 hour sprint

**Recommended stack:** This repo = **Next.js on Vercel** + **`app/api/*`** + **[Supabase](https://supabase.com)** Postgres (cache + saved trips). Faster than a separate Render API (no cold start on demo clicks).

See **[docs/HACKATHON_6H_PLAN.md](./docs/HACKATHON_6H_PLAN.md)** for Supabase SQL, env vars, and hour-by-hour tasks.

Backend repo: optional Render `/health` only; **real API lives here** in `/app/api` for the sprint.

## Start UI from v0 (5 prompts / day)

1. Run **[docs/V0_PROMPT.md](./docs/V0_PROMPT.md)** prompts **1 → 5** (one per v0 message).
2. Commit after each merge using the commit message under each prompt.
3. Wire **[fixtures/sample-search-response.json](./fixtures/sample-search-response.json)** after prompt 5.

---

## Flows (MVP)

| Route | Purpose |
|-------|---------|
| `/` | Two ways in — Quick flight vs Full trip |
| `/quick` | Origin, destination, date, cabin, optional miles balances |
| `/results` | € saved, cash vs hacked, why, booking steps |
| `/trip` | Full trip (multi-leg) — after MVP shell |

---

## Environment

Copy `.env.example` → `.env.local`.

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Render API base URL, no trailing slash |
| `NEXT_PUBLIC_USE_FIXTURE` | `true` = skip API, use fixture JSON |

---

## Local dev

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy (Vercel)

1. Import this GitHub repo → **Next.js** → deploy `main`.
2. Set `NEXT_PUBLIC_API_URL` to your Render backend URL.
3. Set backend `CORS_ORIGIN` to this Vercel URL.

---

## Integration later

- `POST /search` on backend → replace fixture in `/results`.
- Header `X-Device-Id` from `localStorage` for saved trips.

See backend README for API contract.
