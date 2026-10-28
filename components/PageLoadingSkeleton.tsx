import { Skeleton } from "@/components/ui/skeleton"

export function PageLoadingSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-10 sm:py-14" aria-busy="true" aria-label="Loading page">
      <Skeleton className="h-8 w-56 rounded-xl" />
      <Skeleton className="h-12 w-full max-w-2xl rounded-xl" />
      <Skeleton className="h-5 w-full max-w-xl rounded-lg" />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    </div>
  )
}
