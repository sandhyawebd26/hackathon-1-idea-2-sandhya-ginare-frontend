import type { Metadata } from "next"

import { PageEnter } from "@/components/PageEnter"
import { PlanExperience } from "@/components/PlanExperience"

export const metadata: Metadata = {
  title: "Plan ahead & earn",
  description: "Calculate how many months of everyday spending you need to earn your flight redemption in miles.",
}

export default function PlanAheadPage() {
  return (
    <PageEnter className="flex flex-1 flex-col">
      <PlanExperience />
    </PageEnter>
  )
}
