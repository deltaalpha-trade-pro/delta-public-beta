import { NextResponse } from "next/server";

export async function POST() {
  // Intentionally does NOT send email from the public beta surface.
  // Beta access notifications are orchestrator-owned.
  return NextResponse.json(
    { ok: true, accepted: true, notice: "Request received. Review is handled internally." },
    { status: 202 }
  );
}
