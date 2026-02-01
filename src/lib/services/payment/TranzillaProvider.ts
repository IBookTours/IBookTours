/**
 * Tranzilla Payment Provider
 *
 * Implementation of IPaymentService using Tranzilla (Israeli payment gateway).
 * Supports both production mode (with API credentials) and demo mode.
 *
 * Tranzilla API Docs: https://docs.tranzilla.com/
 */

import {
  IPaymentService,
  PaymentIntent,
  CreatePaymentIntentParams,
} from './PaymentService';
import type { PaymentConfig } from '../ServiceRegistry';
import { createLogger } from '@/lib/logger';

const logger = createLogger('TranzillaProvider');

/**
 * Generate a random transaction ID
 */
function generateTransactionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `trz_${timestamp}${random}`;
}

// In-memory storage for demo payment intents
const demoPaymentIntents = new Map<string, PaymentIntent>();

export class TranzillaProvider implements IPaymentService {
  private readonly isProduction: boolean;
  private readonly terminalId: string | undefined;
  private readonly terminalPassword: string | undefined;
  private readonly apiUrl: string;

  constructor(config?: PaymentConfig) {
    // Tranzilla-specific config
    this.terminalId = process.env.TRANZILLA_TERMINAL_ID;
    this.terminalPassword = process.env.TRANZILLA_TERMINAL_PASSWORD;
    this.apiUrl =
      process.env.TRANZILLA_API_URL ||
      'https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi';

    this.isProduction = Boolean(
      this.terminalId &&
        this.terminalPassword &&
        config?.provider !== 'mock'
    );

    if (!this.isProduction) {
      logger.info('Running in DEMO mode - no real charges will be made');
    }
  }

  async createPaymentIntent(
    params: CreatePaymentIntentParams
  ): Promise<PaymentIntent> {
    const { amount, currency, metadata, description } = params;

    if (this.isProduction) {
      return this.createRealPaymentIntent(params);
    }

    // Demo mode: Create a mock payment intent
    const paymentIntent: PaymentIntent = {
      id: generateTransactionId(),
      clientSecret: `trz_secret_${generateTransactionId()}`,
      amount,
      currency,
      status: 'pending',
    };

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
   * Create a real payment authorization via Tranzilla API
   */
  private async createRealPaymentIntent(
    params: CreatePaymentIntentParams
  ): Promise<PaymentIntent> {
    const { amount, currency, description, idempotencyKey } = params;

    try {
      // Tranzilla uses form-encoded requests
      const formData = new URLSearchParams({
        supplier: this.terminalId!,
        TranzilaPW: this.terminalPassword!,
        sum: (amount / 100).toFixed(2), // Tranzilla expects amount in main currency unit
        currency: this.mapCurrency(currency),
        tranmode: 'A', // Authorization only (capture later)
        ...(description && { pdesc: description }),
        ...(idempotencyKey && { myid: idempotencyKey }),
      });

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const responseText = await response.text();
      const result = this.parseResponse(responseText);

      if (result.Response !== '000') {
        logger.error('Tranzilla authorization failed', {
          response: result.Response,
          message: result.ErrMsg,
        });
        throw new Error(`Payment failed: ${result.ErrMsg || 'Unknown error'}`);
      }

      logger.info('Created payment authorization', {
        id: result.ConfirmationCode,
        amount: `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`,
      });

      return {
        id: result.ConfirmationCode || generateTransactionId(),
        clientSecret: result.index || '',
        amount,
        currency,
        status: 'pending',
      };
    } catch (error) {
      logger.error('Create payment intent exception', error);
      throw error;
    }
  }

  /**
   * Parse Tranzilla's key=value response format
   */
  private parseResponse(responseText: string): Record<string, string> {
    const result: Record<string, string> = {};
    responseText.split('&').forEach((pair) => {
      const [key, value] = pair.split('=');
      if (key) result[key] = decodeURIComponent(value || '');
    });
    return result;
  }

  /**
   * Map ISO currency codes to Tranzilla currency codes
   */
  private mapCurrency(currency: string): string {
    const currencyMap: Record<string, string> = {
      ILS: '1',
      USD: '2',
      EUR: '3',
      GBP: '4',
    };
    return currencyMap[currency.toUpperCase()] || '3'; // Default to EUR
  }

  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    if (this.isProduction) {
      // Tranzilla doesn't have a direct "get" API - return cached or query DB
      logger.warn(
        'Tranzilla: getPaymentIntent not fully implemented for production'
      );
    }

    // Demo mode
    const intent = demoPaymentIntents.get(paymentIntentId);
    if (intent) return intent;

    return {
      id: paymentIntentId,
      clientSecret: '',
      amount: 0,
      currency: 'eur',
      status: 'failed',
    };
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    if (this.isProduction) {
      // Tranzilla cancellation would require void/refund API call
      logger.warn(
        'Tranzilla: cancelPaymentIntent not fully implemented for production'
      );
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

  getProviderName(): string {
    return this.isProduction ? 'Tranzilla' : 'Tranzilla (Demo)';
  }
}
