/** Demo redemption targets aligned with fixtures / avios chart (illustrative). */
export type PresetRoute = {
  id: string
  name: string
  origin: string
  destination: string
  cabin: string
  milesRequired: number
  typicalCashEur: number
  program: string
  departureDate: string
}

export const presetRoutes: PresetRoute[] = [
  {
    id: "mad-jnb",
    name: "Madrid (MAD) ? Johannesburg (JNB)",
    origin: "MAD",
    destination: "JNB",
    cabin: "Business class",
    milesRequired: 85000,
    typicalCashEur: 2840,
    program: "Iberia Avios",
    departureDate: "2026-11-15",
  },
  {
    id: "bcn-jfk",
    name: "Barcelona (BCN) ? New York (JFK)",
    origin: "BCN",
    destination: "JFK",
    cabin: "Business class",
    milesRequired: 68000,
    typicalCashEur: 2410,
    program: "Iberia / LEVEL Avios",
    departureDate: "2026-08-04",
  },
  {
    id: "mad-eze",
    name: "Madrid (MAD) ? Buenos Aires (EZE)",
    origin: "MAD",
    destination: "EZE",
    cabin: "Business class",
    milesRequired: 90000,
    typicalCashEur: 3100,
    program: "Iberia Avios",
    departureDate: "2026-12-01",
  },
  {
    id: "mad-lhr",
    name: "Madrid (MAD) ? London (LHR)",
    origin: "MAD",
    destination: "LHR",
    cabin: "Economy / Club Europe",
    milesRequired: 15000,
    typicalCashEur: 260,
    program: "Iberia / BA Avios",
    departureDate: "2026-09-10",
  },
]
