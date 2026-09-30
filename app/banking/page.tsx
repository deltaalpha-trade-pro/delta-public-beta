import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Building2 } from "lucide-react"
import { BankingHub } from "@/components/platform/banking-hub"

export default function BankingPage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Digital Banking</h1>
                <p className="text-muted-foreground">Runtime-backed account, balance and payment-intent surface.</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Banking records are provider-linked or governed workflow state. Customer funds are never fabricated in the public application.
            </p>
          </div>

          <BankingHub />
        </div>
      </main>
      <Footer />
    </>
  )
}
