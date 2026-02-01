import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { emailService } from '@/lib/services/email';
import { getBookingService } from '@/lib/services/booking';
import { paymentLogger } from '@/lib/logger';

// Stripe webhook secret (set in env for production)
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// For demo mode, we'll simulate webhook events
const DEMO_MODE = !process.env.STRIPE_SECRET_KEY;

// Initialize Stripe client (only when not in demo mode)
const stripe = !DEMO_MODE && process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// SECURITY: Only essential IDs in metadata (no PII)
interface StripeEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      metadata: {
        bookingId?: string;
        userId?: string;
        tourId?: string;
      };
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // In production, verify the webhook signature
    let event: StripeEvent;

    if (DEMO_MODE) {
      // Demo mode: parse body directly
      try {
        event = JSON.parse(body);
        paymentLogger.debug('Webhook DEMO event received', { type: event.type });
      } catch {
        return NextResponse.json(
          { error: 'Invalid JSON payload' },
          { status: 400 }
        );
      }
    } else {
      // Production: verify Stripe signature using constructEvent
      const sig = request.headers.get('stripe-signature');

      if (!sig || !WEBHOOK_SECRET) {
        paymentLogger.error('Missing signature or webhook secret');
        return NextResponse.json(
          { error: 'Missing signature or webhook secret' },
          { status: 400 }
        );
      }

      if (!stripe) {
        paymentLogger.error('Stripe client not initialized');
        return NextResponse.json(
          { error: 'Stripe not configured' },
          { status: 500 }
        );
      }

      // Verify webhook signature using Stripe SDK
      try {
        const stripeEvent = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
        // Map Stripe event to our interface
        event = {
          id: stripeEvent.id,
          type: stripeEvent.type,
          data: {
            object: stripeEvent.data.object as StripeEvent['data']['object'],
          },
        };
      } catch (err) {
        paymentLogger.error('Signature verification failed', err);
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 400 }
        );
      }
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const metadata = paymentIntent.metadata;

        paymentLogger.info('Payment succeeded', {
          paymentId: paymentIntent.id,
          amount: paymentIntent.amount,
          bookingId: metadata.bookingId,
        });

        // SECURITY: Fetch booking from database to get details and verify amount
        if (!metadata.bookingId) {
          paymentLogger.error('Missing bookingId in payment metadata', {
            paymentId: paymentIntent.id,
          });
          // Still return 200 to acknowledge webhook, but log the error
          break;
        }

        const bookingService = getBookingService();
        const booking = await bookingService.findById(metadata.bookingId);

        if (!booking) {
          paymentLogger.error('Booking not found for payment', {
            paymentId: paymentIntent.id,
            bookingId: metadata.bookingId,
          });
          break;
        }

        // SECURITY: Verify payment amount matches booking amount
        if (paymentIntent.amount !== booking.totalAmount) {
          paymentLogger.error('Payment amount mismatch - possible manipulation', {
            paymentId: paymentIntent.id,
            bookingId: metadata.bookingId,
            paidAmount: paymentIntent.amount,
            expectedAmount: booking.totalAmount,
          });
          // Don't confirm booking if amounts don't match
          break;
        }

        // Update booking status to confirmed
        try {
          await bookingService.updatePaymentStatus(paymentIntent.id, 'succeeded');
          paymentLogger.info('Booking confirmed', { bookingId: booking.id });
        } catch (updateError) {
          paymentLogger.error('Failed to update booking status', updateError);
        }

        // Send confirmation email using data from booking record (not metadata)
        if (booking.bookerEmail && booking.tourName) {
          try {
            await emailService.sendBookingConfirmation({
              customerEmail: booking.bookerEmail,
              customerName: booking.bookerName || 'Guest',
              bookingId: booking.id,
              tourName: booking.tourName,
              tourDate: booking.selectedDate?.toISOString() || 'TBD',
              totalAmount: `€${(booking.totalAmount / 100).toFixed(2)}`,
            });
            paymentLogger.info('Confirmation email sent', { email: booking.bookerEmail });
          } catch (emailError: unknown) {
            paymentLogger.error('Failed to send confirmation email', emailError);
            // Don't fail the webhook if email fails
          }
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const metadata = paymentIntent.metadata;

        paymentLogger.warn('Payment failed', {
          paymentId: paymentIntent.id,
          bookingId: metadata.bookingId,
        });

        // Update booking payment status to failed
        if (metadata.bookingId) {
          const bookingService = getBookingService();
          try {
            await bookingService.updatePaymentStatus(paymentIntent.id, 'failed');
            paymentLogger.info('Booking marked as payment failed', {
              bookingId: metadata.bookingId,
            });
          } catch (updateError) {
            paymentLogger.error('Failed to update booking status', updateError);
          }
        }

        break;
      }

      case 'charge.refunded': {
        paymentLogger.info('Refund processed', { chargeId: event.data.object.id });
        // Handle refund logic
        break;
      }

      default:
        paymentLogger.debug('Unhandled event type', { type: event.type });
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    paymentLogger.error('Error processing webhook', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Note: In App Router, we use request.text() to get raw body
// No special config needed - bodyParser is not used in App Router
