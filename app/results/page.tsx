import type { Metadata } from "next"

import { ResultsExperience } from "@/components/ResultsExperience"

export const metadata: Metadata = {
  title: "Your flight comparison",
  description: "See the cash fare, miles option, and next steps for your trip.",
}

export default function ResultsPage() {
  return <ResultsExperience />
}
