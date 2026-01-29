import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { paymentService } from '@/lib/services/payment';
import { checkRateLimit, getClientIP, rateLimitExceededResponse, RATE_LIMITS } from '@/lib/rateLimit';
import { createValidationErrorResponse } from '@/lib/schemas';
import { paymentLogger, createRequestLogger } from '@/lib/logger';

// Payment limits
const MAX_AMOUNT = 1000000; // €10,000 in cents

// Custom schema for this endpoint (includes tour-specific fields)
const createPaymentIntentSchema = z.object({
  amount: z
    .number()
    .int('Amount must be an integer')
    .min(100, 'Minimum is €1.00 (100 cents)')
    .max(MAX_AMOUNT, 'Amount exceeds maximum allowed'),

  currency: z
    .enum(['eur', 'usd', 'gbp', 'all'], {
      message: 'Invalid currency',
    })
    .default('eur'),

  tourId: z
    .string()
    .max(100, 'Tour ID must be less than 100 characters')
    .optional(),

  tourName: z
    .string()
    .max(200, 'Tour name must be less than 200 characters')
    .optional(),
});

export async function POST(request: NextRequest) {
  const logger = createRequestLogger(paymentLogger, request);

  try {
    // Rate limiting
    const clientIP = getClientIP(request.headers);
    const rateLimitResult = checkRateLimit(clientIP, '/api/create-payment-intent', RATE_LIMITS.payment);

    if (!rateLimitResult.allowed) {
      logger.warn('Rate limit exceeded', { clientIP });
      return rateLimitExceededResponse(rateLimitResult, RATE_LIMITS.payment);
    }

    const body = await request.json();

    // Validate input with Zod schema
    const validation = createPaymentIntentSchema.safeParse(body);

    if (!validation.success) {
      logger.info('Validation failed', { errors: validation.error.issues });
      return NextResponse.json(
        createValidationErrorResponse(validation.error),
        { status: 400 }
      );
    }

    const { amount, currency, tourId, tourName } = validation.data;

    logger.info('Creating payment intent', { amount, currency, tourId });

    const paymentIntent = await paymentService.createPaymentIntent({
      amount,
      currency,
      metadata: {
        tourId: tourId ?? '',
        tourName: tourName ?? '',
      },
      description: tourName ? `ITravel - ${tourName}` : 'ITravel Tour Booking',
    });

    logger.info('Payment intent created', { paymentIntentId: paymentIntent.id });

    return NextResponse.json({
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: unknown) {
    logger.error('Create payment intent error', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
