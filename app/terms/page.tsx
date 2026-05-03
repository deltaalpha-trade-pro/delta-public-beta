import { LegalPage } from "@/components/legal/legal-page"

export default function TermsPage() {
  return (
    <LegalPage
      label="Legal"
      title="Terms of Use"
      description="Terms for accessing the DeltaAlpha-TradePro public beta surface of the WHALEZ-AI ecosystem."
      sections={[
        {
          title: "Public beta access",
          body: [
            "DeltaAlpha-TradePro is provided as a public beta interface for reviewing informational financial intelligence, product concepts, and ecosystem surfaces. Access may be limited, changed, suspended, or removed as the beta evolves.",
            "The public beta does not create a brokerage, banking, custody, advisory, fiduciary, exchange, wallet custody, or settlement relationship between the platform and any visitor.",
          ],
        },
        {
          title: "No live execution",
          body: [
            "The public beta does not execute live trades, does not custody funds, does not connect to a regulated broker for execution, and does not activate WHZ settlement authority.",
            "Any dashboard, signal, coach, wallet, banking, escrow, or settlement surface shown during beta is informational or illustrative unless separately activated through an approved and compliant production process.",
          ],
        },
        {
          title: "User responsibility",
          body: [
            "You are responsible for your own decisions, accounts, devices, credentials, and compliance obligations. Do not rely on beta outputs as a substitute for professional financial, legal, tax, compliance, or investment advice.",
          ],
        },
      ]}
    />
  )
}
