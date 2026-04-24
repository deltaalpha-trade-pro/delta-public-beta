import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="text-lg font-semibold tracking-tight text-foreground">WHALEZ-AI</span>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Public beta market intelligence, portfolio modeling, and settlement research through DeltaAlpha-TradePro.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/deltaalpha"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  DeltaAlpha-TradePro
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Public Beta
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Access</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/beta-access"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Beta Access
                </Link>
              </li>
              <li>
                <Link
                  href="/trust-safety"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Trust & Safety
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/legal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/legal#privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border space-y-4">
          <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
            DeltaAlpha-TradePro is a public beta interface of the WHALEZ-AI ecosystem. The platform provides
            informational and educational market intelligence only. It does not provide financial advice, execute live
            trades, custody funds, or guarantee outcomes.
          </p>
          <p className="text-sm text-muted-foreground text-center">© WHALEZ-AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
