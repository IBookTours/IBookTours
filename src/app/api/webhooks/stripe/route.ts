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
        paymentType?: 'full' | 'deposit' | 'balance';
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
        const paymentType = metadata.paymentType || 'full';

        paymentLogger.info('Payment succeeded', {
          paymentId: paymentIntent.id,
          amount: paymentIntent.amount,
          bookingId: metadata.bookingId,
          paymentType,
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

        // SECURITY: Verify payment amount based on payment type
        let expectedAmount: number;
        if (paymentType === 'deposit') {
          expectedAmount = booking.depositAmount || 0;
        } else if (paymentType === 'balance') {
          expectedAmount = booking.balanceAmount || 0;
        } else {
          expectedAmount = booking.totalAmount;
        }

        if (paymentIntent.amount !== expectedAmount) {
          paymentLogger.error('Payment amount mismatch - possible manipulation', {
            paymentId: paymentIntent.id,
            bookingId: metadata.bookingId,
            paidAmount: paymentIntent.amount,
            expectedAmount,
            paymentType,
          });
          // Don't confirm booking if amounts don't match
          break;
        }

        // Update booking based on payment type
        try {
          if (paymentType === 'deposit') {
            // Deposit payment: update deposit status, keep booking pending if approval required
            await bookingService.updateBooking(booking.id, {
              paymentIntentId: paymentIntent.id,
              paymentStatus: 'deposit_paid',
              depositPaidAt: new Date(),
              // Only auto-confirm if no approval required (day tours)
              status: booking.approvalStatus === 'not_required' ? 'confirmed' : 'pending',
            });
            paymentLogger.info('Deposit payment recorded', {
              bookingId: booking.id,
              requiresApproval: booking.approvalStatus !== 'not_required',
            });
          } else if (paymentType === 'balance') {
            // Balance payment: only succeed if booking was already approved
            if (booking.approvalStatus === 'approved' || booking.approvalStatus === 'not_required') {
              await bookingService.updateBooking(booking.id, {
                balancePaymentIntentId: paymentIntent.id,
                paymentStatus: 'succeeded',
                status: 'confirmed',
              });
              paymentLogger.info('Balance payment confirmed booking', { bookingId: booking.id });
            } else {
              paymentLogger.error('Balance payment for unapproved booking', {
                bookingId: booking.id,
                approvalStatus: booking.approvalStatus,
              });
              break;
            }
          } else {
            // Full payment: auto-confirm only if no approval required
            const shouldConfirm = booking.approvalStatus === 'not_required';
            await bookingService.updateBooking(booking.id, {
              paymentIntentId: paymentIntent.id,
              paymentStatus: 'succeeded',
              status: shouldConfirm ? 'confirmed' : 'pending',
            });
            paymentLogger.info('Full payment recorded', {
              bookingId: booking.id,
              confirmed: shouldConfirm,
            });
          }
        } catch (updateError) {
          paymentLogger.error('Failed to update booking status', updateError);
        }

        // Send appropriate email based on payment type and status
        if (booking.bookerEmail && booking.tourName) {
          try {
            const isConfirmed = booking.approvalStatus === 'not_required';

            if (paymentType === 'deposit' && !isConfirmed) {
              // Deposit paid, awaiting approval
              await emailService.sendBookingConfirmation({
                customerEmail: booking.bookerEmail,
                customerName: booking.bookerName || 'Guest',
                bookingId: booking.id,
                tourName: booking.tourName,
                tourDate: booking.selectedDate?.toISOString() || 'TBD',
                totalAmount: `€${(booking.depositAmount! / 100).toFixed(2)} deposit paid - Awaiting confirmation`,
              });
              paymentLogger.info('Deposit confirmation email sent', { email: booking.bookerEmail });
            } else if (paymentType === 'balance' || (paymentType === 'full' && isConfirmed)) {
              // Full payment or balance payment - booking confirmed
              await emailService.sendBookingConfirmation({
                customerEmail: booking.bookerEmail,
                customerName: booking.bookerName || 'Guest',
                bookingId: booking.id,
                tourName: booking.tourName,
                tourDate: booking.selectedDate?.toISOString() || 'TBD',
                totalAmount: `€${(booking.totalAmount / 100).toFixed(2)}`,
              });
              paymentLogger.info('Confirmation email sent', { email: booking.bookerEmail });
            } else if (paymentType === 'deposit' && isConfirmed) {
              // Day tour with deposit - confirmed immediately
              await emailService.sendBookingConfirmation({
                customerEmail: booking.bookerEmail,
                customerName: booking.bookerName || 'Guest',
                bookingId: booking.id,
                tourName: booking.tourName,
                tourDate: booking.selectedDate?.toISOString() || 'TBD',
                totalAmount: `€${(booking.depositAmount! / 100).toFixed(2)} deposit paid - Balance €${((booking.balanceAmount || 0) / 100).toFixed(2)} due on arrival`,
              });
              paymentLogger.info('Deposit confirmation email sent (instant)', { email: booking.bookerEmail });
            }
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
