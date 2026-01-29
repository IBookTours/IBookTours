/**
 * Email Service Factory
 *
 * Provides email service instances based on configuration.
 * Use getEmailService() to get the configured provider.
 */

import { getServiceConfig, type EmailConfig } from '../ServiceRegistry';
import { createLogger } from '@/lib/logger';
import { BrevoProvider } from './BrevoProvider';
import type { IEmailService } from './EmailService';

// Types
export type {
  IEmailService,
  EmailRecipient,
  SendEmailParams,
  SendEmailResult,
  AddToListParams,
} from './EmailService';

// Providers (for direct use if needed)
export { BrevoProvider } from './BrevoProvider';

const logger = createLogger('EmailServiceFactory');

/**
 * Email service singleton
 */
let emailServiceInstance: IEmailService | null = null;

/**
 * Create email service based on configuration
 */
function createEmailService(config: EmailConfig): IEmailService {
  logger.info('Creating email service', { provider: config.provider });

  switch (config.provider) {
    case 'brevo':
      return new BrevoProvider(config);
    // Add other providers here:
    // case 'sendgrid':
    //   return new SendGridProvider(config);
    case 'mock':
    default:
      // Use Brevo in demo mode (it handles demo mode internally)
      return new BrevoProvider(config);
  }
}

/**
 * Get the configured email service
 *
 * This is the primary way to access email functionality.
 * The provider is determined by environment configuration.
 */
export function getEmailService(): IEmailService {
  if (!emailServiceInstance) {
    const config = getServiceConfig();
    emailServiceInstance = createEmailService(config.email);
    logger.info('Email service initialized', {
      provider: config.email.provider,
      senderEmail: config.email.senderEmail,
    });
  }
  return emailServiceInstance;
}

/**
 * Reset email service (for testing)
 */
export function resetEmailService(): void {
  emailServiceInstance = null;
}

/**
 * Default email service instance (for backward compatibility)
 *
 * Prefer using getEmailService() for explicit initialization,
 * but this export maintains compatibility with existing code.
 */
export const emailService = getEmailService();
