import { Skeleton } from "@/components/ui/skeleton"

export default function ChatLoading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 py-10" aria-busy="true" aria-label="Loading chat">
      <Skeleton className="ml-auto h-16 w-2/3 rounded-2xl" />
      <Skeleton className="h-24 w-4/5 rounded-2xl" />
      <Skeleton className="h-16 w-1/2 rounded-2xl" />
    </div>
  )
}
