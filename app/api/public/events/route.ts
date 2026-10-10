import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      source: "unconfigured",
      live: false,
      events: [],
      message: "No verified public event feed is configured.",
    },
    {
      status: 200,
      headers: { "cache-control": "no-store, max-age=0" },
    },
  );
}
