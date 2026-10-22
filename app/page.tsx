import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { WhatIsSection } from "@/components/what-is-section"
import { DeltaAlphaPreview } from "@/components/deltaalpha-preview"
import { MarketNewsFeed } from "@/components/market/market-news-feed"
import { EcosystemProductsSection } from "@/components/ecosystem-products-section"
import { CommunicationsSection } from "@/components/communications-section"
import { BetaNotice } from "@/components/beta-notice"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <WhatIsSection />
        <DeltaAlphaPreview />
        <section className="py-12 md:py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><MarketNewsFeed /></div></section>
        <EcosystemProductsSection />
        <CommunicationsSection />
        <BetaNotice />
      </main>
      <Footer />
    </>
  )
}
