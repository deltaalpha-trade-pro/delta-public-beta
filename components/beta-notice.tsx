import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck } from "lucide-react"

export function BetaNotice() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary border border-border mb-6">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground text-balance">
            Create your DeltaAlpha account
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p className="leading-relaxed">
              Start with a registered account and access the simulation features available to your account. Use the same profile as you complete identity verification and become eligible for additional services.
            </p>
            <p className="leading-relaxed">
              Real-money deposits, trading, custody, and settlement require the applicable identity, jurisdiction, provider, funding, and service approvals. Simulation activity never moves real funds.
            </p>
          </div>
          <Button className="mt-8 min-h-[44px]" asChild>
            <Link href="/signup">Create Account <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
