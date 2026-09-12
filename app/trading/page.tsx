import { DemoTrading } from "@/components/trading/demo-trading"

export default function TradingPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
          DeltaAlpha-Trade-Pro
        </p>

        <h1 className="mt-2 text-3xl font-bold text-foreground">
          Demo Trading
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Experiment with synthetic orders, virtual funds, and trading
          strategies without connecting to a broker or risking real capital.
        </p>
      </div>

      <DemoTrading />
    </main>
  )
}
