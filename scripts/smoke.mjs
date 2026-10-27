#!/usr/bin/env node
/**
 * Demo smoke � run against local dev (`npm run dev`) or set SMOKE_BASE_URL.
 * Usage: SMOKE_BASE_URL=https://your-app.vercel.app node scripts/smoke.mjs
 */
const base = (process.env.SMOKE_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "")

const checks = []

async function get(path) {
  const res = await fetch(`${base}${path}`, { cache: "no-store" })
  const text = await res.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    // html routes
  }
  return { ok: res.ok, status: res.status, json, text }
}

async function post(path, body) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  })
  const json = await res.json().catch(() => null)
  return { ok: res.ok, status: res.status, json }
}

async function main() {
  const health = await get("/api/health")
  checks.push({
    name: "GET /api/health",
    pass: health.ok && health.json?.ok === true,
    detail: health.status,
  })

  const search = await post("/api/search", {
    mode: "quick",
    legs: [{ origin: "MAD", destination: "JNB", departureDate: "2026-11-15" }],
    cabin: "business",
    adults: 1,
    miles: { iberiaAvios: 0, baAvios: 0, qatarAvios: 0 },
    flexibleDates: false,
  })
  checks.push({
    name: "POST /api/search MAD�JNB",
    pass: search.ok && search.json?.ok === true && search.json?.data?.savings,
    detail: search.status,
  })

  const cards = await get("/api/cards")
  checks.push({
    name: "GET /api/cards",
    pass: cards.ok && Array.isArray(cards.json?.data) && cards.json.data.length > 0,
    detail: cards.status,
  })

  for (const route of ["/", "/quick", "/plan", "/login"]) {
    const page = await get(route)
    checks.push({
      name: `GET ${route}`,
      pass: page.ok && page.text.includes("<!DOCTYPE html"),
      detail: page.status,
    })
  }

  const failed = checks.filter(c => !c.pass)
  for (const c of checks) {
    console.log(c.pass ? "?" : "?", c.name, `(${c.detail})`)
  }

  if (failed.length) {
    console.error(`\n${failed.length} check(s) failed against ${base}`)
    process.exit(1)
  }
  console.log(`\nAll ${checks.length} smoke checks passed (${base}).`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
