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
            Controlled Live Launch
          </h2>

          <div className="mt-6 space-y-4 text-muted-foreground">
            <p className="leading-relaxed">
              WHALEZ-AI and DeltaAlpha-TradePro are are now entering a Controlled Live launch state. Public access is available through governed, capability-specific entry points while
              financial operations remain individually gated by identity, jurisdiction, provider, and execution requirements.
            </p>
            <p className="leading-relaxed">
              Controlled Live does not mean every financial capability is live. Live trading, custody, broker execution, settlement execution, and
              private authority remain separately gated until their corresponding production requirements are satisfied.
            </p>
            <p className="leading-relaxed">
              The platform is now presented as a real operating surface with explicit capability boundaries, evidence states, and controlled access.
            </p>
          </div>

          <Button className="mt-8 min-h-[44px] bg-transparent" variant="outline" asChild>
            <Link href="/beta-access">Request Controlled Live Access</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
