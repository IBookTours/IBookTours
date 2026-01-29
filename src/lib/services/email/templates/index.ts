// ============================================
// EMAIL TEMPLATE RENDERER
// ============================================
// Service-agnostic template system supporting multiple languages

import {
  EmailLanguage,
  EmailTemplateType,
  EmailTemplateDataMap,
  RenderedEmail,
} from './types';

// Import all language templates
import * as enTemplates from './en';
import * as heTemplates from './he';
import * as ptTemplates from './pt';
import * as sqTemplates from './sq';
import * as esTemplates from './es';
import * as arTemplates from './ar';
import * as ruTemplates from './ru';
import * as nlTemplates from './nl';

// Template registry by language
const templatesByLanguage = {
  en: {
    'welcome': enTemplates.welcomeTemplate,
    'booking-confirmation': enTemplates.bookingConfirmationTemplate,
    'booking-reminder': enTemplates.bookingReminderTemplate,
    'booking-cancelled': enTemplates.bookingCancelledTemplate,
    'contact-received': enTemplates.contactReceivedTemplate,
    'contact-reply': enTemplates.contactReplyTemplate,
    'newsletter-welcome': enTemplates.newsletterWelcomeTemplate,
    'password-reset': enTemplates.passwordResetTemplate,
  },
  he: {
    'welcome': heTemplates.welcomeTemplate,
    'booking-confirmation': heTemplates.bookingConfirmationTemplate,
    'booking-reminder': heTemplates.bookingReminderTemplate,
    'booking-cancelled': heTemplates.bookingCancelledTemplate,
    'contact-received': heTemplates.contactReceivedTemplate,
    'contact-reply': heTemplates.contactReplyTemplate,
    'newsletter-welcome': heTemplates.newsletterWelcomeTemplate,
    'password-reset': heTemplates.passwordResetTemplate,
  },
  pt: {
    'welcome': ptTemplates.welcomeTemplate,
    'booking-confirmation': ptTemplates.bookingConfirmationTemplate,
    'booking-reminder': ptTemplates.bookingReminderTemplate,
    'booking-cancelled': ptTemplates.bookingCancelledTemplate,
    'contact-received': ptTemplates.contactReceivedTemplate,
    'contact-reply': ptTemplates.contactReplyTemplate,
    'newsletter-welcome': ptTemplates.newsletterWelcomeTemplate,
    'password-reset': ptTemplates.passwordResetTemplate,
  },
  sq: {
    'welcome': sqTemplates.welcomeTemplate,
    'booking-confirmation': sqTemplates.bookingConfirmationTemplate,
    'booking-reminder': sqTemplates.bookingReminderTemplate,
    'booking-cancelled': sqTemplates.bookingCancelledTemplate,
    'contact-received': sqTemplates.contactReceivedTemplate,
    'contact-reply': sqTemplates.contactReplyTemplate,
    'newsletter-welcome': sqTemplates.newsletterWelcomeTemplate,
    'password-reset': sqTemplates.passwordResetTemplate,
  },
  es: {
    'welcome': esTemplates.welcomeTemplate,
    'booking-confirmation': esTemplates.bookingConfirmationTemplate,
    'booking-reminder': esTemplates.bookingReminderTemplate,
    'booking-cancelled': esTemplates.bookingCancelledTemplate,
    'contact-received': esTemplates.contactReceivedTemplate,
    'contact-reply': esTemplates.contactReplyTemplate,
    'newsletter-welcome': esTemplates.newsletterWelcomeTemplate,
    'password-reset': esTemplates.passwordResetTemplate,
  },
  ar: {
    'welcome': arTemplates.welcomeTemplate,
    'booking-confirmation': arTemplates.bookingConfirmationTemplate,
    'booking-reminder': arTemplates.bookingReminderTemplate,
    'booking-cancelled': arTemplates.bookingCancelledTemplate,
    'contact-received': arTemplates.contactReceivedTemplate,
    'contact-reply': arTemplates.contactReplyTemplate,
    'newsletter-welcome': arTemplates.newsletterWelcomeTemplate,
    'password-reset': arTemplates.passwordResetTemplate,
  },
  ru: {
    'welcome': ruTemplates.welcomeTemplate,
    'booking-confirmation': ruTemplates.bookingConfirmationTemplate,
    'booking-reminder': ruTemplates.bookingReminderTemplate,
    'booking-cancelled': ruTemplates.bookingCancelledTemplate,
    'contact-received': ruTemplates.contactReceivedTemplate,
    'contact-reply': ruTemplates.contactReplyTemplate,
    'newsletter-welcome': ruTemplates.newsletterWelcomeTemplate,
    'password-reset': ruTemplates.passwordResetTemplate,
  },
  nl: {
    'welcome': nlTemplates.welcomeTemplate,
    'booking-confirmation': nlTemplates.bookingConfirmationTemplate,
    'booking-reminder': nlTemplates.bookingReminderTemplate,
    'booking-cancelled': nlTemplates.bookingCancelledTemplate,
    'contact-received': nlTemplates.contactReceivedTemplate,
    'contact-reply': nlTemplates.contactReplyTemplate,
    'newsletter-welcome': nlTemplates.newsletterWelcomeTemplate,
    'password-reset': nlTemplates.passwordResetTemplate,
  },
};

/**
 * Render an email template with the given data and language
 * @param type - The template type to render
 * @param data - The data to pass to the template
 * @param language - The language to use (default: 'en')
 * @returns Rendered email with subject, html, and text
 */
export function renderEmailTemplate<T extends EmailTemplateType>(
  type: T,
  data: EmailTemplateDataMap[T],
  language: EmailLanguage = 'en'
): RenderedEmail {
  const templates = templatesByLanguage[language];

  if (!templates) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const templateFn = templates[type];

  if (!templateFn) {
    throw new Error(`Template not found: ${type} for language ${language}`);
  }

  // Cast needed due to TypeScript's handling of mapped types
  return (templateFn as (data: EmailTemplateDataMap[T]) => RenderedEmail)(data);
}

// Re-export types
export * from './types';
export { baseTemplate, htmlToText } from './base';
