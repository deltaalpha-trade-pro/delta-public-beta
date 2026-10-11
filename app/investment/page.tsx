import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { InvestmentDashboard } from "@/components/investment/investment-dashboard"
import { BarChart3 } from "lucide-react"

export default function InvestmentPage() {
  return <><Navigation /><main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl">
    <div className="mb-10 flex items-start gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15"><BarChart3 className="h-6 w-6 text-primary" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Whalez-AI · Investment</p><h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">Investment Dashboard</h1><p className="mt-3 max-w-3xl text-muted-foreground">Portfolio modeling, exposure context, and scenario preparation across illustrative positions and external market observations.</p></div></div>
    <InvestmentDashboard />
  </div></main><Footer /></>
}