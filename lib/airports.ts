export interface Airport {
  code: string
  name: string
  city: string
  country: string
  flag: string
  region: "spain" | "europe" | "americas" | "asia_middle_east" | "africa"
  isHub?: boolean
  popular?: boolean
}

export const AIRPORTS: Airport[] = [
  // Spanish Hubs
  { code: "MAD", city: "Madrid", name: "Adolfo Suárez Barajas", country: "Spain", flag: "🇪🇸", region: "spain", isHub: true, popular: true },
  { code: "BCN", city: "Barcelona", name: "El Prat", country: "Spain", flag: "🇪🇸", region: "spain", isHub: true, popular: true },
  { code: "VLC", city: "Valencia", name: "Manises", country: "Spain", flag: "🇪🇸", region: "spain", popular: true },
  { code: "AGP", city: "Málaga", name: "Costa del Sol", country: "Spain", flag: "🇪🇸", region: "spain", popular: true },
  { code: "BIO", city: "Bilbao", name: "Loiu", country: "Spain", flag: "🇪🇸", region: "spain" },
  { code: "PMI", city: "Palma de Mallorca", name: "Son Sant Joan", country: "Spain", flag: "🇪🇸", region: "spain" },
  { code: "SVQ", city: "Seville", name: "San Pablo", country: "Spain", flag: "🇪🇸", region: "spain" },
  { code: "ALC", city: "Alicante", name: "Elche", country: "Spain", flag: "🇪🇸", region: "spain" },

  // Americas
  { code: "MIA", city: "Miami", name: "Miami International", country: "United States", flag: "🇺🇸", region: "americas", popular: true },
  { code: "JFK", city: "New York", name: "John F. Kennedy", country: "United States", flag: "🇺🇸", region: "americas", popular: true },
  { code: "BOS", city: "Boston", name: "Logan International", country: "United States", flag: "🇺🇸", region: "americas" },
  { code: "ORD", city: "Chicago", name: "O'Hare International", country: "United States", flag: "🇺🇸", region: "americas" },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles International", country: "United States", flag: "🇺🇸", region: "americas", popular: true },
  { code: "SFO", city: "San Francisco", name: "San Francisco International", country: "United States", flag: "🇺🇸", region: "americas" },
  { code: "EZE", city: "Buenos Aires", name: "Ministro Pistarini Ezeiza", country: "Argentina", flag: "🇦🇷", region: "americas", popular: true },
  { code: "BOG", city: "Bogotá", name: "El Dorado", country: "Colombia", flag: "🇨🇴", region: "americas", popular: true },
  { code: "MEX", city: "Mexico City", name: "Benito Juárez", country: "Mexico", flag: "🇲🇽", region: "americas", popular: true },
  { code: "GRU", city: "São Paulo", name: "Guarulhos International", country: "Brazil", flag: "🇧🇷", region: "americas" },
  { code: "SCL", city: "Santiago", name: "Arturo Merino Benítez", country: "Chile", flag: "🇨🇱", region: "americas" },
  { code: "LIM", city: "Lima", name: "Jorge Chávez International", country: "Peru", flag: "🇵🇪", region: "americas" },

  // Europe
  { code: "LHR", city: "London", name: "Heathrow", country: "United Kingdom", flag: "🇬🇧", region: "europe", isHub: true, popular: true },
  { code: "LGW", city: "London", name: "Gatwick", country: "United Kingdom", flag: "🇬🇧", region: "europe" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France", flag: "🇫🇷", region: "europe", isHub: true, popular: true },
  { code: "FCO", city: "Rome", name: "Leonardo da Vinci–Fiumicino", country: "Italy", flag: "🇮🇹", region: "europe", popular: true },
  { code: "AMS", city: "Amsterdam", name: "Schiphol", country: "Netherlands", flag: "🇳🇱", region: "europe", popular: true },
  { code: "FRA", city: "Frankfurt", name: "Frankfurt am Main", country: "Germany", flag: "🇩🇪", region: "europe" },
  { code: "LIS", city: "Lisbon", name: "Humberto Delgado", country: "Portugal", flag: "🇵🇹", region: "europe" },

  // Asia & Middle East
  { code: "NRT", city: "Tokyo", name: "Narita International", country: "Japan", flag: "🇯🇵", region: "asia_middle_east", popular: true },
  { code: "HND", city: "Tokyo", name: "Haneda", country: "Japan", flag: "🇯🇵", region: "asia_middle_east" },
  { code: "DOH", city: "Doha", name: "Hamad International", country: "Qatar", flag: "🇶🇦", region: "asia_middle_east", isHub: true, popular: true },
  { code: "DXB", city: "Dubai", name: "Dubai International", country: "United Arab Emirates", flag: "🇦🇪", region: "asia_middle_east", isHub: true, popular: true },
  { code: "SIN", city: "Singapore", name: "Changi", country: "Singapore", flag: "🇸🇬", region: "asia_middle_east" },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi", country: "Thailand", flag: "🇹🇭", region: "asia_middle_east" },

  // Africa
  { code: "JNB", city: "Johannesburg", name: "O.R. Tambo International", country: "South Africa", flag: "🇿🇦", region: "africa", popular: true },
  { code: "CPT", city: "Cape Town", name: "Cape Town International", country: "South Africa", flag: "🇿🇦", region: "africa", popular: true },
  { code: "CAI", city: "Cairo", name: "Cairo International", country: "Egypt", flag: "🇪🇬", region: "africa" },
  { code: "RAK", city: "Marrakech", name: "Menara", country: "Morocco", flag: "🇲🇦", region: "africa" },
]

export const SPANISH_HUBS = AIRPORTS.filter(a => a.region === "spain")
export const POPULAR_DESTINATIONS = AIRPORTS.filter(a => a.popular && a.region !== "spain")

export function getAirport(code: string): Airport | undefined {
  const normalized = code.trim().toUpperCase()
  return AIRPORTS.find(a => a.code === normalized)
}

export function searchAirports(query: string): Airport[] {
  const q = query.trim().toLowerCase()
  if (!q) return AIRPORTS
  return AIRPORTS.filter(
    a =>
      a.code.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q),
  )
}
