import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BarChart3, Building2, ShieldCheck, Wallet } from "lucide-react"

const previewItems = [
  {
    icon: Wallet,
    title: "Account & Balance Views",
    description: "User-facing views for account context, balances, and movement history as the beta surface evolves.",
  },
  {
    icon: BarChart3,
    title: "Portfolio Context",
    description: "Exposure, allocation, and performance views designed for analysis rather than live financial execution.",
  },
  {
    icon: Building2,
    title: "Digital Finance Workflows",
    description: "A controlled preview of future banking-style workflows, presented without activating custody or settlement authority.",
  },
  {
    icon: ShieldCheck,
    title: "Controlled Beta",
    description: "No live banking, custody, broker execution, or settlement execution is enabled from this public surface.",
  },
]

export default function BankingPage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Digital Finance Preview</h1>
                <p className="text-muted-foreground">A public-beta view of planned account and portfolio experiences.</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              This page intentionally shows capabilities rather than fabricated operational records. The public beta does
              not present simulated balances, participant identities, live ledger entries, or settlement states as real
              account activity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {previewItems.map((item) => (
              <div key={item.title} className="p-6 rounded-lg border border-border bg-card">
                <item.icon className="w-8 h-8 text-primary mb-4" />
                <h2 className="text-lg font-medium text-foreground">{item.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 rounded-lg bg-secondary/50 border border-border">
            <p className="text-sm text-muted-foreground text-center">
              Public beta preview only. No live account balances, custody, broker execution, settlement execution, or
              transferable asset activity is enabled here.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
