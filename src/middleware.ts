import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Enforce HTTPS in production
  if (process.env.NODE_ENV === "production" && request.headers.get("x-forwarded-proto") !== "https") {
    const url = request.nextUrl.clone();
    url.protocol = "https";
    return NextResponse.redirect(url);
  }

  // Only protect admin sub-routes, not the login page itself
  if (
    pathname.startsWith("/admin/") &&
    pathname !== "/admin"
  ) {
    const session = request.cookies.get("admin_session");
    if (session?.value !== "authenticated") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  
  // CSP header (adjust as needed for your app)
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://fkziznlgeujbwxxxcgsl.supabase.co;"
  );

  return response;
}

export const config = {
  matcher: ["/admin/:path+", "/:path+"],
};
