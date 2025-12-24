import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, LineChart, Zap, Eye } from "lucide-react"

export function DeltaAlphaPreview() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="text-sm text-accent font-medium tracking-wide uppercase">Public Interface</span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
              DeltaAlpha-TradePro
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed text-pretty">
              The public-facing intelligence and analysis interface of the WHALEZ-AI ecosystem. DeltaAlpha-TradePro
              provides access to market insights, signals visualization, and strategy analysis tools.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3">
                <LineChart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Real-time market insights and data visualization</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Signal processing and pattern recognition outputs</span>
              </li>
              <li className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Strategy analysis and performance modeling</span>
              </li>
            </ul>

            <Button className="mt-8 min-h-[44px]" asChild>
              <Link href="/deltaalpha">
                Explore DeltaAlpha
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-lg border border-border bg-secondary/50 overflow-hidden">
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted" />
                  <div className="w-3 h-3 rounded-full bg-muted" />
                  <div className="w-3 h-3 rounded-full bg-muted" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-32 bg-muted/50 rounded" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-16 bg-muted/30 rounded" />
                  <div className="h-16 bg-muted/30 rounded" />
                  <div className="h-16 bg-muted/30 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
