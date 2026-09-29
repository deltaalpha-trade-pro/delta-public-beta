import { NextResponse } from "next/server";
import { getLiveIdentity } from "@/lib/live-settlement/auth";

export const runtime = "nodejs";

export async function POST() {
  void getLiveIdentity;
  return NextResponse.json({ ok: true, corridor: "NGN" });
}
