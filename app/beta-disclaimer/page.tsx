import { LegalPage } from "@/components/legal/legal-page"

export default function BetaDisclaimerPage() {
  return (
    <LegalPage
      label="Beta"
      title="Public Beta Disclaimer"
      description="The current site is a controlled public beta surface for review, communication, and staged readiness."
      sections={[
        {
          title: "Beta limitations",
          body: [
            "Features, copy, dashboards, visuals, product modules, and access flows may change before production release. The public beta is not a final commercial service and should not be treated as fully available or fully verified.",
            "Certain surfaces may be placeholders, previews, simulations, or informational pages while backend systems, auth, compliance, and private control planes remain gated.",
          ],
        },
        {
          title: "No private authority",
          body: [
            "The public beta does not expose founder authority, internal control paths, private infrastructure, secure-shell operations, or irreversible execution. Private surfaces must remain separated from the public deployment.",
          ],
        },
        {
          title: "Availability",
          body: [
            "Beta access may be restricted, interrupted, or removed at any time. Launch-readiness depends on auth, legal, security, compliance, infrastructure, and founder approval gates.",
          ],
        },
      ]}
    />
  )
}
