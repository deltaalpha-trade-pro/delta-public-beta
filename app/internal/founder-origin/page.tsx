import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founder Origin Access | DeltaAlpha-Trade-Pro",
  description: "Protected Founder Origin bridge for private status access.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const originUrl = "https://origin.deltaalpha-trade-pro.com";

export default function FounderOriginBridgePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px",
        display: "grid",
        placeItems: "center",
        color: "#eef6ff",
        background:
          "radial-gradient(circle at 12% 8%, rgba(37,99,235,.24), transparent 34%), radial-gradient(circle at 88% 78%, rgba(20,184,166,.16), transparent 40%), linear-gradient(180deg,#07111f,#03060d 62%,#02040a)",
      }}
    >
      <section
        style={{
          width: "min(920px, 100%)",
          border: "1px solid rgba(125,180,255,.22)",
          borderRadius: "34px",
          padding: "clamp(24px, 6vw, 56px)",
          background:
            "linear-gradient(145deg, rgba(15,23,42,.82), rgba(2,6,23,.62))",
          boxShadow: "0 28px 120px rgba(0,0,0,.5)",
          backdropFilter: "blur(18px)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            border: "1px solid rgba(96,165,250,.32)",
            color: "#a8d1ff",
            borderRadius: "999px",
            padding: "9px 14px",
            letterSpacing: ".18em",
            textTransform: "uppercase",
            fontSize: "11px",
            background: "rgba(96,165,250,.08)",
            marginBottom: "22px",
          }}
        >
          WHALEZ-AI Private Access
        </div>

        <h1
          style={{
            margin: "0 0 18px",
            fontSize: "clamp(42px, 8vw, 82px)",
            lineHeight: ".93",
            letterSpacing: "-.06em",
            maxWidth: "760px",
          }}
        >
          Founder-origin bridge.
        </h1>

        <p
          style={{
            color: "#9fb0c7",
            fontSize: "clamp(17px, 2.4vw, 23px)",
            lineHeight: 1.6,
            maxWidth: "820px",
            margin: 0,
          }}
        >
          This hidden beta bridge points to the protected Founder Origin Status
          Console. Access is controlled by the private origin gate. No
          credentials, execution controls, settlement authority, custody, or
          approval mutation are exposed from this public beta route.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            marginTop: "28px",
          }}
        >
          {[
            ["Private origin", "Served through Cloudflare Tunnel and the local origin gate."],
            ["Read-only status", "Displays protected service visibility without execution controls."],
            ["No public nav", "This route is intentionally hidden from the public navigation."],
          ].map(([title, body]) => (
            <div
              key={title}
              style={{
                border: "1px solid rgba(125,180,255,.22)",
                borderRadius: "24px",
                background: "rgba(2,6,23,.58)",
                padding: "18px",
              }}
            >
              <h2 style={{ margin: "0 0 9px", fontSize: "16px" }}>{title}</h2>
              <p style={{ margin: 0, color: "#9fb0c7", fontSize: "14px", lineHeight: 1.55 }}>
                {body}
              </p>
            </div>
          ))}
        </div>

        <a
          href={originUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            marginTop: "28px",
            padding: "14px 18px",
            borderRadius: "999px",
            color: "#03111f",
            background: "linear-gradient(135deg, #93c5fd, #67e8f9)",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          Open protected Founder Origin
        </a>

        <div
          style={{
            marginTop: "24px",
            border: "1px solid rgba(247,212,119,.28)",
            color: "#f7d477",
            borderRadius: "22px",
            padding: "16px 18px",
            background: "rgba(247,212,119,.07)",
            lineHeight: 1.55,
            fontSize: "14px",
          }}
        >
          Founder approval remains required before any live capability,
          governance approval endpoint, infrastructure operation, or
          irreversible control is connected.
        </div>
      </section>
    </main>
  );
}
