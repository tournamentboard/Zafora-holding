import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ENV } from "@/src/lib/constants";
import { ROUTES } from "@/src/lib/url-helpers";
import { API } from "@/src/lib/url-helpers";

export interface SessionUser {
  id: number;
  email: string;
  role: string;
}

export interface VerifyResult {
  authenticated: boolean;
  user?: SessionUser;
}

/**
 * Server-side session check — calls the Express /api/auth/verify endpoint,
 * forwarding the session cookie from the incoming request.
 * Safe to call from Server Components and Server Actions.
 */
export async function verifySession(): Promise<VerifyResult> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("connect.sid");

    if (!sessionCookie) return { authenticated: false };

    const res = await fetch(`${ENV.API_URL}${API.AUTH.VERIFY}`, {
      method: "GET",
      headers: {
        Cookie: `${sessionCookie.name}=${sessionCookie.value}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return { authenticated: false };

    return (await res.json()) as VerifyResult;
  } catch {
    return { authenticated: false };
  }
}

/**
 * Guards Server Components inside (admin) layout.
 * Redirects to /login if the session is invalid.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const { authenticated, user } = await verifySession();
  if (!authenticated || !user) {
    redirect(ROUTES.LOGIN);
  }
  return user;
}
