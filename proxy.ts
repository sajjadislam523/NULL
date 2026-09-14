import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Coarse gate only: redirects fully logged-out visitors away from
 * /admin before the page even starts rendering. `getToken` just decodes
 * the JWT cookie — it does NOT run the `jwt` callback in lib/auth/options.ts,
 * so it can't see a disabled-user invalidation that happened after the
 * token was issued. That authoritative check happens in app/admin/layout.tsx
 * via requireUser(), which does trigger the callback. Per-route role
 * checks (forbidden()) also happen there/in each page, not here — Next.js
 * Server Functions aren't covered by this file's matcher at all, so they
 * must (and do) re-check permissions themselves regardless.
 */
export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
