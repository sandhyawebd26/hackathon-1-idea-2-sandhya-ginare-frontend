import type { Metadata } from "next"

import { PageEnter } from "@/components/PageEnter"
import { PricingExperience } from "@/components/PricingExperience"

export const metadata: Metadata = {
  title: "Subscription Plans & API Limits",
  description: "Compare subscription plans, API usage limits, and enterprise search horizons for A Una Milla.",
}

export default function PricingPage() {
  return (
    <PageEnter className="flex flex-1 flex-col">
      <PricingExperience />
    </PageEnter>
  )
}
