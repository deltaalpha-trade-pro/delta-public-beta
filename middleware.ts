import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { consoleRouteDecision } from "@/lib/admin-console/routing";

const PROTECTED_PREFIXES = ["/dashboard", "/account", "/trading"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const routing = consoleRouteDecision(req.headers.get("host"), req.headers.get("x-forwarded-host"), pathname);

  if (routing === "deny") {
    return new NextResponse(null, {
      status: 404,
      headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" },
    });
  }
  if (routing === "rewrite-admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/admin-control";
    return NextResponse.rewrite(url);
  }
  if (routing === "allow") return NextResponse.next();

  // Original customer auth boundary is preserved on the public app.
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const access = req.cookies.get("access_token")?.value;
  if (!access) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Evaluate the Admin hostname for every application path; static assets remain
  // Next.js-managed. Do not expose public marketing or financial routes on console.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
