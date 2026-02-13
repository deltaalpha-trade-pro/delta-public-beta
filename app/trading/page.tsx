export default function TradingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Trading Dashboard</h1>
        <div className="text-xs text-zinc-400">R0 • Read-only shell</div>
      </div>

      <div className="relative p-6">
        {/* Watermark / licensing stamp (always visible) */}
        <div className="pointer-events-none absolute right-6 top-6 rounded-md border border-zinc-700 bg-black/40 px-3 py-2 text-xs text-zinc-200">
          DeltaAlpha-Trade-Pro
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8 rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 min-h-[480px]">
            <p className="text-sm text-zinc-400">Chart / Market View</p>
            <div className="mt-4 h-[400px] rounded-lg border border-dashed border-zinc-700 flex items-center justify-center text-zinc-500">
              Chart component placeholder
            </div>
          </div>

          <div className="lg:col-span-4 grid gap-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
              <p className="text-sm text-zinc-400">Watchlist</p>
              <ul className="mt-3 text-sm text-zinc-200 space-y-2">
                <li>BTC-USD</li>
                <li>ETH-USD</li>
                <li>SPY</li>
                <li>EURUSD</li>
              </ul>
              <p className="mt-3 text-xs text-zinc-500">
                Public assets are abstracted. Execution routes via Gov + Legal gates.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
              <p className="text-sm text-zinc-400">Order Ticket</p>
              <div className="mt-4 text-zinc-500 text-sm">
                Disabled in R0. Upgrade verification + tier to enable governed execution.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
