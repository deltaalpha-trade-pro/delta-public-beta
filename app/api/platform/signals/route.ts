import { NextResponse } from "next/server";
import { platformRequest } from "@/lib/platform/runtime";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 50)));
    const response = await platformRequest(`/v1/platform/signals?limit=${limit}`);
    const data = await response.json().catch(() => ({ ok: false }));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ ok: false, error: "platform_unavailable" }, { status: 503 });
  }
}
