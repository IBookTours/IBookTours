// ============================================
// PAYMENT SERVICE EXPORTS
// ============================================
// Usage:
// import { paymentService } from '@/lib/services/payment';
// const intent = await paymentService.createPaymentIntent({ amount: 1000, currency: 'eur' });

export type {
  IPaymentService,
  PaymentIntent,
  CreatePaymentIntentParams,
} from './PaymentService';

export { StripeProvider } from './StripeProvider';

// Default payment service instance
// To switch providers, change the import and instantiation here
import { StripeProvider } from './StripeProvider';

export const paymentService = new StripeProvider();
