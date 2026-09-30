import { NextResponse } from "next/server";
import { platformRequest } from "@/lib/platform/runtime";

export async function GET() {
  try {
    const response = await platformRequest("/v1/platform/capabilities");
    const data = await response.json().catch(() => ({ ok: false }));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ ok: false, error: "platform_unavailable" }, { status: 503 });
  }
}
