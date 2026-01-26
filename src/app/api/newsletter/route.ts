import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/services/email';
import { checkRateLimit, getClientIP, rateLimitExceededResponse, RATE_LIMITS } from '@/lib/rateLimit';

// Input length limits
const MAX_EMAIL_LENGTH = 254;
const MAX_NAME_LENGTH = 100;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request.headers);
    const rateLimitResult = checkRateLimit(clientIP, '/api/newsletter', RATE_LIMITS.newsletter);

    if (!rateLimitResult.allowed) {
      return rateLimitExceededResponse(rateLimitResult, RATE_LIMITS.newsletter);
    }

    const body = await request.json();
    const { email, name } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate input types and lengths
    if (typeof email !== 'string' || email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: `Email must be ${MAX_EMAIL_LENGTH} characters or less` },
        { status: 400 }
      );
    }

    if (name && (typeof name !== 'string' || name.length > MAX_NAME_LENGTH)) {
      return NextResponse.json(
        { error: `Name must be ${MAX_NAME_LENGTH} characters or less` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const result = await emailService.addToNewsletter(
      email.trim().toLowerCase(),
      name ? name.trim() : undefined
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to subscribe' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to our newsletter!',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Newsletter subscription error:', message);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
