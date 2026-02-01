import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/services/email';
import { checkRateLimit, getClientIP, rateLimitExceededResponse, RATE_LIMITS } from '@/lib/rateLimit';
import { contactSchema, createValidationErrorResponse } from '@/lib/schemas';
import { apiLogger, createRequestLogger } from '@/lib/logger';
import { validateCsrfToken, csrfErrorResponse } from '@/lib/csrf';
import { checkHoneypot } from '@/lib/honeypot';

export async function POST(request: NextRequest) {
  const logger = createRequestLogger(apiLogger, request);

  try {
    // Rate limiting
    const clientIP = getClientIP(request.headers);
    const rateLimitResult = checkRateLimit(clientIP, '/api/contact', RATE_LIMITS.contact);

    if (!rateLimitResult.allowed) {
      logger.warn('Rate limit exceeded', { clientIP });
      return rateLimitExceededResponse(rateLimitResult, RATE_LIMITS.contact);
    }

    const body = await request.json();

    // SECURITY: Honeypot check for bot detection
    const botResponse = checkHoneypot(body);
    if (botResponse) return botResponse;

    // CSRF validation
    const isValidCsrf = await validateCsrfToken(request, body);
    if (!isValidCsrf) {
      logger.warn('CSRF validation failed', { clientIP });
      return csrfErrorResponse();
    }

    // Validate input with Zod schema
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      logger.info('Validation failed', { errors: validation.error.issues });
      return NextResponse.json(
        createValidationErrorResponse(validation.error),
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validation.data;

    logger.info('Processing contact form submission', { email });

    const result = await emailService.sendContactForm({
      name,
      email,
      subject,
      message,
    });

    if (!result.success) {
      logger.error('Failed to send contact form email', result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to send message' },
        { status: 500 }
      );
    }

    logger.info('Contact form sent successfully', { email });

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!',
    });
  } catch (error: unknown) {
    logger.error('Contact form error', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
