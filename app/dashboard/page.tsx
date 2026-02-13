import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <form action="/api/auth/logout" method="post">
          <button className="rounded-md border border-zinc-700 px-3 py-2 hover:bg-zinc-900">
            Logout
          </button>
        </form>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <p className="text-sm text-zinc-400">Risk Tier</p>
          <p className="mt-1 text-2xl font-semibold">R0</p>
          <p className="mt-2 text-xs text-zinc-500">Informational only. No capital at risk.</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <p className="text-sm text-zinc-400">Verification</p>
          <p className="mt-1 text-2xl font-semibold">V0</p>
          <p className="mt-2 text-xs text-zinc-500">Upgrade later to unlock higher tiers.</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <p className="text-sm text-zinc-400">System Status</p>
          <p className="mt-1 text-2xl font-semibold">Governed</p>
          <p className="mt-2 text-xs text-zinc-500">Execution is gated by Gov + Legal triggers.</p>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link className="rounded-md bg-blue-600 hover:bg-blue-500 px-4 py-2" href="/trading">
          Open Trading Dashboard
        </Link>
        <Link className="rounded-md border border-zinc-700 hover:bg-zinc-900 px-4 py-2" href="/account">
          Account
        </Link>
      </div>
    </div>
  );
}
