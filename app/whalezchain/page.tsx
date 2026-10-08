import Link from "next/link"
import { ArrowRight, CircleDot, Database, ShieldCheck, WalletCards } from "lucide-react"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const assets = [
  { symbol: "WHZ", name: "Whalez-Mint", icon: "/whz-icon.svg", role: "Ecosystem policy / settlement-bond unit", explanation: "WHZ is the ecosystem-native policy and settlement-bond asset. Its platform role is distinct from any external market price, liquidity, custody, or redemption claim." },
  { symbol: "PTN", name: "Plutonium", icon: "/ptn-icon.svg", role: "Platform trade-note asset", explanation: "PTN represents the native platform trade-note role within DeltaAlpha and WhalezChain. No external market price is asserted here." },
  { symbol: "PRN", name: "Plutoranium", icon: "/prn-icon.svg", role: "Platform receipt-note asset", explanation: "PRN represents native receipt and settlement provenance within the ecosystem. No external market price is asserted here." },
]

export default function WhalezChainPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary"><CircleDot className="mr-1 h-3.5 w-3.5" /> Native economic rail</Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">WhalezChain: the native state, economic, and provenance rail</h1>
            <p className="mt-5 max-w-4xl text-base leading-8 text-muted-foreground sm:text-lg">WhalezChain provides the native state and provenance layer for the Whalez-AI Ecosystem. DeltaAlpha-TradePro is the public operating surface; WhalezChain is where ecosystem-native asset state, receipts, governance evidence, and finality concepts belong.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {assets.map((asset) => <Card key={asset.symbol}><CardHeader><CardTitle className="flex items-center justify-between gap-3"><span className="flex items-center gap-3"><Image src={asset.icon} alt={`${asset.symbol} · ${asset.name}`} width={42} height={42} className="h-10 w-10 rounded-xl object-contain" />{asset.symbol}</span><Badge variant="outline">Native asset role</Badge></CardTitle></CardHeader><CardContent><div className="text-xl font-semibold text-foreground">{asset.name}</div><p className="mt-2 text-sm text-muted-foreground">{asset.role}</p><div className="mt-5 rounded-xl border border-border bg-secondary/30 p-4"><div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Market price</div><div className="mt-2 font-mono text-lg text-foreground">Not available</div><p className="mt-1 text-xs text-muted-foreground">No verified external market quote is configured for this asset on this page.</p></div><p className="mt-5 text-sm leading-7 text-muted-foreground">{asset.explanation}</p></CardContent></Card>)}
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-primary" />How value is introduced</CardTitle></CardHeader><CardContent className="space-y-4 text-sm leading-7 text-muted-foreground"><p><strong className="text-foreground">1. Native role.</strong> An asset first has a defined purpose and state within the ecosystem.</p><p><strong className="text-foreground">2. Verifiable state.</strong> The platform records balances, receipts, policy relationships, and governed transitions without fabricating external liquidity.</p><p><strong className="text-foreground">3. External qualification.</strong> Partners, jurisdictional eligibility, legal structure, custody and liquidity arrangements are separate gates.</p><p><strong className="text-foreground">4. Market availability.</strong> An external market price or transferability is shown only when a verified source and applicable arrangements support it.</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />What DeltaAlpha shows today</CardTitle></CardHeader><CardContent className="space-y-4 text-sm leading-7 text-muted-foreground"><p>Public users can see native asset roles, portfolio modeling, settlement relationships, and simulation behavior.</p><p>External positions such as BTC and ETH remain separate from native WhalezChain state. Observation does not mean custody or broker execution.</p><p>Asset roles are shown separately from external market prices and live economic claims.</p><div className="flex flex-wrap gap-3 pt-2"><Link href="/investment"><Button>Open Investment <ArrowRight className="ml-2 h-4 w-4" /></Button></Link><Link href="/settlement"><Button variant="outline">See Settlement</Button></Link></div></CardContent></Card>
          </div>
          <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6"><div className="flex items-center gap-3"><WalletCards className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold text-foreground">The long-term model</h2></div><p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground">The goal is not to copy an existing exchange-token model. The goal is to create a native economic rail whose assets have explicit roles, auditable state, governed relationships, and a path to external qualification when the real-world conditions for that step are satisfied.</p></div>
        </div>
      </main>
      <Footer />
    </>
  )
}
