import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(
    new URL("/founder-console", "http://localhost:3000")
  );

  response.cookies.set("session_token", "founder_internal_access", {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
