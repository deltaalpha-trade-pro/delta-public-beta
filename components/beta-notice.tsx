import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export function BetaNotice() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary border border-border mb-6">
            <AlertCircle className="w-6 h-6 text-primary" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground text-balance">
            Beta Platform Notice
          </h2>

          <div className="mt-6 space-y-4 text-muted-foreground">
            <p className="leading-relaxed">
              WHALEZ-AI and DeltaAlpha-TradePro are currently operating in a controlled beta environment. Access is
              limited and features are under active development.
            </p>
            <p className="leading-relaxed">
              This platform does not facilitate live trading execution. All outputs, signals, and analysis are provided
              for informational and educational purposes only.
            </p>
            <p className="leading-relaxed">
              We are continuously refining our systems based on feedback and testing. Thank you for your patience and
              participation.
            </p>
          </div>

          <Button className="mt-8 min-h-[44px] bg-transparent" variant="outline" asChild>
            <Link href="/beta-access">Request Beta Access</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
