const NUMBER = /-?\d+(?:[.,]\d+)?/g

export function extractNumbers(text: string): string[] {
  return (text.match(NUMBER) ?? []).map(value => value.replace(",", "."))
}

export function proseUsesOnlyAllowedNumbers(prose: string, allowed: number[]): boolean {
  const allowedSet = new Set(
    allowed.flatMap(n => [String(n), n.toFixed(0), n.toFixed(1), n.toFixed(2)]),
  )
  return extractNumbers(prose).every(token => {
    const asNum = Number.parseFloat(token)
    if (!Number.isFinite(asNum)) return false
    return allowedSet.has(token) || allowed.some(n => Math.abs(n - asNum) < 0.05)
  })
}
