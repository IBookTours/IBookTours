/**
 * Service Registry
 *
 * Centralized configuration for all service providers.
 * This allows easy configuration for different environments
 * and prepares for domain/email customization.
 */

import { isDemoMode } from '@/lib/env';
import { createLogger } from '@/lib/logger';

const logger = createLogger('ServiceRegistry');

/**
 * Email provider configuration
 */
export interface EmailConfig {
  provider: 'brevo' | 'sendgrid' | 'mock';
  apiKey?: string;
  senderEmail: string;
  senderName: string;
  contactEmail: string;
  newsletterListId?: number;
}

/**
 * Payment provider configuration
 */
export interface PaymentConfig {
  provider: 'stripe' | 'mock';
  secretKey?: string;
  publishableKey?: string;
  webhookSecret?: string;
}

/**
 * Domain configuration for custom domains
 */
export interface DomainConfig {
  domain: string;
  baseUrl: string;
  supportEmail: string;
  noReplyEmail: string;
}

/**
 * Complete service configuration
 */
export interface ServiceConfig {
  email: EmailConfig;
  payment: PaymentConfig;
  domain: DomainConfig;
}

/**
 * Get the default domain configuration
 */
function getDefaultDomain(): DomainConfig {
  const domain = process.env.DOMAIN || 'ibooktours.com';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${domain}`;

  return {
    domain,
    baseUrl,
    supportEmail: process.env.SUPPORT_EMAIL || `support@${domain}`,
    noReplyEmail: process.env.NOREPLY_EMAIL || `noreply@${domain}`,
  };
}

/**
 * Get email configuration from environment
 */
function getEmailConfig(): EmailConfig {
  const domain = getDefaultDomain();
  const apiKey = process.env.BREVO_API_KEY;

  // Determine provider based on available credentials
  let provider: EmailConfig['provider'] = 'mock';
  if (apiKey && !isDemoMode()) {
    provider = 'brevo';
  }
  // Add sendgrid check here if needed:
  // if (process.env.SENDGRID_API_KEY) provider = 'sendgrid';

  return {
    provider,
    apiKey,
    senderEmail: process.env.BREVO_SENDER_EMAIL || domain.noReplyEmail,
    senderName: process.env.BREVO_SENDER_NAME || 'IBookTours',
    contactEmail: process.env.CONTACT_EMAIL || domain.supportEmail,
    newsletterListId: parseInt(process.env.BREVO_NEWSLETTER_LIST_ID || '1', 10),
  };
}

/**
 * Get payment configuration from environment
 */
function getPaymentConfig(): PaymentConfig {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  // Determine provider based on available credentials
  let provider: PaymentConfig['provider'] = 'mock';
  if (secretKey && !secretKey.includes('placeholder') && !isDemoMode()) {
    provider = 'stripe';
  }

  return {
    provider,
    secretKey,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  };
}

/**
 * Service configuration singleton
 */
let cachedConfig: ServiceConfig | null = null;

/**
 * Get the complete service configuration
 */
export function getServiceConfig(): ServiceConfig {
  if (!cachedConfig) {
    cachedConfig = {
      email: getEmailConfig(),
      payment: getPaymentConfig(),
      domain: getDefaultDomain(),
    };

    logger.info('Service configuration loaded', {
      emailProvider: cachedConfig.email.provider,
      paymentProvider: cachedConfig.payment.provider,
      domain: cachedConfig.domain.domain,
    });
  }

  return cachedConfig;
}

/**
 * Reset configuration (for testing)
 */
export function resetServiceConfig(): void {
  cachedConfig = null;
}

/**
 * Check if email service is in production mode
 */
export function isEmailProduction(): boolean {
  const config = getServiceConfig();
  return config.email.provider !== 'mock';
}

/**
 * Check if payment service is in production mode
 */
export function isPaymentProduction(): boolean {
  const config = getServiceConfig();
  return config.payment.provider !== 'mock';
}
