// ============================================
// SECURITY MIDDLEWARE
// ============================================
// Route protection for authenticated and admin-only routes
// This middleware runs on every request matching the configured paths

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Get the secret - REQUIRED for JWT verification
const getSecret = () => {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    console.error('CRITICAL: NEXTAUTH_SECRET is not set in production!');
    return undefined; // Will cause token verification to fail safely
  }
  return secret || 'dev-only-insecure-secret-do-not-use-in-production';
};

// Routes that require authentication
const protectedRoutes = ['/profile'];

// API routes that require authentication (returns 401 instead of redirect)
const protectedApiRoutes = ['/api/create-payment-intent', '/api/bookings'];

// Routes that require admin role
const adminRoutes = ['/studio'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the JWT token from the request
  const token = await getToken({
    req: request,
    secret: getSecret(),
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

  // Handle protected API routes - return 401 instead of redirect
  const isProtectedApiRoute = protectedApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedApiRoute) {
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Authenticated user - allow access
    return NextResponse.next();
  }

  // Public route - allow access
  return NextResponse.next();
}

// Configure which routes the middleware should run on
// SECURITY: Explicit route matching for protected endpoints
export const config = {
  matcher: [
    // Protected user routes (requires authentication)
    '/profile/:path*',
    // Admin routes (requires admin role)
    '/studio/:path*',
    // Protected API routes (returns 401 if not authenticated)
    '/api/create-payment-intent',
    '/api/bookings/:path*',
  ],
};
