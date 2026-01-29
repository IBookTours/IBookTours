/**
 * Payment Service Factory
 *
 * Provides payment service instances based on configuration.
 * Use getPaymentService() to get the configured provider.
 */

import { getServiceConfig, type PaymentConfig } from '../ServiceRegistry';
import { createLogger } from '@/lib/logger';
import { StripeProvider } from './StripeProvider';
import type { IPaymentService } from './PaymentService';

// Types
export type {
  IPaymentService,
  PaymentIntent,
  CreatePaymentIntentParams,
} from './PaymentService';

// Providers (for direct use if needed)
export { StripeProvider } from './StripeProvider';

const logger = createLogger('PaymentServiceFactory');

/**
 * Payment service singleton
 */
let paymentServiceInstance: IPaymentService | null = null;

/**
 * Create payment service based on configuration
 */
function createPaymentService(config: PaymentConfig): IPaymentService {
  logger.info('Creating payment service', { provider: config.provider });

  switch (config.provider) {
    case 'stripe':
      return new StripeProvider(config);
    // Add other providers here:
    // case 'paypal':
    //   return new PayPalProvider(config);
    case 'mock':
    default:
      // Use Stripe in demo mode (it handles demo mode internally)
      return new StripeProvider(config);
  }
}

/**
 * Get the configured payment service
 *
 * This is the primary way to access payment functionality.
 * The provider is determined by environment configuration.
 */
export function getPaymentService(): IPaymentService {
  if (!paymentServiceInstance) {
    const config = getServiceConfig();
    paymentServiceInstance = createPaymentService(config.payment);
    logger.info('Payment service initialized', {
      provider: config.payment.provider,
    });
  }
  return paymentServiceInstance;
}

/**
 * Reset payment service (for testing)
 */
export function resetPaymentService(): void {
  paymentServiceInstance = null;
}

/**
 * Default payment service instance (for backward compatibility)
 *
 * Prefer using getPaymentService() for explicit initialization,
 * but this export maintains compatibility with existing code.
 */
export const paymentService = getPaymentService();
