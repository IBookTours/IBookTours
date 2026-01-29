/**
 * CSRF Protection Utilities
 *
 * Provides CSRF token generation and validation for form submissions.
 * Uses a double-submit cookie pattern combined with the NextAuth session.
 *
 * Usage:
 * 1. Generate token on server: const token = generateCsrfToken()
 * 2. Include token in form: <input type="hidden" name="csrf" value={token} />
 * 3. Validate in API route: validateCsrfToken(request)
 */

import { randomBytes, createHmac } from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// CSRF token cookie name
const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_SECRET = process.env.NEXTAUTH_SECRET || 'dev-csrf-secret';
const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Generate a CSRF token
 * The token consists of: timestamp.randomBytes.signature
 */
export function generateCsrfToken(): string {
  const timestamp = Date.now().toString();
  const random = randomBytes(16).toString('hex');
  const data = `${timestamp}.${random}`;
  const signature = createHmac('sha256', CSRF_SECRET).update(data).digest('hex');
  return `${data}.${signature}`;
}

/**
 * Validate a CSRF token
 * Checks signature validity and expiration
 */
export function isValidCsrfToken(token: string): boolean {
  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [timestamp, random, signature] = parts;

  // Verify signature
  const data = `${timestamp}.${random}`;
  const expectedSignature = createHmac('sha256', CSRF_SECRET).update(data).digest('hex');

  if (signature !== expectedSignature) {
    return false;
  }

  // Check expiration
  const tokenTime = parseInt(timestamp, 10);
  if (isNaN(tokenTime) || Date.now() - tokenTime > CSRF_TOKEN_EXPIRY) {
    return false;
  }

  return true;
}

/**
 * Set CSRF token cookie and return the token
 * Call this in a Server Component or API route
 */
export async function setCsrfCookie(): Promise<string> {
  const token = generateCsrfToken();
  const cookieStore = await cookies();

  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });

  return token;
}

/**
 * Get CSRF token from cookie
 */
export async function getCsrfTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE_NAME)?.value ?? null;
}

/**
 * Validate CSRF token from request
 * Compares token in request body/header with cookie token
 *
 * @param request - The NextRequest object
 * @param body - The parsed request body (optional, for JSON APIs)
 * @returns true if valid, false otherwise
 */
export async function validateCsrfToken(
  request: NextRequest,
  body?: Record<string, unknown>
): Promise<boolean> {
  // Get token from cookie
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  if (!cookieToken || !isValidCsrfToken(cookieToken)) {
    return false;
  }

  // Get token from request (header or body)
  const headerToken = request.headers.get('x-csrf-token');
  const bodyToken = body?.csrf as string | undefined;
  const requestToken = headerToken || bodyToken;

  if (!requestToken) {
    return false;
  }

  // Double-submit: both tokens must match and be valid
  return cookieToken === requestToken && isValidCsrfToken(requestToken);
}

/**
 * CSRF validation error response
 */
export function csrfErrorResponse() {
  return new Response(
    JSON.stringify({ error: 'Invalid or missing CSRF token' }),
    {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
