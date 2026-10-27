import type { Metadata } from "next"

import { FlightSearchForm } from "@/components/FlightSearchForm"
import { PageEnter } from "@/components/PageEnter"

export const metadata: Metadata = {
  title: "Quick flight",
  description: "Compare a flight route with a simple travel-hacking example.",
}

export default function QuickFlightPage() {
  return (
    <PageEnter className="flex flex-1 flex-col">
      <FlightSearchForm key="quick" mode="quick" />
    </PageEnter>
  )
}
