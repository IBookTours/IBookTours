// ============================================
// PAYMENT SERVICE - Abstract Interface
// ============================================
// This interface allows easy swapping of payment providers.
// Currently implemented: Stripe
// To add a new provider: Create a new class implementing IPaymentService

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
}

export interface CreatePaymentIntentParams {
  amount: number; // Amount in cents
  currency: string;
  metadata?: Record<string, string>;
  description?: string;
}

export interface IPaymentService {
  /**
   * Create a payment intent for processing a payment
   */
  createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntent>;

  /**
   * Retrieve an existing payment intent
   */
  getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent>;

  /**
   * Cancel a payment intent
   */
  cancelPaymentIntent(paymentIntentId: string): Promise<PaymentIntent>;

  /**
   * Get the provider name
   */
  getProviderName(): string;
}

// Export default implementation
export { StripeProvider } from './StripeProvider';
