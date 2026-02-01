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
import {
  getProductConfig,
  calculateDeposit,
  calculateBalance,
  isPaymentMethodAllowed,
  type ProductType,
  type PaymentMethod,
} from '@/lib/config/products';

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

  // Product type determines approval workflow
  productType: z
    .enum(['day-tour', 'vacation-package', 'car-rental', 'hotel'])
    .default('day-tour'),

  // Payment method (validated against product config)
  paymentMethod: z
    .enum(['full', 'deposit', 'cash_on_arrival'])
    .default('full'),
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
      productType,
      paymentMethod,
    } = validation.data;

    // Validate payment method is allowed for this product type
    if (!isPaymentMethodAllowed(productType as ProductType, paymentMethod as PaymentMethod)) {
      logger.warn('Invalid payment method for product type', { productType, paymentMethod });
      return NextResponse.json(
        { error: `Payment method "${paymentMethod}" is not allowed for ${productType}` },
        { status: 400 }
      );
    }

    // Get product configuration
    const productConfig = getProductConfig(productType as ProductType);

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

    // Calculate payment amounts based on payment method
    let chargeAmount = amount; // Amount to charge now
    let depositAmount: number | undefined;
    let balanceAmount: number | undefined;

    if (paymentMethod === 'deposit') {
      depositAmount = calculateDeposit(productType as ProductType, amount);
      balanceAmount = calculateBalance(productType as ProductType, amount);
      chargeAmount = depositAmount;
      logger.info('Deposit payment', { depositAmount, balanceAmount, total: amount });
    } else if (paymentMethod === 'cash_on_arrival') {
      // No charge now, just create booking
      chargeAmount = 0;
      logger.info('Cash on arrival payment', { total: amount });
    }

    // Determine approval status based on product config
    const approvalStatus = productConfig.requiresApproval ? 'pending' : 'not_required';

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
      productType: productType as ProductType,
      paymentMethod: paymentMethod as PaymentMethod,
      depositAmount,
      balanceAmount,
      approvalStatus,
    });

    logger.info('Booking created', {
      bookingId: booking.id,
      productType,
      paymentMethod,
      approvalStatus,
    });

    // Step 3: Create payment intent (skip if cash on arrival)
    let paymentIntent: { id: string; clientSecret: string | null } | null = null;

    if (paymentMethod !== 'cash_on_arrival' && chargeAmount > 0) {
      // SECURITY: Only store IDs in Stripe metadata, retrieve PII from database
      // SECURITY: Use idempotency key to prevent duplicate charges on network retries
      paymentIntent = await paymentService.createPaymentIntent({
        amount: chargeAmount,
        currency,
        metadata: {
          bookingId: booking.id,
          userId: user.id,
          tourId,
          paymentType: paymentMethod === 'deposit' ? 'deposit' : 'full',
          // No PII stored in Stripe - retrieve from booking record if needed
        },
        description: `IBookTours ${paymentMethod === 'deposit' ? 'Deposit' : 'Booking'}: ${booking.id}`,
        idempotencyKey: `payment-${booking.id}-${paymentMethod}`,
      });

      logger.info('Payment intent created', { paymentIntentId: paymentIntent.id });

      // Step 4: Update booking with payment intent ID
      await bookingService.updateBooking(booking.id, {
        paymentIntentId: paymentIntent.id,
      });
    }

    // Step 5: Send booking confirmation email (async, don't block response)
    // SECURITY: Escape user input to prevent XSS in emails
    const safeBookerName = escapeHtml(bookerName);
    const safeTourName = escapeHtml(tourName);

    // Email content varies based on payment method and approval status
    let emailSubject = `IBookTours - Booking Initiated: ${safeTourName}`;
    let emailBody = `
      <h1>Booking Initiated</h1>
      <p>Hi ${safeBookerName},</p>
      <p>Your booking for <strong>${safeTourName}</strong> has been initiated.</p>
    `;

    if (paymentMethod === 'cash_on_arrival') {
      emailBody += `
        <p>You have selected to pay on arrival.</p>
        ${approvalStatus === 'pending' ? '<p>We will confirm availability and send you a confirmation email within 24 hours.</p>' : ''}
      `;
    } else if (paymentMethod === 'deposit') {
      const depositEur = (depositAmount || 0) / 100;
      const balanceEur = (balanceAmount || 0) / 100;
      emailBody += `
        <p>Please complete your deposit payment of <strong>€${depositEur.toFixed(2)}</strong> to secure your booking.</p>
        <p>Remaining balance: €${balanceEur.toFixed(2)} (due after confirmation)</p>
      `;
    } else {
      emailBody += `<p>Please complete your payment to confirm the booking.</p>`;
    }

    emailBody += `
      <p>Booking Reference: ${booking.id}</p>
      <p>Thank you for choosing IBookTours!</p>
    `;

    emailService.sendEmail({
      to: { email: bookerEmail, name: bookerName },
      subject: emailSubject,
      htmlContent: emailBody,
    }).catch((error) => {
      logger.error('Failed to send booking email', error);
    });

    // Response varies based on payment method
    if (paymentMethod === 'cash_on_arrival') {
      return NextResponse.json({
        bookingId: booking.id,
        paymentMethod: 'cash_on_arrival',
        approvalStatus,
        message: approvalStatus === 'pending'
          ? 'Booking received. We will confirm availability within 24 hours.'
          : 'Booking confirmed. Pay on arrival.',
      });
    }

    return NextResponse.json({
      clientSecret: paymentIntent?.clientSecret,
      paymentIntentId: paymentIntent?.id,
      bookingId: booking.id,
      paymentMethod,
      chargeAmount,
      ...(paymentMethod === 'deposit' && { depositAmount, balanceAmount }),
    });
  } catch (error: unknown) {
    logger.error('Create payment intent error', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
