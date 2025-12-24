import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AccountIdentityCard } from "@/components/banking/account-identity-card"
import { LedgerEntries } from "@/components/banking/ledger-entries"
import { EscrowStatePanel } from "@/components/banking/escrow-state-panel"
import { SettlementBondCard } from "@/components/banking/settlement-bond-card"
import { Badge } from "@/components/ui/badge"
import { Building2, Shield } from "lucide-react"
import Link from "next/link"

export default function BankingPage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Digital Banking</h1>
                  <p className="text-sm text-muted-foreground">Settlement Authority Interface</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                <Shield className="w-3 h-3 mr-1" />
                Sovereign Ledger
              </Badge>
              <Link
                href="/governance"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View Constitution
              </Link>
            </div>
          </div>

          {/* Account Identity */}
          <div className="mb-6">
            <AccountIdentityCard />
          </div>

          {/* Settlement Bond (WHZ) */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Settlement Bond
            </h2>
            <SettlementBondCard />
          </div>

          {/* Ledger Entries */}
          <div className="mb-6">
            <LedgerEntries />
          </div>

          {/* Escrow & Bridge States */}
          <div className="mb-6">
            <EscrowStatePanel />
          </div>

          {/* Structural Proof Notice */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              This is a structural proof interface demonstrating sovereign ledger architecture. All entries represent
              double-entry accounting primitives. PTN, PRN, and WHZ are internal settlement units, not tradable assets.
              WHALEZ-AI operates as a coordination engine, not a chatbot.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
