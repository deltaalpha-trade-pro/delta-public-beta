import { LegalPage } from "@/components/legal/legal-page"

export default function BetaDisclaimerPage() {
  return (
    <LegalPage
      label="Controlled Live"
      title="Controlled Live Boundary"
      description="The current site is a Controlled Live public surface for governed access, transparent capability states, and staged financial readiness."
      sections={[
        {
          title: "Controlled Live limitations",
          body: [
            "Features, dashboards, product modules, and access flows may continue to evolve. Controlled Live means the public operating surface is launched; it does not mean every underlying financial capability is enabled or fully certified.",
            "Certain surfaces may be previews, simulations, or informational pages while backend systems, auth, compliance, providers, and private control planes remain gated.",
          ],
        },
        {
          title: "No private authority",
          body: [
            "The public Controlled Live surface does not expose founder authority, internal control paths, private infrastructure, secure-shell operations, or irreversible execution. Private surfaces must remain separated from the public deployment.",
          ],
        },
        {
          title: "Availability",
          body: [
            "Controlled Live access may be restricted, interrupted, or removed when required. Financial capability activation depends on authentication, legal, security, compliance, provider, jurisdiction, infrastructure, and founder-approval gates.",
          ],
        },
      ]}
    />
  )
}
