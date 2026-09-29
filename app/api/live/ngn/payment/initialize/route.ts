import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

export const runtime = "nodejs";

export async function POST() {
  const value = createHash("sha256").update("ok").digest("hex");
  return NextResponse.json({ ok: true, value });
}
