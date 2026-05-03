import { LegalPage } from "@/components/legal/legal-page"

export default function LegalIndexPage() {
  return (
    <LegalPage
      label="Legal Center"
      title="Legal and Public Beta Notices"
      description="Centralized public notices for the DeltaAlpha-TradePro public beta surface of the WHALEZ-AI ecosystem."
      sections={[
        {
          title: "Public beta boundary",
          body: [
            "DeltaAlpha-TradePro is a public beta gateway for informational financial intelligence, ecosystem previews, and staged product communication. It is not a live trading, custody, banking, brokerage, exchange, settlement, or advisory service.",
            "Private founder and internal routes are not public services and should not be exposed from the public domain.",
          ],
        },
        {
          title: "Required notices",
          body: [
            "Review the Terms, Privacy Notice, Risk Disclosure, Public Beta Disclaimer, and Cookie Notice before using the public beta. These notices are part of the launch-readiness posture and will evolve as the service matures.",
          ],
        },
      ]}
    />
  )
}
