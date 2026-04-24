import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Trust & Safety | WHALEZ-AI",
  description:
    "Public beta boundaries, no-custody posture, audit-record explanation, privacy posture, and anti-impersonation guidance for WHALEZ-AI and DeltaAlpha-TradePro.",
}

const betaModes = [
  ["Market intelligence", "Allowed"],
  ["Signal visualization", "Allowed"],
  ["Strategy modeling", "Allowed"],
  ["Portfolio simulation", "Allowed"],
  ["Paper trading / synthetic balances", "Allowed"],
  ["Read-only API integrations", "Conditional"],
  ["Real order execution", "Not active during beta"],
  ["Custody of user funds", "Not active during beta"],
]

const auditFields = [
  "Timestamp",
  "Request metadata",
  "Model or system version",
  "Redacted input reference",
  "Output hash",
  "Event type",
  "System response category",
  "Review or approval status, where applicable",
]

const pilotModes = [
  "Sandbox simulation",
  "Paper trading",
  "Synthetic balances",
  "Read-only exchange data",
  "Analytics-only dashboard access",
  "Historical backtesting",
  "Independent performance review",
]

export default function TrustSafetyPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16">
        <section className="border-b border-border bg-card/40 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">Public Beta Posture</p>
              <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground text-balance">
                Trust, Safety & Public Beta Boundaries
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                DeltaAlpha-TradePro is the public beta gateway of the WHALEZ-AI ecosystem. It provides market
                intelligence, signal visualization, strategy analysis, portfolio modeling, and performance research in a
                controlled, non-custodial beta environment.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                During beta, DeltaAlpha-TradePro does not custody funds, execute live trades, guarantee returns, or
                replace professional financial advice. All outputs are informational and educational only.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/beta-access"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Request Beta Access
                </Link>
                <Link
                  href="/legal"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-border bg-transparent px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Read Legal Disclaimer
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-xl font-medium text-foreground">Public Beta Notice</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  WHALEZ-AI and DeltaAlpha-TradePro are currently operating as a public beta interface. Features may be
                  experimental, incomplete, limited, or subject to change.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Market analysis, signals, charts, simulations, and performance models are provided strictly for
                  informational and educational purposes. Users should not rely solely on platform outputs when making
                  financial decisions.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-xl font-medium text-foreground">No Live Trading or Custody</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  WHALEZ-AI and DeltaAlpha-TradePro do not custody user funds, hold client assets, submit live market
                  orders, or execute trades during beta.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Any real trading activity must occur outside the platform through a user's chosen regulated broker,
                  exchange, custodian, or financial service provider.
                </p>
              </div>
            </div>

            <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-xl font-medium text-foreground">Beta-Supported Modes</h2>
              </div>
              <div className="divide-y divide-border">
                {betaModes.map(([mode, status]) => (
                  <div key={mode} className="grid gap-2 px-6 py-4 sm:grid-cols-[1fr_auto]">
                    <span className="text-sm text-foreground">{mode}</span>
                    <span className="text-sm text-muted-foreground">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-card/40 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">Accountability</p>
                <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                  Audit Records & Reproducibility
                </h2>
                <p className="mt-5 text-muted-foreground leading-relaxed">
                  WHALEZ-AI is designed around a verification-first operating posture. Platform activity may generate
                  append-only audit records for reproducibility, system review, and future independent validation.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Public audit examples should be anonymized or synthetic and should not expose private user data.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background p-6">
                <h3 className="text-lg font-medium text-foreground">Audit records may include</h3>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {auditFields.map((field) => (
                    <li key={field} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{field}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-xl font-medium text-foreground">Privacy & Data Protection Posture</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  DeltaAlpha-TradePro collects only the minimum information required to operate the beta program,
                  provide access, improve product reliability, and maintain security. WHALEZ-AI does not sell personal
                  data.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Data protection controls, retention rules, and audit procedures are reviewed as the platform matures.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-xl font-medium text-foreground">Anti-Impersonation & Brand Protection</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  WHALEZ-AI does not authorize celebrity endorsements, guaranteed-profit promotions, private
                  fund-collection groups, or unofficial representatives.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Users should only trust verified channels listed on this website and should not send funds to anyone
                  claiming to represent WHALEZ-AI or DeltaAlpha-TradePro.
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-xl border border-border bg-card p-6">
              <h2 className="text-xl font-medium text-foreground">Verified Public Channels</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-sm font-medium text-foreground">Official website</p>
                  <p className="mt-2 text-sm text-muted-foreground">deltaalpha-trade-pro.com</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-sm font-medium text-foreground">GitHub</p>
                  <p className="mt-2 text-sm text-muted-foreground">github.com/deltaalpha-trade-pro</p>
                </div>
              </div>
              <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
                Dedicated support or security inboxes should be trusted only after they are published through these
                verified channels.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-card/40 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">Pilot Safety</p>
                <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                  Partner Pilot Boundaries
                </h2>
                <p className="mt-5 text-muted-foreground leading-relaxed">
                  Partner pilots begin in read-only, sandbox, or paper-trading mode. No funds are held or executed by
                  WHALEZ-AI during beta. Performance metrics may be reviewed through independent or third-party audit
                  processes.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background p-6">
                <h3 className="text-lg font-medium text-foreground">Allowed pilot modes</h3>
                <ul className="mt-5 space-y-3">
                  {pilotModes.map((mode) => (
                    <li key={mode} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{mode}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-xl font-medium text-foreground">Public Beta Footer Disclaimer</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                DeltaAlpha-TradePro is a public beta interface of the WHALEZ-AI ecosystem. The platform provides
                informational and educational market intelligence only. It does not provide financial advice, execute
                live trades, custody funds, or guarantee outcomes. Users remain responsible for their own financial
                decisions.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
