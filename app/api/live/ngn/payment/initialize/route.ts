import { NextResponse } from "next/server";
import { getLiveIdentity } from "@/lib/live-settlement/auth";
import { initializePaystackTransaction } from "@/lib/live-settlement/paystack";
import { postSettlementRuntime, SettlementRuntimeError } from "@/lib/live-settlement/runtime";

export const runtime = "nodejs";

export async function POST() {
  void getLiveIdentity;
  void initializePaystackTransaction;
  void postSettlementRuntime;
  void SettlementRuntimeError;
  return NextResponse.json({ ok: true, corridor: "NGN" });
}
