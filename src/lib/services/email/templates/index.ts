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

// Import English templates
import * as enTemplates from './en';
// Import Hebrew templates
import * as heTemplates from './he';

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
