// ============================================
// STRIPE PAYMENT PROVIDER (Demo Mode)
// ============================================
// Implementation of IPaymentService for demo/development.
// This mock implementation simulates Stripe behavior without
// requiring the actual Stripe npm package.
//
// For production, install stripe package and uncomment the real implementation:
// npm install stripe @stripe/stripe-js @stripe/react-stripe-js
//
// Environment Variables (for production):
// - STRIPE_SECRET_KEY: Your Stripe secret key
// - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Your Stripe publishable key

import {
  IPaymentService,
  PaymentIntent,
  CreatePaymentIntentParams,
} from './PaymentService';

// Generate a random ID similar to Stripe's format
function generateId(prefix: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix + '_';
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// In-memory storage for demo payment intents
const demoPaymentIntents = new Map<string, PaymentIntent>();

export class StripeProvider implements IPaymentService {
  private isProduction: boolean;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    this.isProduction = Boolean(secretKey && !secretKey.includes('placeholder'));

    if (!this.isProduction) {
      console.info('[Payment] Running in DEMO mode - no real charges will be made');
    }
  }

  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntent> {
    const { amount, currency, metadata, description } = params;

    // Demo mode: Create a mock payment intent
    const paymentIntent: PaymentIntent = {
      id: generateId('pi'),
      clientSecret: generateId('pi_secret'),
      amount,
      currency,
      status: 'pending',
    };

    // Store for later retrieval
    demoPaymentIntents.set(paymentIntent.id, paymentIntent);

    console.info('[Payment Demo] Created payment intent:', {
      id: paymentIntent.id,
      amount: `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`,
      description,
      metadata,
    });

    return paymentIntent;
  }

  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    const intent = demoPaymentIntents.get(paymentIntentId);

    if (!intent) {
      // Return a mock "not found" style response
      return {
        id: paymentIntentId,
        clientSecret: '',
        amount: 0,
        currency: 'eur',
        status: 'failed',
      };
    }

    return intent;
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    const intent = demoPaymentIntents.get(paymentIntentId);

    if (intent) {
      intent.status = 'canceled';
      demoPaymentIntents.set(paymentIntentId, intent);
      return intent;
    }

    return {
      id: paymentIntentId,
      clientSecret: '',
      amount: 0,
      currency: 'eur',
      status: 'canceled',
    };
  }

  getProviderName(): string {
    return this.isProduction ? 'Stripe' : 'Stripe (Demo)';
  }
}

// ============================================
// PRODUCTION IMPLEMENTATION (Commented)
// ============================================
// To enable real Stripe payments:
// 1. npm install stripe
// 2. Uncomment the code below
// 3. Comment out the demo class above
//
// import Stripe from 'stripe';
//
// export class StripeProviderProduction implements IPaymentService {
//   private stripe: Stripe;
//
//   constructor() {
//     this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//       apiVersion: '2023-10-16',
//     });
//   }
//
//   async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntent> {
//     const paymentIntent = await this.stripe.paymentIntents.create({
//       amount: params.amount,
//       currency: params.currency,
//       metadata: params.metadata,
//       description: params.description,
//       automatic_payment_methods: { enabled: true },
//     });
//
//     return {
//       id: paymentIntent.id,
//       clientSecret: paymentIntent.client_secret || '',
//       amount: paymentIntent.amount,
//       currency: paymentIntent.currency,
//       status: this.mapStatus(paymentIntent.status),
//     };
//   }
//
//   // ... rest of implementation
// }
