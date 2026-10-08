import { LegalPage } from "@/components/legal/legal-page"

export default function PrivacyPage() {
  return (
    <LegalPage
      label="Privacy"
      title="Privacy Notice"
      description="Privacy terms for Controlled Live account access, analytics, access requests, and platform interactions."
      sections={[
        {
          title: "Information collected",
          body: [
            "During Controlled Live, the site may collect information you provide through access requests, login or signup forms, contact flows, and product interactions.",
            "The deployment may also process standard technical information such as browser, device, IP-derived region, request logs, security events, and analytics needed to operate and protect the public Controlled Live surface.",
          ],
        },
        {
          title: "Use of information",
          body: [
            "Information may be used to operate Controlled Live, review access requests, improve reliability, investigate misuse, protect public/private boundaries, and support account functionality.",
            "The public Controlled Live surface should not be used to submit secrets, private keys, seed phrases, regulated financial records, or sensitive identity documents unless a dedicated verified onboarding flow is provided.",
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
