import { LegalPage } from "@/components/legal/legal-page"

export default function LegalIndexPage() {
  return (
    <LegalPage
      label="Legal Center"
      title="Legal and Platform Notices"
      description="Centralized public notices for DeltaAlpha-TradePro, the public financial platform within the WHALEZ-AI Ecosystem."
      sections={[
        {
          title: "Platform capability boundary",
          body: [
            "DeltaAlpha-TradePro is the public financial gateway for ecosystem capabilities. Financial execution, custody, brokerage, exchange, and settlement remain capability-specific and separately gated.",
            "Private founder and internal routes are not public services and should not be exposed from the public domain.",
          ],
        },
        {
          title: "Required notices",
          body: [
            "Review the Terms, Privacy Notice, Risk Disclosure, Platform Boundaries, and Cookie Notice before using the public surface. These notices define the launch-state boundaries and will evolve as capabilities mature.",
          ],
        },
      ]}
    />
  )
}
