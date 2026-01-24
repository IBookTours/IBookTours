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
    } catch (error) {
      console.error('Brevo send email exception:', error);
      return { success: false, error: 'Failed to send email' };
    }
  }

  async sendContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<SendEmailResult> {
    const { name, email, subject, message } = data;

    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    return this.sendEmail({
      to: { email: this.contactEmail, name: 'ITravel Team' },
      subject: `Contact Form: ${subject}`,
      htmlContent,
      replyTo: { email, name },
    });
  }

  async sendBookingConfirmation(data: {
    customerEmail: string;
    customerName: string;
    bookingId: string;
    tourName: string;
    tourDate: string;
    totalAmount: string;
  }): Promise<SendEmailResult> {
    const { customerEmail, customerName, bookingId, tourName, tourDate, totalAmount } = data;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Booking Confirmed!</h1>
        <p>Dear ${customerName},</p>
        <p>Thank you for booking with ITravel. Your adventure awaits!</p>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Booking Details</h2>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Tour:</strong> ${tourName}</p>
          <p><strong>Date:</strong> ${tourDate}</p>
          <p><strong>Total:</strong> ${totalAmount}</p>
        </div>

        <p>If you have any questions, please don't hesitate to contact us.</p>

        <p>Best regards,<br>The ITravel Team</p>
      </div>
    `;

    return this.sendEmail({
      to: { email: customerEmail, name: customerName },
      subject: `Booking Confirmation - ${tourName}`,
      htmlContent,
    });
  }

  async addToNewsletter(email: string, name?: string): Promise<SendEmailResult> {
    // Demo mode - simulate successful subscription
    if (this.isDemoMode) {
      console.info('[Email Demo] Would add to newsletter:', { email, name });
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

      return { success: true };
    } catch (error) {
      console.error('Brevo add to newsletter exception:', error);
      return { success: false, error: 'Failed to subscribe to newsletter' };
    }
  }

  getProviderName(): string {
    return 'Brevo';
  }
}
