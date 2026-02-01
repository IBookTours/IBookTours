/**
 * Stripe Payment Provider
 *
 * Implementation of IPaymentService using Stripe.
 * Supports both production mode (with API key) and demo mode (simulated).
 */

import {
  IPaymentService,
  PaymentIntent,
  CreatePaymentIntentParams,
} from './PaymentService';
import type { PaymentConfig } from '../ServiceRegistry';
import { createLogger } from '@/lib/logger';

const logger = createLogger('StripeProvider');

/**
 * Generate a random ID similar to Stripe's format
 */
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
  private readonly isProduction: boolean;
  private readonly secretKey: string | undefined;

  constructor(config?: PaymentConfig) {
    // Use config if provided, otherwise fall back to env vars
    this.secretKey = config?.secretKey || process.env.STRIPE_SECRET_KEY;
    this.isProduction = Boolean(
      this.secretKey &&
      !this.secretKey.includes('placeholder') &&
      config?.provider !== 'mock'
    );

    if (!this.isProduction) {
      logger.info('Running in DEMO mode - no real charges will be made');
    }
  }

  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntent> {
    const { amount, currency, metadata, description } = params;

    if (this.isProduction && this.secretKey) {
      // Production mode: Make real Stripe API call
      return this.createRealPaymentIntent(params);
    }

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

    logger.info('Demo: Created payment intent', {
      id: paymentIntent.id,
      amount: `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`,
      hasDescription: !!description,
      hasMetadata: !!metadata,
    });

    return paymentIntent;
  }

  /**
   * Create a real payment intent via Stripe API
   */
  private async createRealPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntent> {
    const { amount, currency, metadata, description, idempotencyKey } = params;

    try {
      // SECURITY: Build headers with optional idempotency key
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      // SECURITY: Idempotency key prevents duplicate charges on network retries
      if (idempotencyKey) {
        headers['Idempotency-Key'] = idempotencyKey;
      }

      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers,
        body: new URLSearchParams({
          amount: amount.toString(),
          currency,
          'automatic_payment_methods[enabled]': 'true',
          ...(description && { description }),
          ...(metadata && Object.fromEntries(
            Object.entries(metadata).map(([k, v]) => [`metadata[${k}]`, v])
          )),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Create payment intent failed', { status: response.status, error: errorText });
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();

      logger.info('Created payment intent', {
        id: data.id,
        amount: `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`,
      });

      return {
        id: data.id,
        clientSecret: data.client_secret,
        amount: data.amount,
        currency: data.currency,
        status: this.mapStatus(data.status),
      };
    } catch (error) {
      logger.error('Create payment intent exception', error);
      throw error;
    }
  }

  /**
   * Map Stripe status to our status type
   */
  private mapStatus(stripeStatus: string): PaymentIntent['status'] {
    switch (stripeStatus) {
      case 'succeeded':
        return 'succeeded';
      case 'canceled':
        return 'canceled';
      case 'processing':
        return 'processing';
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
      case 'requires_capture':
      default:
        return 'pending';
    }
  }

  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    if (this.isProduction && this.secretKey) {
      return this.getRealPaymentIntent(paymentIntentId);
    }

    // Demo mode
    const intent = demoPaymentIntents.get(paymentIntentId);

    if (!intent) {
      logger.warn('Demo: Payment intent not found', { id: paymentIntentId });
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

  /**
   * Get a real payment intent from Stripe
   */
  private async getRealPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    try {
      const response = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Get payment intent failed', { status: response.status, error: errorText });
        return {
          id: paymentIntentId,
          clientSecret: '',
          amount: 0,
          currency: 'eur',
          status: 'failed',
        };
      }

      const data = await response.json();
      return {
        id: data.id,
        clientSecret: data.client_secret,
        amount: data.amount,
        currency: data.currency,
        status: this.mapStatus(data.status),
      };
    } catch (error) {
      logger.error('Get payment intent exception', error);
      return {
        id: paymentIntentId,
        clientSecret: '',
        amount: 0,
        currency: 'eur',
        status: 'failed',
      };
    }
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    if (this.isProduction && this.secretKey) {
      return this.cancelRealPaymentIntent(paymentIntentId);
    }

    // Demo mode
    const intent = demoPaymentIntents.get(paymentIntentId);

    if (intent) {
      intent.status = 'canceled';
      demoPaymentIntents.set(paymentIntentId, intent);
      logger.info('Demo: Canceled payment intent', { id: paymentIntentId });
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

  /**
   * Cancel a real payment intent via Stripe
   */
  private async cancelRealPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    try {
      const response = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Cancel payment intent failed', { status: response.status, error: errorText });
        throw new Error('Failed to cancel payment intent');
      }

      const data = await response.json();
      logger.info('Canceled payment intent', { id: paymentIntentId });

      return {
        id: data.id,
        clientSecret: data.client_secret,
        amount: data.amount,
        currency: data.currency,
        status: 'canceled',
      };
    } catch (error) {
      logger.error('Cancel payment intent exception', error);
      throw error;
    }
  }

  getProviderName(): string {
    return this.isProduction ? 'Stripe' : 'Stripe (Demo)';
  }
}
