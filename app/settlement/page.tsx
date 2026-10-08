import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SettlementSimulator } from "@/components/settlement/settlement-simulator"
import { ExposureCalculator } from "@/components/settlement/exposure-calculator"
import { BridgeSimulation } from "@/components/settlement/bridge-simulation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CircleCheck, Network, Scale, Shield } from "lucide-react"

const flow = [
  ["01", "Preflight", "Identity, jurisdiction, eligibility, amount limits, idempotency, and route readiness are checked before money or state is moved."],
  ["02", "Governance", "A governed approval policy determines whether a payment or settlement action may proceed."],
  ["03", "Provider event", "Where an approved external provider is used, the provider response is independently verified rather than trusted from a client-side claim."],
  ["04", "Chain preparation", "WhalezChain records the native preparation relationship, correlation identity, and settlement context."],
  ["05", "Finality", "The native state transitions only through the authorized finalization path; receipts preserve the canonical record."],
  ["06", "Complete", "The participant sees a canonical outcome only after the required state and provider evidence exist."],
] as const

export default function SettlementPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary"><Scale className="mr-1 h-3.5 w-3.5" /> Settlement architecture</Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">How settlement works inside the ecosystem</h1>
            <p className="mt-5 max-w-4xl text-base leading-8 text-muted-foreground sm:text-lg">
              Settlement is the bridge between an approved financial obligation and a verifiable final state. Escrow can
              coordinate the obligation, providers can move external value where legally and technically qualified, and
              WhalezChain preserves native state, provenance, and canonical receipt information.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {flow.map(([step, title, body]) => (
              <Card key={step}>
                <CardHeader><CardTitle className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">{step}</span>{title}</CardTitle></CardHeader>
                <CardContent><p className="text-sm leading-7 text-muted-foreground">{body}</p></CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Network className="h-5 w-5 text-primary" /> The three rails</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p><strong className="text-foreground">External rail.</strong> Banks, payment processors, brokers, exchanges, or other qualified providers handle external value movement according to their permitted role.</p>
                <p><strong className="text-foreground">Ecosystem rail.</strong> WhalezChain records native asset state, receipts, policy relationships, and finality evidence.</p>
                <p><strong className="text-foreground">Intelligence rail.</strong> Whalez-AI coordinates reasoning, eligibility, routing, and governed capability selection without becoming a substitute for external authorization.</p>
                <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-primary"><CircleCheck className="h-4 w-4" /><span>One user experience; separate authorities underneath.</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> WHZ settlement relationship</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>WHZ can function as an ecosystem settlement-bond concept that expresses policy eligibility for certain flows. It is not silently represented as insurance, a bank guarantee, regulatory capital, or deposit protection.</p>
                <p>The Controlled Live public surface demonstrates the relationship through controlled simulation. Live settlement requires separate partner, legal, jurisdictional, identity, funded-capacity, runtime, and end-to-end evidence gates.</p>
                <Link href="/whalezchain" className="inline-flex items-center text-primary hover:underline">Understand the native rail <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Controlled settlement simulator</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">The tools below let visitors see the relationship between exposure, bond requirements, bridge preparation, and finality without moving real funds.</p>
            <div className="mt-6"><ExposureCalculator /></div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2"><SettlementSimulator /><BridgeSimulation /></div>
          </div>

          <div className="mt-8 rounded-xl border border-border bg-secondary/50 p-4">
            <p className="text-center text-xs leading-6 text-muted-foreground"><strong className="text-foreground">Controlled Live boundary:</strong> This page demonstrates architecture and simulation. No live settlement, custody, broker execution, or external funds movement is enabled by this public surface.</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/escrow"><Button>Open Escrow <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Link href="/terminal"><Button variant="outline">Open Terminal</Button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
