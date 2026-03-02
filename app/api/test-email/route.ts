import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { ok: false, error: "Email disabled in this deployment (orchestrator-owned)." },
    { status: 503 }
  );
}
