import { Skeleton } from "@/components/ui/skeleton"

export function ResultsSkeleton() {
  return (
    <div role="status" aria-live="polite" className="mx-auto flex w-full max-w-6xl flex-col gap-7 pb-36 pt-10 sm:pb-12">
      <span className="sr-only">Loading your flight comparison</span>
      <Skeleton className="h-56 w-full rounded-3xl" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-72 rounded-3xl" />
        <Skeleton className="h-72 rounded-3xl" />
      </div>
      <Skeleton className="h-32 w-full rounded-3xl" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-48 rounded-3xl" />
      </div>
    </div>
  )
}
