import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BlockVisualizer } from "@/components/whalezchain/block-visualizer"
import { NetworkStats } from "@/components/whalezchain/network-stats"
import { TokenCirculation } from "@/components/whalezchain/token-circulation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link2, Shield, Scale, BookOpen } from "lucide-react"

export default function WhalezchainPage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Link2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Settlement Ledger</h1>
                <p className="text-muted-foreground">Sovereign ledger infrastructure and block visualization</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                Ledger Active
              </Badge>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                Structural Proof
              </Badge>
            </div>
          </div>

          {/* Network Stats */}
          <div className="mb-8">
            <NetworkStats />
          </div>

          {/* Block Visualizer */}
          <div className="mb-8">
            <BlockVisualizer />
          </div>

          {/* Token Circulation & Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <TokenCirculation />

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Ledger Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Constitutional Governance</h4>
                    <p className="text-sm text-muted-foreground">
                      All ledger entries validated against sovereign rules before finalization.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <Scale className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Double-Entry Accounting</h4>
                    <p className="text-sm text-muted-foreground">
                      Every credit has a corresponding debit. Ledger integrity is mathematically enforced.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                  <div className="p-2 rounded-lg bg-amber-500/20">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Settlement Authority</h4>
                    <p className="text-sm text-muted-foreground">
                      WHALEZ-AI coordinates settlement as a sovereign engine, not a market participant.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              This is a structural proof of sovereign ledger architecture. Block data represents the intended settlement
              model. PTN, PRN, and WHZ are internal accounting primitives, not tradable crypto assets.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
