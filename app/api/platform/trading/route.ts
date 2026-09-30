import { NextResponse } from "next/server";
import { platformRequest } from "@/lib/platform/runtime";

export async function GET() {
  try {
    const response = await platformRequest("/v1/platform/trading/orders");
    const data = await response.json().catch(() => ({ ok: false }));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ ok: false, error: "platform_unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const response = await platformRequest("/v1/platform/trading/orders", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({ ok: false }));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ ok: false, error: "platform_unavailable" }, { status: 503 });
  }
}
