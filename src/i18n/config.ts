// ============================================
// i18n Configuration (next-intl)
// ============================================
// Centralized configuration for internationalization
// Supports both URL-based routing and client-side switching

export const locales = ['en', 'he'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// Locale metadata for language switcher
export const localeNames: Record<Locale, string> = {
  en: 'English',
  he: 'עברית',
};

// RTL locales
export const rtlLocales: Locale[] = ['he'];

export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

// URL path patterns to exclude from locale detection
export const localeExcludedPaths = [
  '/api',
  '/studio',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json',
];

// Check if a path should be excluded from locale handling
export function isExcludedPath(pathname: string): boolean {
  return localeExcludedPaths.some(
    (path) => pathname.startsWith(path) || pathname.includes('.')
  );
}
