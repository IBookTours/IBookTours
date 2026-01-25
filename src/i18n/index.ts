// ============================================
// i18n Index (next-intl)
// ============================================
// Re-exports for backwards compatibility
// Actual configuration is in config.ts and request.ts

export * from './config';

// Note: The old react-i18next setup has been replaced with next-intl
// for SEO-safe server-side rendering of translations.
//
// To use translations in components:
// - Client Components: import { useTranslations } from 'next-intl';
// - Server Components: import { getTranslations } from 'next-intl/server';
//
// Example usage:
// const t = useTranslations('nav');
// return <span>{t('home')}</span>; // "Home" or "בית"
