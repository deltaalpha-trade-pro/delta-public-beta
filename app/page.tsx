import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { WhalezAIPresence } from "@/components/whalez-ai-presence"
import { LivePerformanceStream } from "@/components/live-performance-stream"
import { WhatIsSection } from "@/components/what-is-section"
import { DeltaAlphaPreview } from "@/components/deltaalpha-preview"
import { BrandFamilySection } from "@/components/brand-family-section"
import { EcosystemProductsSection } from "@/components/ecosystem-products-section"
import { EcosystemStorySection } from "@/components/ecosystem-story-section"
import { CommunicationsSection } from "@/components/communications-section"
import { BetaNotice } from "@/components/beta-notice"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <WhalezAIPresence />
        <LivePerformanceStream />
        <WhatIsSection />
        <DeltaAlphaPreview />
        <BrandFamilySection />
        <EcosystemProductsSection />
        <EcosystemStorySection />
        <CommunicationsSection />
        <BetaNotice />
      </main>
      <Footer />
    </>
  )
}
