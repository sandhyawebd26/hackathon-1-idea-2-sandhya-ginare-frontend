import { Badge } from "@/components/ui/badge"
import { DataSourceBadge } from "@/components/results/DataSourceBadge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatEuro } from "@/lib/route-label"
import type { SearchResponse } from "@/lib/search-types"
import { cn } from "@/lib/utils"

interface PriceComparisonProps {
  result: SearchResponse
  isCashExample: boolean
  onToggleCashExample: () => void
}

export function PriceComparison({
  result,
  isCashExample,
  onToggleCashExample,
}: PriceComparisonProps) {
  return (
    <section aria-labelledby="comparison-heading" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            The comparison
          </p>
          <h2 id="comparison-heading" className="mt-2 text-2xl font-semibold tracking-tight text-espresso sm:text-3xl">
            Normal vs. Hacked
          </h2>
        </div>
        <Button type="button" variant="link" size="sm" className="min-h-11 px-2" onClick={onToggleCashExample}>
          {isCashExample ? "Return to miles example" : "Show pay-cash example"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card variant="cream" className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-xl">Normal</CardTitle>
              <DataSourceBadge source={result.cash.dataSource} />
            </div>
            <CardDescription className="text-muted-foreground">
              {result.cash.label}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-2">
            <p className={cn(
              "text-4xl font-semibold tracking-tight tabular-nums text-espresso sm:text-5xl",
              !isCashExample && "line-through decoration-primary decoration-2",
            )}>
              {formatEuro(result.cash.amountEur)}
            </p>
            <p className="text-sm text-muted-foreground">Paid entirely in cash</p>
            {result.cash.note && (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.cash.note}</p>
            )}
          </CardContent>
          <CardFooter>
            <span className="text-sm font-medium text-muted-foreground">Standard booking</span>
          </CardFooter>
        </Card>

        <Card variant="dark" className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-xl text-white">
                {isCashExample ? "Pay cash" : "Hacked"}
              </CardTitle>
              <Badge className="rounded-full border border-primary/35 bg-primary/15 text-primary-foreground">
                {result.hacked.breakdown.program}
              </Badge>
            </div>
            <CardDescription className="text-white/65">
              {result.hacked.hackTitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-2">
            <p className="text-4xl font-semibold tracking-tight tabular-nums text-white sm:text-5xl">
              {formatEuro(result.hacked.amountEur)}
            </p>
            <p className="text-sm text-white/70">
              {result.hacked.breakdown.milesRequired > 0
                ? `${result.hacked.breakdown.milesRequired.toLocaleString("en-GB")} miles + ${formatEuro(result.hacked.breakdown.taxesEur)} taxes`
                : "No miles required"}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              {result.hacked.label}
            </p>
          </CardContent>
          <CardFooter>
            <span className="text-sm font-semibold text-primary">
              {result.savings.recommendation === "use_miles"
                ? `${formatEuro(result.savings.amountEur)} estimated savings`
                : "Keep your miles for a better redemption"}
            </span>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
