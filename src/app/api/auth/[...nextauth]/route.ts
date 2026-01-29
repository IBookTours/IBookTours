// ============================================
// NEXTAUTH.JS API ROUTE
// ============================================
// Handles all authentication requests with rate limiting

import { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  checkRateLimit,
  getClientIP,
  rateLimitExceededResponse,
  RATE_LIMITS,
} from '@/lib/rateLimit';

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// GET requests (OAuth callbacks, CSRF token, etc.) - no rate limiting needed
export { handler as GET };

// POST requests (sign-in attempts) - apply rate limiting
export async function POST(request: NextRequest) {
  // Rate limit sign-in attempts to prevent brute force attacks
  const clientIP = getClientIP(request.headers);
  const result = checkRateLimit(clientIP, '/api/auth/signin', RATE_LIMITS.auth);

  if (!result.allowed) {
    return rateLimitExceededResponse(result, RATE_LIMITS.auth);
  }

  // Pass to NextAuth handler
  return handler(request);
}
