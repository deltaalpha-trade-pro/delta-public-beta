import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhzFeeBurnSimulation } from "@/components/simulation/whz-fee-burn"
import { PtnPrnGraduation } from "@/components/simulation/ptn-prn-graduation"
import { BridgeAgentValidation } from "@/components/simulation/bridge-agent-validation"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, Shield, AlertTriangle } from "lucide-react"

export default function SimulationPage() {
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
                  <FlaskConical className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Ledger Simulations</h1>
                  <p className="text-sm text-muted-foreground">Fee-Burn, Graduation, and Bridge Validation Models</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 w-fit">
              <Shield className="w-3 h-3 mr-1" />
              Simulation Only
            </Badge>
          </div>

          {/* Beta Scope Notice */}
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-400 mb-1">Beta Scope</p>
                <p className="text-xs text-amber-400/80">
                  This is a simulation-only beta demonstrating system integrity under stress. No speculative pricing, no
                  yield, no token trading. Emphasis on settlement correctness and account state.
                </p>
              </div>
            </div>
          </div>

          {/* Simulations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <WhzFeeBurnSimulation />
            <PtnPrnGraduation />
          </div>

          <div className="mb-6">
            <BridgeAgentValidation />
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              These simulations demonstrate the intended behavior of the WHALEZ-AI ledger system. PTN, PRN, and WHZ are
              internal accounting primitives, not tradable assets. The goal is to demonstrate system integrity under
              stress, not user growth or monetization.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
