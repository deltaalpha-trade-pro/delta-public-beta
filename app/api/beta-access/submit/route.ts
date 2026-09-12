import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const payload = await request.json()

    const name = String(payload?.name || "").trim()
    const email = String(payload?.email || "").trim()
    const intendedUse = String(payload?.intendedUse || "").trim()

    if (!name || !email || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Valid name and email are required." },
        { status: 400 },
      )
    }

    if (!intendedUse) {
      return NextResponse.json(
        { ok: false, error: "Intended use is required." },
        { status: 400 },
      )
    }

    const founderConsoleUrl = (
      process.env.FOUNDER_CONSOLE_URL ||
      "https://console.deltaalpha-trade-pro.com"
    ).replace(/\/+$/, "")

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch(
        `${founderConsoleUrl}/public/access/request`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email,
            reason: `Name: ${name}\n\nIntended use:\n${intendedUse}`,
            product: "DeltaAlpha-Trade-Pro",
            source: "deltaalpha-public-beta",
          }),
          signal: controller.signal,
          cache: "no-store",
        },
      )

      const body = await response.json().catch(() => null)

      if (!response.ok) {
        return NextResponse.json(
          {
            ok: false,
            error:
              body?.error ||
              "Beta access is temporarily unavailable. Please try again.",
          },
          { status: 502 },
        )
      }

      return NextResponse.json(
        {
          ok: true,
          accepted: true,
          request_id: body?.request_id,
          status: body?.status || "pending",
        },
        { status: 202 },
      )
    } finally {
      clearTimeout(timeout)
    }
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === "AbortError"
        ? "Beta access is temporarily unavailable. Please try again."
        : "Unable to submit the beta access request right now."

    return NextResponse.json(
      { ok: false, error: message },
      { status: 502 },
    )
  }
}
