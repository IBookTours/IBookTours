import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/services/payment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'eur', tourId, tourName } = body;

    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum is €1.00 (100 cents)' },
        { status: 400 }
      );
    }

    const paymentIntent = await paymentService.createPaymentIntent({
      amount,
      currency,
      metadata: {
        tourId: tourId || '',
        tourName: tourName || '',
      },
      description: tourName ? `ITravel - ${tourName}` : 'ITravel Tour Booking',
    });

    return NextResponse.json({
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
