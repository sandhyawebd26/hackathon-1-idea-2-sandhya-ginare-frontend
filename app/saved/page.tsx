import type { Metadata } from "next"

import { PageEnter } from "@/components/PageEnter"
import { SavedTripsExperience } from "@/components/SavedTripsExperience"

export const metadata: Metadata = {
  title: "Saved trips",
  description: "Return to your saved flight comparisons and travel savings.",
}

export default function SavedTripsPage() {
  return (
    <PageEnter className="flex flex-1 flex-col">
      <SavedTripsExperience />
    </PageEnter>
  )
}
