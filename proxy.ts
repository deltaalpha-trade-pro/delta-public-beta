import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const INTERNAL_ROUTES = ["/founder-console"]

export function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl

  const isInternalDomain = hostname.startsWith("internal.")
  const isBetaDomain = hostname.startsWith("beta.") || !isInternalDomain

  // Check if route is internal-only
  if (INTERNAL_ROUTES.some((route) => pathname.startsWith(route))) {
    const isInternalMode = process.env.WHALEZ_MODE === "INTERNAL"
    const internalToken = request.headers.get("x-whalez-internal-token")
    const requestSource = request.headers.get("x-request-source")

    // STREAM 1: Return 404 unless INTERNAL mode with valid headers
    // Also reject if accessing internal route from beta.* domain
    if (!isInternalMode || !internalToken || requestSource !== "internal-console" || isBetaDomain) {
      // Return 404 - no acknowledgment that route exists
      return NextResponse.rewrite(new URL("/not-found", request.url))
    }
  }

  const response = NextResponse.next()
  response.headers.set("x-domain-context", isBetaDomain ? "public" : "internal")

  return response
}

export const config = {
  matcher: ["/founder-console/:path*", "/((?!_next|api|favicon.ico).*)"],
}
