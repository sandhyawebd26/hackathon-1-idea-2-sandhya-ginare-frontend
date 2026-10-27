import Link from "next/link"
import { BookmarkIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"

interface ResultsActionBarProps {
  isSaved: boolean
  isSaving: boolean
  isAuthLoading: boolean
  onSave: () => void
}

export function ResultsActionBar({ isSaved, isSaving, isAuthLoading, onSave }: ResultsActionBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-lg backdrop-blur sm:static sm:z-auto sm:mt-8 sm:border-0 sm:bg-transparent sm:p-0 sm:pb-0 sm:shadow-none sm:backdrop-blur-0">
      <div className="mx-auto flex max-w-6xl gap-3 sm:justify-end">
        <Button asChild variant="secondary" size="lg" className="min-h-11 flex-1 sm:flex-none">
          <Link href="/quick">Search again</Link>
        </Button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="min-h-11 flex-1 sm:flex-none"
          disabled={isSaved || isSaving || isAuthLoading}
          onClick={onSave}
        >
          <BookmarkIcon data-icon="inline-start" aria-hidden="true" />
          {isAuthLoading ? "Checking…" : isSaving ? "Saving…" : isSaved ? "Saved" : "Save trip"}
        </Button>
      </div>
    </div>
  )
}
