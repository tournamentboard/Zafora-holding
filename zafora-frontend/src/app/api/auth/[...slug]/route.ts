import { type NextRequest, NextResponse } from "next/server";

const BACKEND = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

/**
 * Proxy all /api/auth/* requests to the Railway backend.
 *
 * The next.config.ts rewrite silently drops Set-Cookie headers, so the
 * browser never receives the JWT cookies after login. This Route Handler
 * explicitly copies every upstream header — including Set-Cookie — into
 * the response so the browser stores the httpOnly cookies correctly.
 */
async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  if (!BACKEND) {
    return NextResponse.json(
      { error: "API backend URL is not configured" },
      { status: 503 },
    );
  }

  const { slug } = await params;
  const backendUrl = `${BACKEND}/api/auth/${slug.join("/")}`;

  // Forward the browser's cookies to the backend
  const cookieHeader = request.cookies
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const reqHeaders: Record<string, string> = {
    Accept: "application/json",
  };
  const contentType = request.headers.get("content-type");
  if (contentType) reqHeaders["Content-Type"] = contentType;
  if (cookieHeader) reqHeaders["Cookie"] = cookieHeader;

  const init: RequestInit = { method: request.method, headers: reqHeaders };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const upstream = await fetch(backendUrl, init);

  // Copy ALL upstream headers so Set-Cookie reaches the browser
  const resHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    resHeaders.append(key, value);
  });

  const body = await upstream.arrayBuffer();
  return new NextResponse(body, { status: upstream.status, headers: resHeaders });
}

export { handler as GET, handler as POST };
