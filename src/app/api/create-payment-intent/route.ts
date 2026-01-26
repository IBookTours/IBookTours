import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/services/payment';
import { checkRateLimit, getClientIP, rateLimitExceededResponse, RATE_LIMITS } from '@/lib/rateLimit';

// Payment limits
const MAX_AMOUNT = 1000000; // €10,000 in cents
const MAX_TOUR_NAME_LENGTH = 200;
const MAX_TOUR_ID_LENGTH = 100;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request.headers);
    const rateLimitResult = checkRateLimit(clientIP, '/api/create-payment-intent', RATE_LIMITS.payment);

    if (!rateLimitResult.allowed) {
      return rateLimitExceededResponse(rateLimitResult, RATE_LIMITS.payment);
    }

    const body = await request.json();
    const { amount, currency = 'eur', tourId, tourName } = body;

    // Validate amount
    if (typeof amount !== 'number' || !Number.isInteger(amount)) {
      return NextResponse.json(
        { error: 'Amount must be an integer' },
        { status: 400 }
      );
    }

    if (amount < 100) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum is €1.00 (100 cents)' },
        { status: 400 }
      );
    }

    if (amount > MAX_AMOUNT) {
      return NextResponse.json(
        { error: 'Amount exceeds maximum allowed' },
        { status: 400 }
      );
    }

    // Validate optional fields
    if (tourId && (typeof tourId !== 'string' || tourId.length > MAX_TOUR_ID_LENGTH)) {
      return NextResponse.json(
        { error: 'Invalid tour ID' },
        { status: 400 }
      );
    }

    if (tourName && (typeof tourName !== 'string' || tourName.length > MAX_TOUR_NAME_LENGTH)) {
      return NextResponse.json(
        { error: 'Invalid tour name' },
        { status: 400 }
      );
    }

    // Validate currency
    const allowedCurrencies = ['eur', 'usd', 'gbp', 'all'];
    if (typeof currency !== 'string' || !allowedCurrencies.includes(currency.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid currency' },
        { status: 400 }
      );
    }

    const paymentIntent = await paymentService.createPaymentIntent({
      amount,
      currency: currency.toLowerCase(),
      metadata: {
        tourId: tourId ? String(tourId).trim() : '',
        tourName: tourName ? String(tourName).trim() : '',
      },
      description: tourName ? `ITravel - ${tourName}` : 'ITravel Tour Booking',
    });

    return NextResponse.json({
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Create payment intent error:', message);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
