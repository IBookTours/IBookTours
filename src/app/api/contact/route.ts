import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/services/email';
import { checkRateLimit, getClientIP, rateLimitExceededResponse, RATE_LIMITS } from '@/lib/rateLimit';

// Input length limits
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request.headers);
    const rateLimitResult = checkRateLimit(clientIP, '/api/contact', RATE_LIMITS.contact);

    if (!rateLimitResult.allowed) {
      return rateLimitExceededResponse(rateLimitResult, RATE_LIMITS.contact);
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate input lengths
    if (typeof name !== 'string' || name.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Name must be ${MAX_NAME_LENGTH} characters or less` },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: `Email must be ${MAX_EMAIL_LENGTH} characters or less` },
        { status: 400 }
      );
    }

    if (typeof subject !== 'string' || subject.length > MAX_SUBJECT_LENGTH) {
      return NextResponse.json(
        { error: `Subject must be ${MAX_SUBJECT_LENGTH} characters or less` },
        { status: 400 }
      );
    }

    if (typeof message !== 'string' || message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or less` },
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

    const result = await emailService.sendContactForm({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Contact form error:', message);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
