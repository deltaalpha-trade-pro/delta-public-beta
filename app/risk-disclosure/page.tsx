import { LegalPage } from "@/components/legal/legal-page"

export default function RiskDisclosurePage() {
  return (
    <LegalPage
      label="Risk"
      title="Risk Disclosure"
      description="Risk disclosures for beta-stage market intelligence, signals, simulations, digital asset concepts, and settlement-related product surfaces."
      sections={[
        {
          title: "Market and digital asset risk",
          body: [
            "Markets and digital assets can be volatile, illiquid, and unpredictable. Prices may move rapidly and losses can occur if users act outside the public beta on their own accounts or through third-party services.",
            "Beta outputs, dashboards, simulations, model summaries, signals, and coach-style explanations may be incomplete, delayed, inaccurate, or unsuitable for your situation.",
          ],
        },
        {
          title: "No investment advice",
          body: [
            "Nothing on the public beta is investment advice, legal advice, tax advice, financial planning advice, or a recommendation to buy, sell, hold, trade, stake, lend, borrow, or settle any asset.",
          ],
        },
        {
          title: "Technology risk",
          body: [
            "The public beta may experience outages, incorrect data, broken integrations, delayed updates, authentication failures, display issues, or other technical limitations. Do not treat beta outputs as guaranteed, final, or production-authoritative.",
          ],
        },
      ]}
    />
  )
}
