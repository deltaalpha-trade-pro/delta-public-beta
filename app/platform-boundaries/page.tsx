import { LegalPage } from "@/components/legal/legal-page"

export default function PlatformBoundariesPage() {
  return (
    <LegalPage
      label="Platform Boundaries"
      title="Platform Boundaries"
      description="The public DeltaAlpha-TradePro surface provides product routes, account flows, market observation where configured, and simulations with explicit capability boundaries."
      sections={[
        {
          title: "Financial capability boundaries",
          body: [
            "Public product routes, previews, and simulations are available where shown. Their presence does not prove that live-money features, custody, regulated brokerage, or settlement are active or certified.",
            "Each capability must distinguish configured live observations from simulation and informational views. Simulation activity does not move real funds.",
          ],
        },
        {
          title: "No private authority",
          body: [
            "The public surface does not expose Founder Console operations, internal control paths, private infrastructure, secure-shell access, or irreversible execution. Private surfaces remain separate from the public deployment.",
          ],
        },
        {
          title: "Availability and activation",
          body: [
            "Availability and activation depend on authentication, legal, security, compliance, provider, jurisdiction, operational, funding, and approval requirements. A public page does not by itself authorize a financial action.",
            "Live financial execution, custody, and external settlement remain unavailable from this public surface until the applicable release and service gates are explicitly verified.",
          ],
        },
      ]}
    />
  )
}
