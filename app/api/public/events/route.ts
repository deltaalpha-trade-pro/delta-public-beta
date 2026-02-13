import { NextResponse } from "next/server";

export async function GET() {
  // Public-safe event feed (effects, not process). Replace with backend later.
  const events = [
    { type: "system_health_green", ts: new Date().toISOString(), severity: "info" },
    { type: "market_state_transition", ts: new Date().toISOString(), state: "stable" },
    { type: "activity_level_changed", ts: new Date().toISOString(), level: "normal" },
  ];
  return NextResponse.json({ events }, { status: 200 });
}
