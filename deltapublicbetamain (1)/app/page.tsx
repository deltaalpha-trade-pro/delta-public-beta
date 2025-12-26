import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { WhatIsSection } from "@/components/what-is-section"
import { DeltaAlphaPreview } from "@/components/deltaalpha-preview"
import { ArchitectureSection } from "@/components/architecture-section"
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
        <ArchitectureSection />
        <BetaNotice />
      </main>
      <Footer />
    </>
  )
}
