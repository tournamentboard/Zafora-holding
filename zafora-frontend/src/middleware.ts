import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth guard skeleton — session checks added in F7.
 * Protects /admin/* routes (except future /admin/login if relocated).
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
