import { LegalPage } from "@/components/legal/legal-page"

export default function PrivacyPage() {
  return (
    <LegalPage
      label="Privacy"
      title="Privacy Notice"
      description="A public beta privacy notice for account access, analytics, beta requests, and platform interactions."
      sections={[
        {
          title: "Information collected",
          body: [
            "During beta, the site may collect information you provide through access requests, login or signup forms, contact flows, and product interactions.",
            "The deployment may also process standard technical information such as browser, device, IP-derived region, request logs, security events, and analytics needed to operate and protect the public beta.",
          ],
        },
        {
          title: "Use of information",
          body: [
            "Information may be used to operate the beta, review access requests, improve reliability, investigate misuse, protect public/private boundaries, and prepare future account functionality.",
            "The public beta should not be used to submit secrets, private keys, seed phrases, regulated financial records, or sensitive identity documents unless a dedicated verified onboarding flow is provided.",
          ],
        },
        {
          title: "Private surfaces",
          body: [
            "Founder, internal, and protected control surfaces are not public services. Public site visitors should not expect access to private operational systems from this domain.",
          ],
        },
      ]}
    />
  )
}
