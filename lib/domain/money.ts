export function eurosToMinor(euros: number): number {
  return Math.round(euros * 100)
}

export function minorToEuros(minor: number): number {
  return Math.round(minor) / 100
}

export function percentSaving(cashMinor: number, savingsMinor: number): number {
  if (cashMinor <= 0) return 0
  return Math.round((savingsMinor / cashMinor) * 1000) / 10
}

export function assertSafeInt(n: number): number {
  if (!Number.isSafeInteger(n)) {
    throw new Error("Amount is not a safe integer")
  }
  return n
}
