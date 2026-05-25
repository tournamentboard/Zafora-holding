import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/src/lib/url-helpers";

/**
 * 1. Auth guard: /admin/* routes require JWT cookies.
 * 2. Maintenance guard: public pages redirect to /maintenance when enabled.
 *    Uses a cached header set by the backend or falls back to a setting fetch.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Auth guard ────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    const accessToken = request.cookies.get("access_token");
    const refreshToken = request.cookies.get("refresh_token");

    if (!accessToken && !refreshToken) {
      const loginUrl = new URL(ROUTES.LOGIN, request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ── Maintenance guard (public routes only) ─────────────────────────
  // Skip: login, api, _next, static assets, and the maintenance page itself
  const isPublicBypass =
    pathname === "/maintenance" ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/login");

  if (!isPublicBypass) {
    try {
      const apiBase = process.env["NEXT_PUBLIC_API_URL"];
      const res = await fetch(`${apiBase}/api/content/settings/maintenance_mode`, {
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const setting = await res.json() as { value?: string };
        const mode = setting?.value ? JSON.parse(setting.value) : {};
        if (mode?.enabled === true) {
          return NextResponse.redirect(new URL("/maintenance", request.url));
        }
      }
    } catch {
      // Backend unavailable — allow through to avoid hard failure
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2?|ttf|eot)).*)",
  ],
};
