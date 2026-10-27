import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface ErrorBannerProps {
  message: string
  onUseDemoData: () => void
}

export function ErrorBanner({ message, onUseDemoData }: ErrorBannerProps) {
  return (
    <Alert variant="destructive">
      <AlertTitle>We couldn’t build this comparison</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>{message}</span>
        <Button type="button" variant="secondary" size="sm" className="min-h-11" onClick={onUseDemoData}>
          Use demo data
        </Button>
      </AlertDescription>
    </Alert>
  )
}
