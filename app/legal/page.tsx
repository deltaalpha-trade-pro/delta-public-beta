import { LegalPage } from "@/components/legal/legal-page"

export default function LegalIndexPage() {
  return (
    <LegalPage
      label="Legal Center"
      title="Legal and Controlled Live Notices"
      description="Centralized public notices for the DeltaAlpha-TradePro Controlled Live surface of the WHALEZ-AI ecosystem."
      sections={[
        {
          title: "Controlled Live boundary",
          body: [
            "DeltaAlpha-TradePro is a Controlled Live public gateway for real participants to access available ecosystem capabilities. Financial execution, custody, brokerage, exchange, and settlement remain capability-specific and separately gated.",
            "Private founder and internal routes are not public services and should not be exposed from the public domain.",
          ],
        },
        {
          title: "Required notices",
          body: [
            "Review the Terms, Privacy Notice, Risk Disclosure, Controlled Live Boundary, and Cookie Notice before using the public surface. These notices define the launch-state boundaries and will evolve as capabilities mature.",
          ],
        },
      ]}
    />
  )
}
