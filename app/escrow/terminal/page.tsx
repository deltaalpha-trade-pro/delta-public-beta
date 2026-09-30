import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { EscrowTerminal } from "@/components/escrow/escrow-terminal"
import { Terminal } from "lucide-react"

export default function EscrowTerminalPage() {
  return <><Navigation /><main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl">
    <div className="mb-10 flex items-start gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15"><Terminal className="h-6 w-6 text-primary" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Whalez-AI · Escrow</p><h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">Escrow Coordination Terminal</h1><p className="mt-3 max-w-3xl text-muted-foreground">Lifecycle preparation and controlled safety simulation for escrow-backed settlement flows.</p></div></div>
    <EscrowTerminal />
  </div></main><Footer /></>
}