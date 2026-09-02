import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-card/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="text-lg font-semibold tracking-tight text-foreground">WHALEZ-AI</span>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              AI-driven financial intelligence, communications, and settlement surfaces in controlled public beta.
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
                <Link href="/deltaalpha" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  DeltaAlpha-TradePro
                </Link>
              </li>
              <li>
                <Link href="/whalezchain" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Settlement Ledger
                </Link>
              </li>
              <li>
                <Link href="/mail" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Whalez-mail
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Access</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/beta-access" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Beta Access
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sign up
                </Link>
              </li>
              <li>
                <Link href="/#communications" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Communications
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/legal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Legal Center
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/risk-disclosure" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Risk Disclosure
                </Link>
              </li>
              <li>
                <Link href="/beta-disclaimer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Beta Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-muted-foreground text-center">
            © WHALEZ-AI. Public beta only. No live trading, custody, broker execution, settlement execution, or private authority.
          </p>
        </div>
      </div>
    </footer>
  )
}
