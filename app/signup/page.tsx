import Link from "next/link"
import { AuthCard } from "@/components/auth/auth-card"

export default function SignupPage() {
  return (
    <AuthCard
      title="Join the Controlled Beta"
      subtitle="Public onboarding is currently admission-based while the platform remains in preview."
      footer={
        <span>
          Already requested access?{" "}
          <Link className="underline hover:text-zinc-200" href="/beta-access">
            View beta access details
          </Link>
        </span>
      }
    >
      <div className="space-y-4">
        <div className="rounded-md border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-300">
          Account creation is not yet open as unrestricted public registration from this preview repository.
          Access is being reviewed and granted in stages.
        </div>

        <Link
          href="/beta-access"
          className="block w-full rounded-md bg-blue-600 hover:bg-blue-500 px-3 py-2 text-center font-medium"
        >
          Request Beta Access
        </Link>

        <div className="text-xs text-zinc-500 text-center">
          This does not yet represent full public launch onboarding.
        </div>
      </div>
    </AuthCard>
  )
}
