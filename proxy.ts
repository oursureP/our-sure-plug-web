import { NextRequest, NextResponse } from "next/server";
import { TOKEN_KEY } from "./app/lib/auth-cookies";

// Routes that require authentication
const PROTECTED_PREFIXES = ["/dashboard", "/portal"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_KEY)?.value;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  // No token on a protected route → redirect to login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); // remember where they were going
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in but visiting login → send to dashboard
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/portal/:path*", "/login"],
};
