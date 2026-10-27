'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[App Error]', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center px-4">
      <h2 className="text-xl font-semibold text-espresso">Something went wrong</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        {error?.message || 'An error occurred while loading this page.'}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  )
}
