import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/services/email';
import { checkRateLimit, getClientIP, rateLimitExceededResponse, RATE_LIMITS } from '@/lib/rateLimit';
import { newsletterSchema, createValidationErrorResponse } from '@/lib/schemas';
import { apiLogger, createRequestLogger } from '@/lib/logger';
import { validateCsrfToken, csrfErrorResponse } from '@/lib/csrf';
import { checkHoneypot } from '@/lib/honeypot';

export async function POST(request: NextRequest) {
  const logger = createRequestLogger(apiLogger, request);

  try {
    // Rate limiting
    const clientIP = getClientIP(request.headers);
    const rateLimitResult = checkRateLimit(clientIP, '/api/newsletter', RATE_LIMITS.newsletter);

    if (!rateLimitResult.allowed) {
      logger.warn('Rate limit exceeded', { clientIP });
      return rateLimitExceededResponse(rateLimitResult, RATE_LIMITS.newsletter);
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
    const validation = newsletterSchema.safeParse(body);

    if (!validation.success) {
      logger.info('Validation failed', { errors: validation.error.issues });
      return NextResponse.json(
        createValidationErrorResponse(validation.error),
        { status: 400 }
      );
    }

    const { email, name } = validation.data;

    logger.info('Processing newsletter subscription', { email });

    const result = await emailService.addToNewsletter(email, name);

    if (!result.success) {
      logger.error('Failed to add to newsletter', result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to subscribe' },
        { status: 500 }
      );
    }

    logger.info('Newsletter subscription successful', { email });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to our newsletter!',
    });
  } catch (error: unknown) {
    logger.error('Newsletter subscription error', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
