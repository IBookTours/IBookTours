'use client';

import { useEffect, useState, useCallback } from 'react';
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';
import { defaultLocale, isRTL, type Locale } from '@/i18n/config';

// Only import English statically as fallback - other locales load dynamically
import enMessages from '@/i18n/locales/en.json';

// Dynamic locale loaders - code-split by locale
const localeLoaders: Record<Locale, () => Promise<{ default: AbstractIntlMessages }>> = {
  en: () => Promise.resolve({ default: enMessages }),
  he: () => import('@/i18n/locales/he.json'),
  pt: () => import('@/i18n/locales/pt.json'),
  sq: () => import('@/i18n/locales/sq.json'),
  es: () => import('@/i18n/locales/es.json'),
  ar: () => import('@/i18n/locales/ar.json'),
  ru: () => import('@/i18n/locales/ru.json'),
  nl: () => import('@/i18n/locales/nl.json'),
};

// Cache loaded messages to avoid re-fetching
const messagesCache: Partial<Record<Locale, AbstractIntlMessages>> = {
  en: enMessages,
};

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<AbstractIntlMessages>(enMessages);
  const [mounted, setMounted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load messages for a locale (with caching)
  const loadMessages = useCallback(async (targetLocale: Locale) => {
    if (messagesCache[targetLocale]) {
      setMessages(messagesCache[targetLocale]!);
      return;
    }

    try {
      const localeData = await localeLoaders[targetLocale]();
      messagesCache[targetLocale] = localeData.default;
      setMessages(localeData.default);
    } catch (error) {
      console.error(`Failed to load locale ${targetLocale}, falling back to English`);
      setMessages(enMessages);
    }
  }, []);

  useEffect(() => {
    setMounted(true);

    // Get initial locale from cookie or localStorage
    const cookieLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] as Locale | undefined;

    const storedLocale = localStorage.getItem('locale') as Locale | null;
    const initialLocale = cookieLocale || storedLocale || defaultLocale;

    setLocale(initialLocale);
    loadMessages(initialLocale);
    updateDocumentDirection(initialLocale);

    // Mark as hydrated after locale is set to prevent flicker
    setIsHydrated(true);
  }, [loadMessages]);

  // Add i18n-ready class to body once hydration is complete
  useEffect(() => {
    if (isHydrated) {
      document.body.classList.add('i18n-ready');
    }
    return () => {
      document.body.classList.remove('i18n-ready');
    };
  }, [isHydrated]);

  const updateDocumentDirection = (lang: Locale) => {
    document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  // Provide a function to change locale that can be used by LanguageSwitcher
  useEffect(() => {
    // Expose locale change function globally for LanguageSwitcher
    (window as unknown as { __setLocale: (l: Locale) => void }).__setLocale = async (newLocale: Locale) => {
      setLocale(newLocale);
      await loadMessages(newLocale);
      localStorage.setItem('locale', newLocale);
      // Set cookie for server-side detection
      document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
      updateDocumentDirection(newLocale);
    };

    return () => {
      delete (window as unknown as { __setLocale?: (l: Locale) => void }).__setLocale;
    };
  }, [loadMessages]);

  // Prevent hydration mismatch by rendering with default locale on first render
  if (!mounted) {
    return (
      <NextIntlClientProvider locale={defaultLocale} messages={enMessages} timeZone="Europe/Tirane">
        {children}
      </NextIntlClientProvider>
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Tirane">
      {children}
    </NextIntlClientProvider>
  );
}

// Hook to get current locale and change function
export function useLocale(): [Locale, (locale: Locale) => void] {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const storedLocale = localStorage.getItem('locale') as Locale | null;
    if (storedLocale) {
      setLocaleState(storedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    const setFn = (window as unknown as { __setLocale?: (l: Locale) => void }).__setLocale;
    if (setFn) {
      setFn(newLocale);
      setLocaleState(newLocale);
    }
  };

  return [locale, setLocale];
}
