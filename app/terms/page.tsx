import { LegalPage } from "@/components/legal/legal-page"

export default function TermsPage() {
  return (
    <LegalPage
      label="Legal"
      title="Terms of Use"
      description="Terms for accessing the DeltaAlpha-TradePro Controlled Live surface of the WHALEZ-AI ecosystem."
      sections={[
        {
          title: "Controlled Live access",
          body: [
            "DeltaAlpha-TradePro is a Controlled Live public operating surface for eligible participants to access available ecosystem capabilities. Access, features, and financial operations remain subject to applicable eligibility and provider gates.",
            "Controlled Live access does not by itself create a brokerage, banking, custody, advisory, fiduciary, exchange, wallet custody, or settlement relationship. Any regulated service relationship requires the applicable approved provider and jurisdiction-specific process.",
          ],
        },
        {
          title: "No unrestricted live execution",
          body: [
            "The public Controlled Live surface does not expose unrestricted live trade execution, custody, broker execution, or WHZ settlement authority. Those capabilities remain separately gated until the applicable production evidence and approvals exist.",
            "Any dashboard, signal, coach, wallet, banking, escrow, or settlement surface is available only to the extent its capability state, provider route, jurisdictional eligibility, and authorization permit it.",
          ],
        },
        {
          title: "User responsibility",
          body: [
            "You are responsible for your own decisions, accounts, devices, credentials, and compliance obligations. Do not rely on platform outputs as a substitute for professional financial, legal, tax, compliance, or investment advice.",
          ],
        },
      ]}
    />
  )
}
