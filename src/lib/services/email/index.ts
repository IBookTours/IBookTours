/**
 * Email Service Factory
 *
 * Provides email service instances based on configuration.
 * Use getEmailService() to get the configured provider.
 */

import { getServiceConfig, type EmailConfig } from '../ServiceRegistry';
import { createLogger } from '@/lib/logger';

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

// Import provider type
import type { IEmailService } from './EmailService';

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
    case 'brevo': {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { BrevoProvider } = require('./BrevoProvider');
      return new BrevoProvider(config);
    }
    // Add other providers here:
    // case 'sendgrid': {
    //   const { SendGridProvider } = require('./SendGridProvider');
    //   return new SendGridProvider(config);
    // }
    case 'mock':
    default: {
      // Use Brevo in demo mode (it handles demo mode internally)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { BrevoProvider } = require('./BrevoProvider');
      return new BrevoProvider(config);
    }
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
