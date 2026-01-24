// ============================================
// EMAIL SERVICE EXPORTS
// ============================================
// Usage:
// import { emailService } from '@/lib/services/email';
// await emailService.sendContactForm({ name, email, subject, message });

export type {
  IEmailService,
  EmailRecipient,
  SendEmailParams,
  SendEmailResult,
  AddToListParams,
} from './EmailService';

export { BrevoProvider } from './BrevoProvider';

// Default email service instance
// To switch providers, change the import and instantiation here
import { BrevoProvider } from './BrevoProvider';

export const emailService = new BrevoProvider();
