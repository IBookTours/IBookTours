// ============================================
// EMAIL TEMPLATE TYPES
// ============================================
// Service-agnostic template types that work with any email provider

export type EmailLanguage = 'en' | 'he';

export type EmailTemplateType =
  | 'welcome'
  | 'booking-confirmation'
  | 'booking-reminder'
  | 'booking-cancelled'
  | 'contact-received'
  | 'contact-reply'
  | 'newsletter-welcome'
  | 'password-reset';

// Data types for each template
export interface WelcomeData {
  customerName: string;
}

export interface BookingConfirmationData {
  customerName: string;
  bookingId: string;
  tourName: string;
  tourDate: string;
  travelers: number;
  totalAmount: string;
  meetingPoint?: string;
  contactPhone?: string;
}

export interface BookingReminderData {
  customerName: string;
  tourName: string;
  tourDate: string;
  daysUntil: number;
  meetingPoint?: string;
  contactPhone?: string;
}

export interface BookingCancelledData {
  customerName: string;
  bookingId: string;
  tourName: string;
  refundAmount?: string;
}

export interface ContactReceivedData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactReplyData {
  customerName: string;
  originalSubject: string;
  replyMessage: string;
}

export interface NewsletterWelcomeData {
  email: string;
}

export interface PasswordResetData {
  customerName: string;
  resetLink: string;
  expiresIn: string;
}

// Map template type to its data type
export interface EmailTemplateDataMap {
  'welcome': WelcomeData;
  'booking-confirmation': BookingConfirmationData;
  'booking-reminder': BookingReminderData;
  'booking-cancelled': BookingCancelledData;
  'contact-received': ContactReceivedData;
  'contact-reply': ContactReplyData;
  'newsletter-welcome': NewsletterWelcomeData;
  'password-reset': PasswordResetData;
}

// Template render result
export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

// Template function type
export type EmailTemplate<T extends EmailTemplateType> = (
  data: EmailTemplateDataMap[T]
) => RenderedEmail;
