export function EcosystemMap() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4">

        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-[#8eb4e0]">
            Ecosystem
          </p>

          <h2 className="mt-4 text-4xl font-semibold text-white">
            Connected Intelligence Infrastructure
          </h2>

          <p className="mt-5 text-slate-300">
            Public access, intelligent services, financial tooling,
            and ecosystem coordination through a unified platform.
          </p>
        </div>

        <div className="mt-20 flex flex-col items-center">

          <div className="glow-node float-node h-5 w-5 rounded-full bg-blue-400" />

          <div className="mt-3 text-xl font-medium text-white">
            Whalez-AI
          </div>

          <div className="h-16 w-px bg-white/20" />

          <div className="grid w-full max-w-5xl grid-cols-3 gap-8 text-center">

            <div>
              <div className="glow-node float-node mx-auto h-4 w-4 rounded-full bg-cyan-400" />
              <div className="mt-4 text-white">Trading</div>
            </div>

            <div>
              <div className="glow-node float-node mx-auto h-4 w-4 rounded-full bg-blue-400" />
              <div className="mt-4 text-white">Banking</div>
            </div>

            <div>
              <div className="glow-node float-node mx-auto h-4 w-4 rounded-full bg-indigo-400" />
              <div className="mt-4 text-white">Intelligence</div>
            </div>

          </div>

          <div className="mt-12 h-16 w-px bg-white/20" />

          <div className="glow-node float-node h-5 w-5 rounded-full bg-purple-400" />

          <div className="mt-3 text-xl font-medium text-white">
            Whalezchain
          </div>

        </div>
      </div>
    </section>
  )
}
