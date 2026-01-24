// ============================================
// EMAIL SERVICE - Abstract Interface
// ============================================
// This interface allows easy swapping of email providers.
// Currently implemented: Brevo (formerly Sendinblue)
// To add a new provider: Create a new class implementing IEmailService

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

export interface AddToListParams {
  email: string;
  listId: number;
  attributes?: Record<string, string>;
}

export interface IEmailService {
  /**
   * Send a transactional email
   */
  sendEmail(params: SendEmailParams): Promise<SendEmailResult>;

  /**
   * Send a contact form submission
   */
  sendContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<SendEmailResult>;

  /**
   * Send a booking confirmation email
   */
  sendBookingConfirmation(data: {
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
  addToNewsletter(email: string, name?: string): Promise<SendEmailResult>;

  /**
   * Get the provider name
   */
  getProviderName(): string;
}

export { BrevoProvider } from './BrevoProvider';
