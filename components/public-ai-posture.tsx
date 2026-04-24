export function PublicAiPosture() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur">
        <div className="mb-3 text-xs uppercase tracking-[0.2em] text-emerald-300">
          WHALEZ-AI Public Posture
        </div>

        <h2 className="mb-2 text-2xl font-semibold text-white">
          Hybrid public intelligence surface
        </h2>

        <p className="mb-4 text-sm leading-7 text-zinc-300">
          DeltaAlpha-Trade-Pro exposes WHALEZ-AI in a hybrid posture: narrator-facing in
          public experience, observer-orchestrator-facing in founder and private contexts.
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 text-sm font-medium text-white">Public mode</div>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- narrator-facing</li>
              <li>- simulation-safe</li>
              <li>- authority-bounded</li>
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 text-sm font-medium text-white">Private mode</div>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- observer/orchestrator-facing</li>
              <li>- founder-controlled</li>
              <li>- approval-gated</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
