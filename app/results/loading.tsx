import { ResultsSkeleton } from "@/components/results/ResultsSkeleton"

export default function ResultsLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl py-8 sm:py-12" aria-busy="true" aria-label="Loading comparison">
      <ResultsSkeleton />
    </div>
  )
}
