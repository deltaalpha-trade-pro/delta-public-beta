import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { LedgerTable } from "@/components/founder/ledger-table"
import { AllocationChart } from "@/components/founder/allocation-chart"
import { SystemMetrics } from "@/components/founder/system-metrics"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, FileText } from "lucide-react"
import Link from "next/link"

export default function FounderConsolePage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Founder Console</h1>
                  <p className="text-sm text-muted-foreground">Administrative control center</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                <Lock className="w-3 h-3 mr-1" />
                Authenticated
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                Full Access
              </Badge>
            </div>
          </div>

          {/* System Metrics */}
          <div className="mb-8">
            <SystemMetrics />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <LedgerTable />
            </div>
            <div className="lg:col-span-1">
              <AllocationChart />
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                  <FileText className="w-4 h-4 text-primary" />
                  Ecosystem Laws
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">Review and manage constitutional frameworks</p>
                <Link href="/governance" className="text-xs text-primary hover:underline">
                  View Governance Center →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Whalezchain
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">Monitor blockchain network and nodes</p>
                <Link href="/whalezchain" className="text-xs text-primary hover:underline">
                  View Explorer →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                  <Lock className="w-4 h-4 text-amber-400" />
                  Trading Simulation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">View conceptual trading interface</p>
                <Link href="/trading" className="text-xs text-primary hover:underline">
                  View Trading →
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              The Founder Console provides administrative visibility into the WHALEZ-AI ecosystem. All data shown is
              representative of the intended system architecture during beta development.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
