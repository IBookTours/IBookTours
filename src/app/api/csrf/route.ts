/**
 * CSRF Token API
 *
 * GET /api/csrf - Generate and return a CSRF token
 *
 * The token is set in an httpOnly cookie AND returned in the response body.
 * Client should include the token in POST requests as 'csrf' field in body
 * or 'x-csrf-token' header.
 */

import { NextResponse } from 'next/server';
import { setCsrfCookie } from '@/lib/csrf';

/**
 * Generate a new CSRF token
 * Sets httpOnly cookie and returns token for client use
 */
export async function GET() {
  try {
    const token = await setCsrfCookie();

    return NextResponse.json({ csrf: token });
  } catch (error) {
    console.error('CSRF token generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}
