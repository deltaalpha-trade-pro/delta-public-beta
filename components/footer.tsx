import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-card/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <Image src="/brand/whalez-ai-ecosystem.svg" alt="Whalez-AI Ecosystem" width={42} height={42} className="h-10 w-10 rounded-xl object-contain" />
              <div><span className="block text-lg font-semibold tracking-tight text-foreground">WHALEZ-AI</span><span className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Ecosystem</span></div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">One intelligence. Many capabilities. A growing financial ecosystem connecting coaching, market intelligence, investment, trading, digital finance, escrow, settlement, communication, and native economic state.</p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">Platform</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/deltaalpha" className="hover:text-foreground transition-colors">DeltaAlpha-TradePro</Link></li>
              <li><Link href="/coaching" className="hover:text-foreground transition-colors">AI Coaching</Link></li>
              <li><Link href="/whalezchain" className="hover:text-foreground transition-colors">WhalezChain</Link></li>
              <li><Link href="/settlement" className="hover:text-foreground transition-colors">Settlement</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">Access</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/signup" className="hover:text-foreground transition-colors">Create Account</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link href="/banking" className="hover:text-foreground transition-colors">Banking</Link></li>
              <li><Link href="/support" className="hover:text-foreground transition-colors">Support</Link></li>
              <li><Link href="/login" className="hover:text-foreground transition-colors">Login</Link></li>
              <li><Link href="/signup" className="hover:text-foreground transition-colors">Sign up</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/legal" className="hover:text-foreground transition-colors">Legal Center</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link href="/risk-disclosure" className="hover:text-foreground transition-colors">Risk Disclosure</Link></li>
              <li><Link href="/beta-disclaimer" className="hover:text-foreground transition-colors">Controlled Live Boundary</Link></li>
              <li><Link href="/cookies" className="hover:text-foreground transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-center text-sm text-muted-foreground">© WHALEZ-AI. Controlled Live public launch. Financial capabilities remain individually gated; no private authority is exposed from the public domain.</p>
        </div>
      </div>
    </footer>
  )
}
