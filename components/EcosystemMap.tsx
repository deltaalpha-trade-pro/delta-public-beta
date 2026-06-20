export default function EcosystemMap() {
  return (
    <section className="py-24 flex justify-center relative">

      <div className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-3xl rounded-full animate-pulse" />

      <div className="relative w-full max-w-4xl h-[400px] border border-white/10 rounded-2xl backdrop-blur-xl bg-white/5">

        <div
          className="
            absolute top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            w-24 h-24 rounded-full
            bg-blue-500/20 border border-blue-400/40
            flex items-center justify-center text-xs
          "
        >
          WHALEZ-AI
        </div>

        <div
          className="
            absolute top-20 left-20
            w-20 h-20 rounded-full
            bg-white/10 border border-white/20
            flex items-center justify-center text-[10px]
          "
        >
          DELTAALPHA
        </div>

        <div
          className="
            absolute bottom-20 right-20
            w-20 h-20 rounded-full
            bg-white/10 border border-white/20
            flex items-center justify-center text-[10px]
          "
        >
          INFRA
        </div>

      </div>

    </section>
  );
}
