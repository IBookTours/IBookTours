// ============================================
// BREVO (SENDINBLUE) EMAIL PROVIDER
// ============================================
// Implementation of IEmailService using Brevo
//
// Environment Variables Required:
// - BREVO_API_KEY: Your Brevo API key
// - BREVO_SENDER_EMAIL: Verified sender email address
// - BREVO_SENDER_NAME: Sender name for emails
// - BREVO_NEWSLETTER_LIST_ID: List ID for newsletter subscriptions
// - CONTACT_EMAIL: Email to receive contact form submissions

import {
  IEmailService,
  SendEmailParams,
  SendEmailResult,
} from './EmailService';
import {
  renderEmailTemplate,
  EmailLanguage,
  BookingConfirmationData,
  BookingReminderData,
  BookingCancelledData,
  ContactReplyData,
  PasswordResetData,
} from './templates';

const BREVO_API_URL = 'https://api.brevo.com/v3';

export class BrevoProvider implements IEmailService {
  private apiKey: string;
  private senderEmail: string;
  private senderName: string;
  private newsletterListId: number;
  private contactEmail: string;
  private isDemoMode: boolean;

  constructor() {
    this.apiKey = process.env.BREVO_API_KEY || '';
    this.senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@itravel.com';
    this.senderName = process.env.BREVO_SENDER_NAME || 'ITravel';
    this.newsletterListId = parseInt(process.env.BREVO_NEWSLETTER_LIST_ID || '1', 10);
    this.contactEmail = process.env.CONTACT_EMAIL || 'contact@itravel.com';
    this.isDemoMode = !this.apiKey;

    if (this.isDemoMode) {
      console.info('[Email] Running in DEMO MODE - emails will be simulated, not sent');
    }
  }

  private getDemoResult(): SendEmailResult {
    return {
      success: true,
      messageId: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  async sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
    // Demo mode - simulate successful email
    if (this.isDemoMode) {
      console.info('[Email Demo] Would send email:', {
        to: params.to,
        subject: params.subject,
      });
      return this.getDemoResult();
    }

    const { to, subject, htmlContent, textContent, replyTo, templateId, params: templateParams } = params;

    const recipients = Array.isArray(to) ? to : [to];

    const body: Record<string, unknown> = {
      sender: {
        email: this.senderEmail,
        name: this.senderName,
      },
      to: recipients.map((r) => ({ email: r.email, name: r.name })),
      subject,
    };

    if (templateId) {
      body.templateId = templateId;
      if (templateParams) {
        body.params = templateParams;
      }
    } else {
      if (htmlContent) body.htmlContent = htmlContent;
      if (textContent) body.textContent = textContent;
    }

    if (replyTo) {
      body.replyTo = { email: replyTo.email, name: replyTo.name };
    }

    try {
      const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Brevo send email error:', error);
        return { success: false, error: 'Failed to send email' };
      }

      const data = await response.json();
      return { success: true, messageId: data.messageId };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Brevo send email exception:', message);
      return { success: false, error: 'Failed to send email' };
    }
  }

  async sendContactForm(
    data: {
      name: string;
      email: string;
      subject: string;
      message: string;
    },
    language: EmailLanguage = 'en'
  ): Promise<SendEmailResult> {
    const { name, email, subject, message } = data;

    const rendered = renderEmailTemplate(
      'contact-received',
      { name, email, subject, message },
      language
    );

    return this.sendEmail({
      to: { email: this.contactEmail, name: 'ITravel Team' },
      subject: rendered.subject,
      htmlContent: rendered.html,
      textContent: rendered.text,
      replyTo: { email, name },
    });
  }

  async sendContactReply(
    data: {
      customerEmail: string;
      customerName: string;
      originalSubject: string;
      replyMessage: string;
    },
    language: EmailLanguage = 'en'
  ): Promise<SendEmailResult> {
    const rendered = renderEmailTemplate(
      'contact-reply',
      {
        customerName: data.customerName,
        originalSubject: data.originalSubject,
        replyMessage: data.replyMessage,
      } as ContactReplyData,
      language
    );

    return this.sendEmail({
      to: { email: data.customerEmail, name: data.customerName },
      subject: rendered.subject,
      htmlContent: rendered.html,
      textContent: rendered.text,
    });
  }

  async sendBookingConfirmation(
    data: {
      customerEmail: string;
      customerName: string;
      bookingId: string;
      tourName: string;
      tourDate: string;
      travelers?: number;
      totalAmount: string;
      meetingPoint?: string;
      contactPhone?: string;
    },
    language: EmailLanguage = 'en'
  ): Promise<SendEmailResult> {
    const rendered = renderEmailTemplate(
      'booking-confirmation',
      {
        customerName: data.customerName,
        bookingId: data.bookingId,
        tourName: data.tourName,
        tourDate: data.tourDate,
        travelers: data.travelers || 1,
        totalAmount: data.totalAmount,
        meetingPoint: data.meetingPoint,
        contactPhone: data.contactPhone,
      } as BookingConfirmationData,
      language
    );

    return this.sendEmail({
      to: { email: data.customerEmail, name: data.customerName },
      subject: rendered.subject,
      htmlContent: rendered.html,
      textContent: rendered.text,
    });
  }

  async sendBookingReminder(
    data: {
      customerEmail: string;
      customerName: string;
      tourName: string;
      tourDate: string;
      daysUntil: number;
      meetingPoint?: string;
      contactPhone?: string;
    },
    language: EmailLanguage = 'en'
  ): Promise<SendEmailResult> {
    const rendered = renderEmailTemplate(
      'booking-reminder',
      {
        customerName: data.customerName,
        tourName: data.tourName,
        tourDate: data.tourDate,
        daysUntil: data.daysUntil,
        meetingPoint: data.meetingPoint,
        contactPhone: data.contactPhone,
      } as BookingReminderData,
      language
    );

    return this.sendEmail({
      to: { email: data.customerEmail, name: data.customerName },
      subject: rendered.subject,
      htmlContent: rendered.html,
      textContent: rendered.text,
    });
  }

  async sendBookingCancelled(
    data: {
      customerEmail: string;
      customerName: string;
      bookingId: string;
      tourName: string;
      refundAmount?: string;
    },
    language: EmailLanguage = 'en'
  ): Promise<SendEmailResult> {
    const rendered = renderEmailTemplate(
      'booking-cancelled',
      {
        customerName: data.customerName,
        bookingId: data.bookingId,
        tourName: data.tourName,
        refundAmount: data.refundAmount,
      } as BookingCancelledData,
      language
    );

    return this.sendEmail({
      to: { email: data.customerEmail, name: data.customerName },
      subject: rendered.subject,
      htmlContent: rendered.html,
      textContent: rendered.text,
    });
  }

  async sendWelcome(
    data: {
      customerEmail: string;
      customerName: string;
    },
    language: EmailLanguage = 'en'
  ): Promise<SendEmailResult> {
    const rendered = renderEmailTemplate(
      'welcome',
      { customerName: data.customerName },
      language
    );

    return this.sendEmail({
      to: { email: data.customerEmail, name: data.customerName },
      subject: rendered.subject,
      htmlContent: rendered.html,
      textContent: rendered.text,
    });
  }

  async sendPasswordReset(
    data: {
      customerEmail: string;
      customerName: string;
      resetLink: string;
      expiresIn?: string;
    },
    language: EmailLanguage = 'en'
  ): Promise<SendEmailResult> {
    const rendered = renderEmailTemplate(
      'password-reset',
      {
        customerName: data.customerName,
        resetLink: data.resetLink,
        expiresIn: data.expiresIn || '24 hours',
      } as PasswordResetData,
      language
    );

    return this.sendEmail({
      to: { email: data.customerEmail, name: data.customerName },
      subject: rendered.subject,
      htmlContent: rendered.html,
      textContent: rendered.text,
    });
  }

  async addToNewsletter(
    email: string,
    name?: string,
    language: EmailLanguage = 'en',
    sendWelcomeEmail = true
  ): Promise<SendEmailResult> {
    // Demo mode - simulate successful subscription
    if (this.isDemoMode) {
      console.info('[Email Demo] Would add to newsletter:', { email, name });
      if (sendWelcomeEmail) {
        const rendered = renderEmailTemplate('newsletter-welcome', { email }, language);
        console.info('[Email Demo] Would send newsletter welcome:', {
          to: email,
          subject: rendered.subject,
        });
      }
      return this.getDemoResult();
    }

    const body: Record<string, unknown> = {
      email,
      listIds: [this.newsletterListId],
      updateEnabled: true,
    };

    if (name) {
      body.attributes = { FIRSTNAME: name };
    }

    try {
      const response = await fetch(`${BREVO_API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        // Contact already exists is not an error
        if (error.includes('Contact already exist')) {
          return { success: true };
        }
        console.error('Brevo add to newsletter error:', error);
        return { success: false, error: 'Failed to subscribe to newsletter' };
      }

      // Send welcome email for new subscribers
      if (sendWelcomeEmail) {
        const rendered = renderEmailTemplate('newsletter-welcome', { email }, language);
        await this.sendEmail({
          to: { email, name },
          subject: rendered.subject,
          htmlContent: rendered.html,
          textContent: rendered.text,
        });
      }

      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Brevo add to newsletter exception:', message);
      return { success: false, error: 'Failed to subscribe to newsletter' };
    }
  }

  getProviderName(): string {
    return 'Brevo';
  }
}
