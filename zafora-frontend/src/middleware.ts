import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/src/lib/url-helpers";

/**
 * Fast auth guard for /admin/* routes.
 * Checks for the JWT access_token cookie — if absent, check refresh_token.
 * If neither is present, redirect to /login.
 * Deep token validation happens server-side in (admin)/layout.tsx via requireAdmin().
 */
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");

  if (!accessToken && !refreshToken) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
