import { NextResponse } from "next/server";
import { z } from "zod";

import { getLiveIdentity } from "@/lib/live-settlement/auth";
import { postSettlementRuntime } from "@/lib/live-settlement/runtime";

export const runtime = "nodejs";

const requestSchema = z.object({
  correlation_id: z.string().trim().min(8).max(128),
});

export async function POST(request: Request) {
  const identity = await getLiveIdentity();
  if (identity.ok === false) {
    return NextResponse.json({ ok: false, error: identity.error }, { status: identity.status });
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  try {
    const result = await postSettlementRuntime("/internal/settlement/status", {
      correlation_id: parsed.data.correlation_id,
      user_id: identity.identity.user_id,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "private_runtime_unavailable" },
      { status: 503 },
    );
  }
}
