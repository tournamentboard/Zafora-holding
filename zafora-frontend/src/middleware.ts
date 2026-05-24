import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/src/lib/url-helpers";

/**
 * Fast auth guard for /admin/* routes.
 * Checks for the Express session cookie — if missing, redirect to /login.
 * Deep session verification happens server-side in (admin)/layout.tsx via requireAdmin().
 */
export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("connect.sid");

  if (!sessionCookie) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Only protect /admin/* — login page is outside (admin) group, no middleware needed
  matcher: ["/admin/:path*"],
};
