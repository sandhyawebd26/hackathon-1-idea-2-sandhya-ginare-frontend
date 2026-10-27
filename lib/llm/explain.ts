import { serverEnv } from "@/lib/server/env"
import { proseUsesOnlyAllowedNumbers } from "@/lib/llm/validator"

export type ExplainInput = {
  origin: string
  destination: string
  cashEur: number
  hackedEur: number
  savingsEur: number
  percent: number
  milesRequired: number
  taxesEur: number
  program: string
  verdict: "use_miles" | "pay_cash"
}

export function templateExplain(input: ExplainInput): string {
  if (input.verdict === "pay_cash") {
    return `On ${input.origin}–${input.destination}, cash is the better deal. The award taxes or points cost do not beat €${input.cashEur}.`
  }
  return `Cash on ${input.origin}–${input.destination} is about €${input.cashEur}. ${input.program} asks ${input.milesRequired} miles plus €${input.taxesEur} taxes (€${input.hackedEur} out of pocket). That is about €${input.savingsEur} less (${input.percent}%). Confirm a seat on the airline before you transfer points.`
}

function allowedNumbers(input: ExplainInput): number[] {
  return [
    input.cashEur,
    input.hackedEur,
    input.savingsEur,
    input.percent,
    input.milesRequired,
    input.taxesEur,
  ]
}

async function geminiRephrase(prompt: string, key: string): Promise<string | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 180 },
    }),
  })
  if (!response.ok) return null
  const json = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }
  return json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null
}

async function groqRephrase(prompt: string, key: string): Promise<string | null> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      max_tokens: 180,
      messages: [{ role: "user", content: prompt }],
    }),
  })
  if (!response.ok) return null
  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  return json.choices?.[0]?.message?.content?.trim() ?? null
}

export async function explainTrip(input: ExplainInput): Promise<{
  summary: string
  source: "template" | "gemini" | "groq"
}> {
  const template = templateExplain(input)
  const env = serverEnv()
  if (!env.aiEnabled) {
    return { summary: template, source: "template" }
  }

  const prompt = `Rewrite this in two short sentences. Do not add, change, or omit any numbers:\n\n${template}`

  if (env.geminiKey) {
    try {
      const text = await geminiRephrase(prompt, env.geminiKey)
      if (text && proseUsesOnlyAllowedNumbers(text, allowedNumbers(input))) {
        return { summary: text, source: "gemini" }
      }
    } catch {
      /* fallback */
    }
  }

  if (env.groqKey) {
    try {
      const text = await groqRephrase(prompt, env.groqKey)
      if (text && proseUsesOnlyAllowedNumbers(text, allowedNumbers(input))) {
        return { summary: text, source: "groq" }
      }
    } catch {
      /* fallback */
    }
  }

  return { summary: template, source: "template" }
}
