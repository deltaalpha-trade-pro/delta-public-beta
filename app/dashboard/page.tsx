import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Beta Preview Dashboard</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Preview-only surface. This does not represent live public execution, live custody,
            or unrestricted production account access.
          </p>
        </div>
        <Link className="rounded-md border border-zinc-700 px-3 py-2 hover:bg-zinc-900" href="/beta-access">
          Beta Access
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <p className="text-sm text-zinc-400">Risk Tier</p>
          <p className="mt-1 text-2xl font-semibold">R0</p>
          <p className="mt-2 text-xs text-zinc-500">Preview-only informational posture. No public capital at risk.</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <p className="text-sm text-zinc-400">Verification</p>
          <p className="mt-1 text-2xl font-semibold">V0</p>
          <p className="mt-2 text-xs text-zinc-500">Illustrative preview state only. Admission and policy tiers come later.</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <p className="text-sm text-zinc-400">System Status</p>
          <p className="mt-1 text-2xl font-semibold">Preview Governed</p>
          <p className="mt-2 text-xs text-zinc-500">Public surface is demonstrating bounded behavior, not live public execution.</p>
        </div>
      </div>

      <div className="mt-8 flex gap-3 flex-wrap">
        <Link className="rounded-md bg-blue-600 hover:bg-blue-500 px-4 py-2" href="/trading">
          Open Trading Preview
        </Link>
        <Link className="rounded-md border border-zinc-700 hover:bg-zinc-900 px-4 py-2" href="/account">
          Preview Account
        </Link>
        <Link className="rounded-md border border-zinc-700 hover:bg-zinc-900 px-4 py-2" href="/beta-access">
          Request Access
        </Link>
      </div>
    </div>
  )
}
