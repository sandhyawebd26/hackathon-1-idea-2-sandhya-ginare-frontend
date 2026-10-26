import type { Metadata } from "next"

import { FlightSearchForm } from "@/components/FlightSearchForm"
import { PageEnter } from "@/components/PageEnter"

export const metadata: Metadata = {
  title: "Full trip plan",
  description: "Plan several stops and compare the savings across your whole trip.",
}

export default function FullTripPage() {
  return (
    <PageEnter className="flex flex-1 flex-col">
      <FlightSearchForm key="trip" mode="trip" />
    </PageEnter>
  )
}
