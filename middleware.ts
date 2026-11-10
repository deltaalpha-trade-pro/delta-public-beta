import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { consoleRouteDecision } from "@/lib/admin-console/routing";

const PRIVATE_PREFIXES = ["/founder", "/founder-console", "/internal", "/mail"];
const PROTECTED_PREFIXES = ["/dashboard", "/account", "/trading", "/terminal"];
const matchesPrefix = (path: string, prefix: string) => path === prefix || path.startsWith(prefix + "/");

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
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

  // Public hosts cannot inherit private Founder, internal or mail routes.
  if (PRIVATE_PREFIXES.some((p) => matchesPrefix(pathname, p))) {
    return new NextResponse(null, {
      status: 404,
      headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" },
    });
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => matchesPrefix(pathname, p));
  if (!isProtected) return NextResponse.next();

  const redirectToLogin = (unavailable = false) => {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname + search);
    if (unavailable) url.searchParams.set("auth", "unavailable");
    return NextResponse.redirect(url);
  };
  const access = req.cookies.get("access_token")?.value;
  if (!access) return redirectToLogin();

  try {
    // A cookie's presence is not proof of an authenticated, verified account.
    const response = await fetch(new URL("/api/auth/me", req.url), {
      headers: { cookie: req.headers.get("cookie") || "" },
      cache: "no-store",
    });
    if (!response.ok) return redirectToLogin(response.status >= 500);
    const session: unknown = await response.json().catch(() => null);
    if (!session || typeof session !== "object" || Array.isArray(session)) return redirectToLogin();
    const account = session as Record<string, unknown>;
    // Never allow preview/demo tokens or unverified users into customer actions.
    if (account.mode === "demo" || account.email_verified !== true) return redirectToLogin();
    return NextResponse.next();
  } catch {
    return redirectToLogin(true);
  }
}

export const config = {
  // Evaluate the Admin hostname for every application path; static assets remain
  // Next.js-managed. Do not expose public marketing or financial routes on console.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
