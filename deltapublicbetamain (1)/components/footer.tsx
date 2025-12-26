import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="text-lg font-semibold tracking-tight text-foreground">WHALEZ-AI</span>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              AI-driven financial intelligence and quantitative systems.
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

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">© WHALEZ-AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
