import Link from "next/link"
import { AuthCard } from "@/components/auth/auth-card"

export default function LoginPage() {
  return (
    <AuthCard
      title="Beta Access Required"
      subtitle="Sign-in is currently limited to approved beta participants."
      footer={
        <span>
          Need access?{" "}
          <Link className="underline hover:text-zinc-200" href="/beta-access">
            Request beta access
          </Link>
        </span>
      }
    >
      <div className="space-y-4">
        <div className="rounded-md border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-300">
          DeltaAlpha-Trade-Pro is currently being released in controlled stages. Public retail
          sign-in is not yet open from this preview surface.
        </div>

        <Link
          href="/beta-access"
          className="block w-full rounded-md bg-blue-600 hover:bg-blue-500 px-3 py-2 text-center font-medium"
        >
          Request Beta Access
        </Link>

        <div className="text-xs text-zinc-500 text-center">
          This public beta surface is for preview, validation, and staged admission.
        </div>
      </div>
    </AuthCard>
  )
}
