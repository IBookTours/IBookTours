/**
 * Base Email Service Abstract Class
 *
 * Extends BaseService with email-specific functionality:
 * - Template selection (locale-aware)
 * - Common email formatting
 * - Demo mode email simulation
 */

import { BaseService, ServiceResult } from './BaseService';

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface SendEmailParams {
  to: EmailRecipient | EmailRecipient[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  replyTo?: EmailRecipient;
  templateId?: number;
  params?: Record<string, string>;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export abstract class BaseEmailService extends BaseService {
  protected readonly senderEmail: string;
  protected readonly senderName: string;

  constructor(
    serviceName: string,
    senderEmail: string = 'noreply@ibooktours.com',
    senderName: string = 'IBookTours'
  ) {
    super(serviceName);
    this.senderEmail = senderEmail;
    this.senderName = senderName;
  }

  /**
   * Format email recipient for logging (mask email for privacy)
   */
  protected maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!local || !domain) return '***';
    const maskedLocal = local.length > 2
      ? `${local[0]}***${local[local.length - 1]}`
      : '***';
    return `${maskedLocal}@${domain}`;
  }

  /**
   * Normalize recipients to array
   */
  protected normalizeRecipients(to: EmailRecipient | EmailRecipient[]): EmailRecipient[] {
    return Array.isArray(to) ? to : [to];
  }

  /**
   * Get locale from email or default
   */
  protected detectLocale(email: string): 'en' | 'he' {
    // Simple heuristic: .il domains default to Hebrew
    return email.endsWith('.il') ? 'he' : 'en';
  }

  /**
   * Simulate sending email in demo mode
   */
  protected simulateSend(params: SendEmailParams): SendEmailResult {
    const recipients = this.normalizeRecipients(params.to);
    this.logInfo('Demo mode: Email simulated', {
      to: recipients.map(r => this.maskEmail(r.email)),
      subject: params.subject,
    });
    return {
      success: true,
      messageId: `demo-${Date.now()}`,
    };
  }

  /**
   * Send a transactional email
   */
  abstract sendEmail(params: SendEmailParams): Promise<SendEmailResult>;

  /**
   * Send a contact form submission
   */
  abstract sendContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<SendEmailResult>;

  /**
   * Send a booking confirmation email
   */
  abstract sendBookingConfirmation(data: {
    customerEmail: string;
    customerName: string;
    bookingId: string;
    tourName: string;
    tourDate: string;
    totalAmount: string;
  }): Promise<SendEmailResult>;

  /**
   * Add an email to a newsletter list
   */
  abstract addToNewsletter(email: string, name?: string): Promise<SendEmailResult>;
}

export type { ServiceResult };
