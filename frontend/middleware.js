import { NextResponse } from "next/server";
import { auth0 } from "./src/lib/auth0";

export async function middleware(request) {
  const authRes = await auth0.middleware(request);

  // Let Auth0 handle its own routes
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return authRes;
  }

  // Public routes
  const publicPaths = new Set(["/", "/notes", "/exam"]);
  if (publicPaths.has(request.nextUrl.pathname)) {
    return authRes;
  }

  // Require auth for saved questions UI
  if (request.nextUrl.pathname.startsWith("/saved")) {
    const session = await auth0.getSession(request, authRes);
    if (!session) {
      const loginUrl = new URL("/api/auth/login", request.url);
      loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return authRes;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api).*)",
  ],
};
