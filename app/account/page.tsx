export default function AccountPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-semibold">Account</h1>

      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
        <p className="text-sm text-zinc-400">Profile</p>
        <div className="mt-3 grid gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-400">Tier</span>
            <span>R0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Verification</span>
            <span>V0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Escrow Policy</span>
            <span>Governed matrix</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-zinc-500">
          Verification upgrades, risk-tier changes, and escrow ratio changes will be policy-bound and PRN-logged.
        </p>
      </div>
    </div>
  );
}
