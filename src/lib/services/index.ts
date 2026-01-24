// ============================================
// SERVICES INDEX
// ============================================
// Central export for all service abstractions.
//
// This architecture follows the Dependency Inversion principle,
// allowing easy swapping of service providers without changing
// consuming code.
//
// Usage:
// import { paymentService, emailService } from '@/lib/services';

export { paymentService } from './payment';
export type { IPaymentService, PaymentIntent, CreatePaymentIntentParams } from './payment';

export { emailService } from './email';
export type { IEmailService, SendEmailParams, SendEmailResult } from './email';

// ============================================
// HOW TO SWAP PROVIDERS
// ============================================
//
// 1. PAYMENT PROVIDER (e.g., switching from Stripe to PayPal):
//    - Create new file: src/lib/services/payment/PayPalProvider.ts
//    - Implement IPaymentService interface
//    - Update src/lib/services/payment/index.ts:
//      ```
//      import { PayPalProvider } from './PayPalProvider';
//      export const paymentService = new PayPalProvider();
//      ```
//
// 2. EMAIL PROVIDER (e.g., switching from Brevo to SendGrid):
//    - Create new file: src/lib/services/email/SendGridProvider.ts
//    - Implement IEmailService interface
//    - Update src/lib/services/email/index.ts:
//      ```
//      import { SendGridProvider } from './SendGridProvider';
//      export const emailService = new SendGridProvider();
//      ```
//
// All consuming code remains unchanged!
