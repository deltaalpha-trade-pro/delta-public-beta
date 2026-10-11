import { LegalPage } from "@/components/legal/legal-page"

export default function TermsPage() {
  return (
    <LegalPage
      label="Legal"
      title="Terms of Use"
      description="Terms for accessing DeltaAlpha-TradePro, the public financial platform within the WHALEZ-AI Ecosystem."
      sections={[
        {
          title: "Platform access and capability gates",
          body: [
            "DeltaAlpha-TradePro is the public financial operating platform within the Whalez-AI Ecosystem. Account access and available capabilities remain subject to eligibility, service availability, and provider and jurisdiction controls.",
            "Public platform access does not by itself create a brokerage, banking, custody, advisory, fiduciary, exchange, wallet custody, or settlement relationship. Any regulated service relationship requires the applicable approved provider and jurisdiction-specific process.",
          ],
        },
        {
          title: "No unrestricted live execution",
          body: [
            "The public platform does not expose unrestricted live trade execution, custody, broker execution, or WHZ settlement authority. Those capabilities remain separately gated until the applicable production evidence and approvals exist.",
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
