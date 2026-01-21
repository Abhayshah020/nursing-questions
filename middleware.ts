import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  const DEFAULT_AUTH_REDIRECT = "/dashboard";

  // 🔐 Routes user is allowed to access AFTER login
  const allowedAfterLogin = ["/dashboard", "/settings"];

  // 🔓 Public routes (no auth required)
  const publicRoutes = ["/", "/register"];

  const isAllowedAfterLogin = allowedAfterLogin.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isPublicRoute = publicRoutes.includes(pathname);

  // 🚫 Not logged in → block protected routes
  if (!accessToken && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🚫 Logged in → block access to routes not in allowlist
  if (accessToken && !isAllowedAfterLogin) {
    return NextResponse.redirect(new URL(DEFAULT_AUTH_REDIRECT, request.url));
  }

  // 🔑 Admin-only check for /settings
  if (pathname.startsWith("/settings") && accessToken) {
    try {
      const decoded = jwt.decode(accessToken) as any;
      if (!["admin", "superadmin"].includes(decoded?.role)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      // Invalid token → redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Only match the routes you need
export const config = {
  matcher: ["/", "/dashboard/:path*", "/settings/:path*"],
};
