"use client"

import { motion } from "framer-motion"
import { Building2, ExternalLink, Gift, Sparkles, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface HotelDeal {
  id: string
  name: string
  city: string
  rating: number
  pricePerNightEur: number
  aviosBonus: number
  partnerProgram: string
  bookingUrl: string
}

export interface HotelDealsCardProps {
  destinationCity: string
  deals?: HotelDeal[]
}

const defaultDeals: HotelDeal[] = [
  {
    id: "hotel-1",
    name: "The Silo Waterfront Hotel",
    city: "Cape Town",
    rating: 4.9,
    pricePerNightEur: 295,
    aviosBonus: 12500,
    partnerProgram: "Iberia Plus Hotels / Rocketmiles",
    bookingUrl: "https://www.iberia.com",
  },
  {
    id: "hotel-2",
    name: "Cape Grace & Spa",
    city: "Cape Town",
    rating: 4.8,
    pricePerNightEur: 240,
    aviosBonus: 8200,
    partnerProgram: "Booking.com Avios Partner",
    bookingUrl: "https://www.iberia.com",
  },
]

export function HotelDealsCard({
  destinationCity = "Cape Town / Johannesburg",
  deals = defaultDeals,
}: Partial<HotelDealsCardProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="my-3 w-full max-w-2xl overflow-hidden rounded-2xl border border-border/90 bg-card p-5 shadow-md sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <Building2 className="size-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-espresso">
              Partner Hotel Point Accelerators
            </h3>
            <p className="text-xs text-muted-foreground">
              Earn thousands of Avios for your flights by booking partner hotels in {destinationCity}
            </p>
          </div>
        </div>
        <Badge className="border-emerald-300 bg-emerald-50 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          Up to +12,500 Avios
        </Badge>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {deals.map(hotel => (
          <div
            key={hotel.id}
            className="flex flex-col justify-between gap-3 rounded-xl border border-border/80 bg-background/60 p-4 transition-colors hover:border-primary/40 sm:flex-row sm:items-center"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-espresso">{hotel.name}</span>
                <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-600">
                  <Star className="size-3 fill-amber-500 text-amber-500" /> {hotel.rating}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {hotel.city} · {hotel.partnerProgram}
              </span>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-sm font-semibold text-espresso">
                  €{hotel.pricePerNightEur}/night
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 sm:items-end">
              <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <Gift className="size-3" /> +{hotel.aviosBonus.toLocaleString()} Avios bonus
              </span>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 rounded-lg border-border text-xs"
              >
                <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer">
                  <span>View Deal</span>
                  <ExternalLink className="size-3" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
