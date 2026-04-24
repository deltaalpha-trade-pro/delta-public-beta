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
            Public Beta Notice
          </h2>

          <div className="mt-6 space-y-4 text-muted-foreground">
            <p className="leading-relaxed">
              WHALEZ-AI and DeltaAlpha-TradePro are currently operating in a controlled public beta environment. Access
              is limited and features are under active development.
            </p>
            <p className="leading-relaxed">
              This platform provides informational market intelligence, signal visualization, strategy analysis, and
              portfolio modeling. It does not custody funds, submit live orders, or facilitate live trade execution
              during beta.
            </p>
            <p className="leading-relaxed">
              Outputs are informational and educational only. Users remain responsible for their own financial decisions
              and should not rely solely on platform outputs.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="min-h-[44px] bg-transparent" variant="outline" asChild>
              <Link href="/beta-access">Request Beta Access</Link>
            </Button>
            <Button className="min-h-[44px]" asChild>
              <Link href="/trust-safety">Read Trust & Safety</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
