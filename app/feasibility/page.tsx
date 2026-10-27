import type { Metadata } from "next"

import { FeasibilityIntelligence } from "@/components/FeasibilityIntelligence"
import { PageEnter } from "@/components/PageEnter"

export const metadata: Metadata = {
  title: "API Costs, Feasibility & Partner Comparison",
  description: "Enterprise API comparison, operating feasibility, and loyalty program mapping for A Una Milla.",
}

export default function FeasibilityPage() {
  return (
    <PageEnter className="flex flex-1 flex-col">
      <FeasibilityIntelligence />
    </PageEnter>
  )
}
