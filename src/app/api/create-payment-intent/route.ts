import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getToken } from 'next-auth/jwt';
import { paymentService } from '@/lib/services/payment';
import { getUserService } from '@/lib/services/user';
import { getBookingService } from '@/lib/services/booking';
import { getEmailService } from '@/lib/services/email';
import { checkRateLimit, getClientIP, rateLimitExceededResponse, RATE_LIMITS } from '@/lib/rateLimit';
import { createValidationErrorResponse } from '@/lib/schemas';
import { paymentLogger, createRequestLogger } from '@/lib/logger';
import { verifyPaymentAmount } from '@/lib/priceVerification';
import { validateCsrfToken, csrfErrorResponse } from '@/lib/csrf';
import { escapeHtml } from '@/lib/services/email/templates/base';

// Payment limits
const MAX_AMOUNT = 1000000; // €10,000 in cents

// Custom schema for this endpoint (includes tour-specific fields and booker info)
const createPaymentIntentSchema = z.object({
  // Payment details
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

  // Tour details
  tourId: z
    .string()
    .max(100, 'Tour ID must be less than 100 characters'),

  tourName: z
    .string()
    .max(200, 'Tour name must be less than 200 characters'),

  // Booker information (required for guest checkout)
  bookerEmail: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),

  bookerName: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),

  bookerPhone: z
    .string()
    .max(50, 'Phone must be less than 50 characters')
    .optional(),

  // Booking details
  travelers: z
    .number()
    .int('Number of travelers must be an integer')
    .min(1, 'Minimum 1 traveler')
    .max(50, 'Maximum 50 travelers')
    .default(1),

  selectedDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),

  specialRequests: z
    .string()
    .max(1000, 'Special requests must be less than 1000 characters')
    .optional(),
});

export async function POST(request: NextRequest) {
  const logger = createRequestLogger(paymentLogger, request);

  try {
    // SECURITY: Verify authentication (middleware should have already checked, but double-check)
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'dev-only-insecure-secret-do-not-use-in-production',
    });

    if (!token || !token.email) {
      logger.warn('Unauthenticated payment attempt');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // SECURITY: Validate CSRF token
    const body = await request.json();
    const csrfValid = await validateCsrfToken(request, body);
    if (!csrfValid) {
      logger.warn('Invalid CSRF token on payment request');
      return csrfErrorResponse();
    }

    // Rate limiting
    const clientIP = getClientIP(request.headers);
    const rateLimitResult = checkRateLimit(clientIP, '/api/create-payment-intent', RATE_LIMITS.payment);

    if (!rateLimitResult.allowed) {
      logger.warn('Rate limit exceeded', { clientIP });
      return rateLimitExceededResponse(rateLimitResult, RATE_LIMITS.payment);
    }

    // Note: body was already parsed above for CSRF validation

    // Validate input with Zod schema
    const validation = createPaymentIntentSchema.safeParse(body);

    if (!validation.success) {
      logger.info('Validation failed', { errors: validation.error.issues });
      return NextResponse.json(
        createValidationErrorResponse(validation.error),
        { status: 400 }
      );
    }

    const {
      amount,
      currency,
      tourId,
      tourName,
      bookerEmail,
      bookerName,
      bookerPhone,
      travelers,
      selectedDate,
      specialRequests,
    } = validation.data;

    // SECURITY: Verify the email matches the authenticated user
    if (bookerEmail.toLowerCase() !== token.email.toLowerCase()) {
      logger.warn('Email mismatch in payment request', {
        tokenEmail: token.email,
        bookerEmail,
      });
      return NextResponse.json(
        { error: 'Booker email must match authenticated user' },
        { status: 403 }
      );
    }

    // SECURITY: Verify payment amount against tour database
    const priceVerification = await verifyPaymentAmount(tourId, amount, travelers);

    if (!priceVerification.valid) {
      logger.warn('Price manipulation detected', {
        tourId,
        submittedAmount: amount,
        expectedAmount: priceVerification.expectedAmountCents,
        reason: priceVerification.reason,
      });
      return NextResponse.json(
        { error: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    logger.info('Creating payment intent', {
      amount,
      currency,
      tourId,
      userId: token.sub,
      verifiedPrice: priceVerification.expectedAmountCents,
    });

    // Get services
    const userService = getUserService();
    const bookingService = getBookingService();
    const emailService = getEmailService();

    // Step 1: Get the authenticated user (no auto-creation)
    const user = await userService.findByEmail(token.email);

    if (!user) {
      logger.error('Authenticated user not found in database', { email: token.email });
      return NextResponse.json(
        { error: 'User account not found' },
        { status: 404 }
      );
    }

    logger.info('User resolved', { userId: user.id });

    // Step 2: Create booking record
    const booking = await bookingService.createBooking({
      userId: user.id,
      tourId,
      tourName,
      totalAmount: amount,
      currency,
      travelers,
      selectedDate,
      bookerName,
      bookerEmail,
      bookerPhone,
      specialRequests,
    });

    logger.info('Booking created', { bookingId: booking.id });

    // Step 3: Create payment intent with minimal metadata (no PII)
    // SECURITY: Only store IDs in Stripe metadata, retrieve PII from database
    // SECURITY: Use idempotency key to prevent duplicate charges on network retries
    const paymentIntent = await paymentService.createPaymentIntent({
      amount,
      currency,
      metadata: {
        bookingId: booking.id,
        userId: user.id,
        tourId,
        // No PII stored in Stripe - retrieve from booking record if needed
      },
      description: `IBookTours Booking: ${booking.id}`,
      idempotencyKey: `payment-${booking.id}`,
    });

    logger.info('Payment intent created', { paymentIntentId: paymentIntent.id });

    // Step 4: Update booking with payment intent ID
    await bookingService.updateBooking(booking.id, {
      paymentIntentId: paymentIntent.id,
    });

    // Step 5: Send booking confirmation email (async, don't block response)
    // SECURITY: Escape user input to prevent XSS in emails
    const safeBookerName = escapeHtml(bookerName);
    const safeTourName = escapeHtml(tourName);

    emailService.sendEmail({
      to: { email: bookerEmail, name: bookerName },
      subject: `IBookTours - Booking Initiated: ${safeTourName}`,
      htmlContent: `
        <h1>Booking Initiated</h1>
        <p>Hi ${safeBookerName},</p>
        <p>Your booking for <strong>${safeTourName}</strong> has been initiated.</p>
        <p>Please complete your payment to confirm the booking.</p>
        <p>Booking Reference: ${booking.id}</p>
        <p>Thank you for choosing IBookTours!</p>
      `,
    }).catch((error) => {
      logger.error('Failed to send booking email', error);
    });

    return NextResponse.json({
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.id,
      bookingId: booking.id,
    });
  } catch (error: unknown) {
    logger.error('Create payment intent error', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
