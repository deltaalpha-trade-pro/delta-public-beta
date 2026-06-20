export default function LiveSystemStatus() {
  const items = [
    { name: "AI Intelligence Layer", status: "ACTIVE" },
    { name: "Market Analysis Layer", status: "ACTIVE" },
    { name: "Infrastructure Network", status: "SYNCING" },
    { name: "Data Orchestration", status: "ACTIVE" },
  ];

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">

      <h3 className="text-lg text-gray-300 mb-6 tracking-widest">
        SYSTEM STATUS
      </h3>

      <div className="grid gap-4">

        {items.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl"
          >
            <span className="text-gray-200">{item.name}</span>

            <span
              className={
                item.status === "ACTIVE"
                  ? "text-xs tracking-widest px-3 py-1 rounded-full bg-green-500/20 text-green-300"
                  : "text-xs tracking-widest px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300"
              }
            >
              {item.status}
            </span>
          </div>
        ))}

      </div>

    </section>
  );
}
