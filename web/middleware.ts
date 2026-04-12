import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Role definitions (must match backend UserRole enum)
const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
} as const;

// Route protection mapping: which roles can access which route prefixes
const ROUTE_GUARDS: Record<string, readonly string[]> = {
  "/admin": [ROLES.ADMIN],
  "/teacher": [ROLES.TEACHER, ROLES.ADMIN],
  "/student": [ROLES.STUDENT],
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

// Extract JWT payload from token (without verification - just decoding)
function decodeJWT(token: string): { role?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    // Base64 decode the payload (using atob for edge runtime compatibility)
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// Get redirect path based on role
function getRoleRedirectPath(role: string | undefined): string {
  switch (role) {
    case ROLES.ADMIN:
      return "/admin";
    case ROLES.TEACHER:
      return "/teacher";
    case ROLES.STUDENT:
      return "/student";
    default:
      return "/login";
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow Next.js internal routes (_next, api, static files, favicon, etc.)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get("token")?.value;

  // No token - redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Decode token to get role
  const decoded = decodeJWT(token);
  if (!decoded) {
    // Invalid token - redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userRole = decoded.role;

  // Check if route is protected
  let isProtectedRoute = false;
  let allowedRoles: readonly string[] = [];

  for (const [prefix, roles] of Object.entries(ROUTE_GUARDS)) {
    if (pathname.startsWith(prefix)) {
      isProtectedRoute = true;
      allowedRoles = roles;
      break;
    }
  }

  // Not a protected route (e.g., root path), allow access
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check if user role is allowed
  if (!userRole || !allowedRoles.includes(userRole)) {
    console.warn(
      `⚠️ Access denied: User role "${userRole}" tried to access "${pathname}". Allowed roles: ${allowedRoles.join(", ")}`
    );
    
    // Redirect to user's appropriate dashboard
    return NextResponse.redirect(
      new URL(getRoleRedirectPath(userRole), request.url)
    );
  }

  // Debug logging for successful access
  console.log(
    `✅ Access granted: ${userRole} -> ${pathname}`
  );

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - service worker
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|fonts|sw.js).*)",
  ],
};
