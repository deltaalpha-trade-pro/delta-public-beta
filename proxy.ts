import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16+ proxy entrypoint (replacement for middleware.ts)
 * - Keep this file as the ONLY edge-gating entrypoint
 * - Do not keep /middleware.ts at repo root (Next will fail build)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Founder console protection (edge gate)
  if (pathname.startsWith("/founder-console")) {
    const sessionToken = request.cookies.get("session_token")?.value;
    const founderBypass = request.cookies.get("founder_bypass")?.value;

    // Allow bypass ONLY in internal mode / non-prod (avoid accidental prod backdoor)
    const allowBypass =
      process.env.INTERNAL_MODE === "true" || process.env.NODE_ENV !== "production";

    if (allowBypass && founderBypass === "true") {
      return NextResponse.next();
    }

    // If not authenticated, redirect to request page
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/request-access", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/founder-console/:path*"],
};
