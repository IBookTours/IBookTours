// ============================================
// SECURITY MIDDLEWARE
// ============================================
// Route protection for authenticated and admin-only routes
// This middleware runs on every request matching the configured paths

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes that require authentication
const protectedRoutes = ['/profile'];

// Routes that require admin role
const adminRoutes = ['/studio'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the JWT token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'itravel-demo-secret-change-in-production',
  });

  // Check if the current path requires admin access
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Check if the current path requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Handle admin routes - require admin role
  if (isAdminRoute) {
    // Not authenticated - redirect to sign in
    if (!token) {
      const signInUrl = new URL('/api/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Authenticated but not admin - redirect to home with error
    if (token.role !== 'admin') {
      const homeUrl = new URL('/', request.url);
      homeUrl.searchParams.set('error', 'unauthorized');
      homeUrl.searchParams.set(
        'message',
        'Admin access required for Sanity Studio'
      );
      return NextResponse.redirect(homeUrl);
    }

    // Admin user - allow access
    return NextResponse.next();
  }

  // Handle protected routes - require authentication
  if (isProtectedRoute) {
    if (!token) {
      const signInUrl = new URL('/api/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Authenticated user - allow access
    return NextResponse.next();
  }

  // Public route - allow access
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Match protected routes
    '/profile/:path*',
    // Match admin routes (Sanity Studio)
    '/studio/:path*',
    // Exclude static files and API routes (except auth)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
