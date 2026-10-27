import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { DataSource } from "@/lib/search-types"

const labels: Record<DataSource, string> = {
  sample: "Sample",
  cached: "Cached",
  live: "Live",
  test: "Test fare",
}

const styles: Record<DataSource, string> = {
  sample: "border-primary/30 bg-primary/10 text-foreground",
  cached: "border-border bg-secondary text-muted-foreground",
  live: "border-primary/50 bg-primary/15 text-foreground",
  test: "border-amber-600/40 bg-amber-500/15 text-foreground",
}

interface DataSourceBadgeProps {
  source: DataSource
}

export function DataSourceBadge({ source }: DataSourceBadgeProps) {
  return (
    <Badge variant="outline" className={cn("rounded-full", styles[source])}>
      {labels[source]}
    </Badge>
  )
}
