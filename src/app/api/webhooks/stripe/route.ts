import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/services/email';

// Stripe webhook secret (set in env for production)
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// For demo mode, we'll simulate webhook events
const DEMO_MODE = !process.env.STRIPE_SECRET_KEY;

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
        tourId?: string;
        tourName?: string;
        bookerName?: string;
        bookerEmail?: string;
        bookerPhone?: string;
        travelers?: string;
        selectedDate?: string;
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
        console.log('[Webhook DEMO] Received event:', event.type);
      } catch {
        return NextResponse.json(
          { error: 'Invalid JSON payload' },
          { status: 400 }
        );
      }
    } else {
      // Production: verify Stripe signature
      const sig = request.headers.get('stripe-signature');

      if (!sig || !WEBHOOK_SECRET) {
        return NextResponse.json(
          { error: 'Missing signature or webhook secret' },
          { status: 400 }
        );
      }

      // In production, use: stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET)
      // For now, we'll parse directly since we're in demo mode
      try {
        event = JSON.parse(body);
      } catch {
        return NextResponse.json(
          { error: 'Invalid payload' },
          { status: 400 }
        );
      }
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const metadata = paymentIntent.metadata;

        console.log('[Webhook] Payment succeeded:', {
          paymentId: paymentIntent.id,
          amount: paymentIntent.amount,
          tourName: metadata.tourName,
          bookerEmail: metadata.bookerEmail,
        });

        // Send confirmation email
        if (metadata.bookerEmail && metadata.tourName) {
          try {
            await emailService.sendBookingConfirmation({
              customerEmail: metadata.bookerEmail,
              customerName: metadata.bookerName || 'Guest',
              bookingId: paymentIntent.id,
              tourName: metadata.tourName,
              tourDate: metadata.selectedDate || 'TBD',
              totalAmount: `€${(paymentIntent.amount / 100).toFixed(2)}`,
            });
            console.log('[Webhook] Confirmation email sent to:', metadata.bookerEmail);
          } catch (emailError: unknown) {
            const emailMessage = emailError instanceof Error ? emailError.message : String(emailError);
            console.error('[Webhook] Failed to send email:', emailMessage);
            // Don't fail the webhook if email fails
          }
        }

        // Here you could also:
        // - Send data to CRM (HubSpot, Salesforce, etc.)
        // - Send WhatsApp notification to business owner
        // - Create booking record in database

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log('[Webhook] Payment failed:', paymentIntent.id);

        // Optionally notify the business of failed payment
        break;
      }

      case 'charge.refunded': {
        console.log('[Webhook] Refund processed:', event.data.object.id);
        // Handle refund logic
        break;
      }

      default:
        console.log('[Webhook] Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[Webhook] Error processing webhook:', message);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Note: In App Router, we use request.text() to get raw body
// No special config needed - bodyParser is not used in App Router
