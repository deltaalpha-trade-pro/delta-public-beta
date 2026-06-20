export default function HeroCore() {
  return (
    <section className="h-[90vh] flex flex-col items-center justify-center relative overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-black to-black" />

      <div className="absolute w-[600px] h-[600px] bg-blue-500/10 blur-3xl rounded-full animate-pulse" />

      <h1 className="text-5xl md:text-7xl font-light tracking-widest z-10">
        WHALEZ-AI
      </h1>

      <h2 className="mt-4 text-xl text-gray-300 z-10">
        ECOSYSTEM INTELLIGENCE LAYER
      </h2>

      <div className="mt-8 flex items-center gap-3 text-sm text-gray-400 z-10">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        SYSTEM ACTIVE • SYNCHRONIZED INTELLIGENCE
      </div>

    </section>
  );
}
