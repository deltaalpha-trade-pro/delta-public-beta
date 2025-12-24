import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SettlementSimulator } from "@/components/settlement/settlement-simulator"
import { ExposureCalculator } from "@/components/settlement/exposure-calculator"
import { BridgeSimulation } from "@/components/settlement/bridge-simulation"
import { Badge } from "@/components/ui/badge"
import { Scale, Shield } from "lucide-react"

export default function SettlementPage() {
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
                  <Scale className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Settlement Simulation</h1>
                  <p className="text-sm text-muted-foreground">Execution & Finality Testing Environment</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 w-fit">
              <Shield className="w-3 h-3 mr-1" />
              Structural Proof Mode
            </Badge>
          </div>

          {/* Exposure Calculator */}
          <div className="mb-6">
            <ExposureCalculator />
          </div>

          {/* Settlement Simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SettlementSimulator />
            <BridgeSimulation />
          </div>

          {/* Notice */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              Settlement simulation demonstrates the WHZ bond model. This is not a trading interface. WHZ is locked for
              pre-finality privileges, not spent as fees. Failed settlements may result in proportional WHZ slashing.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
