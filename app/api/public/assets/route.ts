import { NextResponse } from "next/server";

export async function GET() {
  // Public-safe, abstract asset exposure. Replace with backend call later.
  return NextResponse.json(
    {
      asset_classes: ["crypto", "equity", "fx", "etf", "index", "commodity"],
      newly_registered: [
        { symbol: "BTC-USD", asset_class: "crypto", status: "active" },
        { symbol: "ETH-USD", asset_class: "crypto", status: "active" },
        { symbol: "SPY", asset_class: "etf", status: "active" },
        { symbol: "EURUSD", asset_class: "fx", status: "active" },
      ],
      note: "Public surface is non-actionable. Execution is gated by governance & legal triggers.",
    },
    { status: 200 }
  );
}
