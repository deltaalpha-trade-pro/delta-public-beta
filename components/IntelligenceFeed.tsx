export default function IntelligenceFeed() {
  const feed = [
    "Market signal processed",
    "AI model recalibration complete",
    "Infrastructure sync stable",
    "DeltaAlpha interface updated",
  ];

  return (
    <section className="py-24 px-6 max-w-3xl mx-auto">

      <h3 className="text-lg text-gray-300 mb-6 tracking-widest">
        INTELLIGENCE FEED
      </h3>

      <div className="space-y-3">

        {feed.map((item, i) => (
          <div
            key={i}
            className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl text-gray-300 text-sm"
          >
            {item}
          </div>
        ))}

      </div>

    </section>
  );
}
