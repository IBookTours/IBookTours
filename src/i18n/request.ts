// ============================================
// next-intl Request Configuration
// ============================================
// This file provides locale for Server Components
// Based on next-intl's non-routing setup

import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { defaultLocale, locales, type Locale } from './config';

export default getRequestConfig(async () => {
  // Try to get locale from cookie (set by language switcher)
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined;

  // Try to get from Accept-Language header as fallback
  const headerStore = await headers();
  const acceptLanguage = headerStore.get('accept-language') || '';
  const browserLocale = acceptLanguage
    .split(',')[0]
    ?.split('-')[0]
    ?.toLowerCase() as Locale | undefined;

  // Determine the locale
  let locale: Locale = defaultLocale;

  if (cookieLocale && locales.includes(cookieLocale)) {
    locale = cookieLocale;
  } else if (browserLocale && locales.includes(browserLocale)) {
    locale = browserLocale;
  }

  // Load the messages for the locale
  const messages = (await import(`./locales/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
