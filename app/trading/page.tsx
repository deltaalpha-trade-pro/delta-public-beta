import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DemoTrading } from "@/components/trading/demo-trading"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function TradingPage() {
  return (
    <>
      <Navigation />
      <main className="container mx-auto min-h-screen px-4 pb-16 pt-24">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">DeltaAlpha-TradePro</p>
            <h1 className="mt-2 text-3xl font-bold text-foreground">Demo Trading</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Synthetic orders, virtual funds, and strategy experiments without broker execution or real capital movement.
            </p>
          </div>
          <Link href="/terminal">
            <Button variant="outline" className="min-h-11">
              Open Full Terminal <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <DemoTrading />
      </main>
      <Footer />
    </>
  )
}
