import { LegalPage } from "@/components/legal/legal-page"

export default function CookiesPage() {
  return (
    <LegalPage
      label="Cookies"
      title="Cookie Notice"
      description="Cookie and local storage notice for the DeltaAlpha-TradePro public beta."
      sections={[
        {
          title: "Essential storage",
          body: [
            "The site may use cookies or local storage for essential functions such as session handling, security, form state, preferences, and beta access flows.",
            "If authentication is enabled, auth-related cookies should be treated as security-sensitive and should not be shared or copied.",
          ],
        },
        {
          title: "Analytics and performance",
          body: [
            "The public beta may use analytics or performance tooling to understand reliability, route usage, errors, and user experience. This supports launch readiness and does not enable private authority.",
          ],
        },
        {
          title: "Control",
          body: [
            "You can manage cookies through your browser settings. Some site features may not function correctly if essential cookies are blocked.",
          ],
        },
      ]}
    />
  )
}
