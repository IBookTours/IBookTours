// ============================================
// next-intl Request Configuration
// ============================================
// This file provides locale for Server Components
// Based on next-intl's non-routing setup
//
// Note: We use the default locale for server-side rendering.
// Client-side I18nProvider handles actual locale switching based on
// user preference stored in localStorage/cookies.

import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from './config';

export default getRequestConfig(async () => {
  // Always use default locale for server-side rendering
  // The client-side I18nProvider will handle locale switching
  // based on user's preference stored in localStorage/cookies
  const locale = defaultLocale;

  // Load the messages for the default locale
  // Client-side provider loads both locales and handles switching
  const messages = (await import(`./locales/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
