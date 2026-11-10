import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { AlphaAIShowcase } from "@/components/alpha-ai-showcase"
import { CommunicationsSection } from "@/components/communications-section"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Alpha-AI Story and Customer Support Preview | DeltaAlpha-Trade-Pro",
  description: "Public-safe, non-production preview of the Alpha-AI story showcase and customer support entry points.",
  robots: { index: false, follow: false },
}

export default function AlphaAIPreviewPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16">
        <AlphaAIShowcase />
        <CommunicationsSection />
      </main>
      <Footer />
    </>
  )
}
