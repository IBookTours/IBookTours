import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { paymentService } from '@/lib/services/payment';
import { getUserService } from '@/lib/services/user';
import { getBookingService } from '@/lib/services/booking';
import { getEmailService } from '@/lib/services/email';
import { checkRateLimit, getClientIP, rateLimitExceededResponse, RATE_LIMITS } from '@/lib/rateLimit';
import { createValidationErrorResponse } from '@/lib/schemas';
import { paymentLogger, createRequestLogger } from '@/lib/logger';

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

    logger.info('Creating payment intent with guest checkout', {
      amount,
      currency,
      tourId,
      bookerEmail,
    });

    // Get services
    const userService = getUserService();
    const bookingService = getBookingService();
    const emailService = getEmailService();

    // Step 1: Find or create user (auto-create with temp password for guest checkout)
    const { user, isNew, tempPassword } = await userService.findOrCreateUser({
      email: bookerEmail,
      name: bookerName,
      autoCreateWithTempPassword: true,
    });

    logger.info('User resolved', { userId: user.id, isNewUser: isNew });

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

    // Step 3: Create payment intent with booking and user metadata
    const paymentIntent = await paymentService.createPaymentIntent({
      amount,
      currency,
      metadata: {
        bookingId: booking.id,
        userId: user.id,
        tourId,
        tourName,
        bookerEmail,
        bookerName,
        bookerPhone: bookerPhone ?? '',
        travelers: String(travelers),
        selectedDate: selectedDate?.toISOString() ?? '',
      },
      description: `IBookTours - ${tourName}`,
    });

    logger.info('Payment intent created', { paymentIntentId: paymentIntent.id });

    // Step 4: Update booking with payment intent ID
    await bookingService.updateBooking(booking.id, {
      paymentIntentId: paymentIntent.id,
    });

    // Step 5: Send welcome email for new users (async, don't block response)
    if (isNew && tempPassword) {
      // Generate password reset token for the new user
      const resetResult = await userService.generatePasswordResetToken(user.id);

      // Send welcome email in background (don't await)
      emailService.sendEmail({
        to: { email: bookerEmail, name: bookerName },
        subject: 'Welcome to IBookTours - Set Your Password',
        htmlContent: `
          <h1>Welcome to IBookTours!</h1>
          <p>Hi ${bookerName},</p>
          <p>An account has been created for you to manage your bookings.</p>
          <p>Please set your password to access your account:</p>
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?token=${resetResult.token}">Set Your Password</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>Thank you for choosing IBookTours!</p>
        `,
      }).catch((error) => {
        logger.error('Failed to send welcome email', error);
      });

      logger.info('Welcome email queued for new user', { userId: user.id });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.id,
      bookingId: booking.id,
      isNewUser: isNew,
    });
  } catch (error: unknown) {
    logger.error('Create payment intent error', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
