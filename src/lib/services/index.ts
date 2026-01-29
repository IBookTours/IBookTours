/**
 * Services Module
 *
 * Central export for all service abstractions.
 * Uses factory pattern with environment-based provider selection.
 *
 * Usage:
 * ```typescript
 * import { getEmailService, getPaymentService } from '@/lib/services';
 *
 * // Preferred: Use factory functions
 * const email = getEmailService();
 * await email.sendContactForm({ name, email, subject, message });
 *
 * const payment = getPaymentService();
 * const intent = await payment.createPaymentIntent({ amount: 1000, currency: 'eur' });
 *
 * // Legacy: Direct service instances (for backward compatibility)
 * import { emailService, paymentService } from '@/lib/services';
 * ```
 */

// Service Registry
export {
  getServiceConfig,
  resetServiceConfig,
  isEmailProduction,
  isPaymentProduction,
  type ServiceConfig,
  type EmailConfig,
  type PaymentConfig,
  type DomainConfig,
} from './ServiceRegistry';

// Email Service
export {
  emailService,
  getEmailService,
  resetEmailService,
} from './email';
export type {
  IEmailService,
  SendEmailParams,
  SendEmailResult,
  EmailRecipient,
} from './email';

// Payment Service
export {
  paymentService,
  getPaymentService,
  resetPaymentService,
} from './payment';
export type {
  IPaymentService,
  PaymentIntent,
  CreatePaymentIntentParams,
} from './payment';

// Base Classes (for implementing new providers)
export {
  BaseService,
  BaseEmailService,
  BasePaymentService,
  type ServiceResult,
} from './base';
