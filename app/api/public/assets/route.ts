import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      source: "unconfigured",
      live: false,
      asset_classes: ["crypto", "equity", "fx", "etf", "index", "commodity"],
      newly_registered: [],
      note: "No verified public asset registry is configured; this endpoint does not assert asset availability.",
    },
    {
      status: 200,
      headers: { "cache-control": "no-store, max-age=0" },
    },
  );
}
