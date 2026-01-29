/**
 * Base Payment Service Abstract Class
 *
 * Extends BaseService with payment-specific functionality:
 * - Amount validation
 * - Currency handling
 * - Demo mode payment simulation
 */

import { BaseService } from './BaseService';

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
}

export interface CreatePaymentIntentParams {
  amount: number; // Amount in cents
  currency: string;
  metadata?: Record<string, string>;
  description?: string;
}

export abstract class BasePaymentService extends BaseService {
  protected readonly supportedCurrencies: readonly string[];
  protected readonly minAmount: number;
  protected readonly maxAmount: number;

  constructor(
    serviceName: string,
    options: {
      supportedCurrencies?: readonly string[];
      minAmount?: number;
      maxAmount?: number;
    } = {}
  ) {
    super(serviceName);
    this.supportedCurrencies = options.supportedCurrencies ?? ['usd', 'eur', 'gbp', 'ils'];
    this.minAmount = options.minAmount ?? 100; // $1.00 minimum
    this.maxAmount = options.maxAmount ?? 10000000; // $100,000 maximum
  }

  /**
   * Validate payment amount
   */
  protected validateAmount(amount: number): void {
    if (!Number.isInteger(amount)) {
      throw new Error('Amount must be an integer (cents)');
    }
    if (amount < this.minAmount) {
      throw new Error(`Amount must be at least ${this.minAmount} cents`);
    }
    if (amount > this.maxAmount) {
      throw new Error(`Amount cannot exceed ${this.maxAmount} cents`);
    }
  }

  /**
   * Validate currency code
   */
  protected validateCurrency(currency: string): string {
    const normalizedCurrency = currency.toLowerCase();
    if (!this.supportedCurrencies.includes(normalizedCurrency)) {
      throw new Error(`Currency '${currency}' is not supported. Supported: ${this.supportedCurrencies.join(', ')}`);
    }
    return normalizedCurrency;
  }

  /**
   * Format amount for display
   */
  protected formatAmount(amount: number, currency: string): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    });
    return formatter.format(amount / 100);
  }

  /**
   * Generate a mock payment intent for demo mode
   */
  protected createMockPaymentIntent(params: CreatePaymentIntentParams): PaymentIntent {
    const id = `pi_demo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    return {
      id,
      clientSecret: `${id}_secret_demo`,
      amount: params.amount,
      currency: params.currency.toLowerCase(),
      status: 'pending',
    };
  }

  /**
   * Simulate payment intent creation in demo mode
   */
  protected simulateCreateIntent(params: CreatePaymentIntentParams): PaymentIntent {
    this.validateAmount(params.amount);
    const currency = this.validateCurrency(params.currency);

    const intent = this.createMockPaymentIntent({ ...params, currency });

    this.logInfo('Demo mode: Payment intent simulated', {
      id: intent.id,
      amount: this.formatAmount(params.amount, currency),
      currency,
    });

    return intent;
  }

  /**
   * Create a payment intent for processing a payment
   */
  abstract createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntent>;

  /**
   * Retrieve an existing payment intent
   */
  abstract getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent>;

  /**
   * Cancel a payment intent
   */
  abstract cancelPaymentIntent(paymentIntentId: string): Promise<PaymentIntent>;
}
