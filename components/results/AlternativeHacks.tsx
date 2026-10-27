import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatEuro } from "@/lib/route-label"
import type { SearchResponse } from "@/lib/search-types"

interface AlternativeHacksProps {
  alternatives: SearchResponse["alternativeHacks"]
}

export function AlternativeHacks({ alternatives }: AlternativeHacksProps) {
  if (alternatives.length === 0) return null

  return (
    <section aria-labelledby="alternatives-heading" className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          A little flexibility goes a long way
        </p>
        <h2 id="alternatives-heading" className="mt-2 text-2xl font-semibold tracking-tight text-espresso sm:text-3xl">
          Other ways to save
        </h2>
      </div>

      <div
        role="region"
        aria-label="Alternative savings ideas"
        tabIndex={0}
        className="flex snap-x gap-4 overflow-x-auto pb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {alternatives.map(alternative => (
          <Card key={alternative.title} variant="cream" className="min-w-[17rem] max-w-sm snap-start sm:min-w-[20rem]">
            <CardHeader>
              <CardTitle className="text-lg">{alternative.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tracking-tight text-espresso">
                Up to {formatEuro(alternative.savingsEur)} less
              </p>
              <CardDescription className="mt-2 leading-6 text-muted-foreground">
                {alternative.note}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
