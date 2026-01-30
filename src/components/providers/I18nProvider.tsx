'use client';

import { useEffect, useState } from 'react';
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';
import { defaultLocale, isRTL, type Locale } from '@/i18n/config';

// Import messages statically for client-side
import enMessages from '@/i18n/locales/en.json';
import heMessages from '@/i18n/locales/he.json';
import ptMessages from '@/i18n/locales/pt.json';
import sqMessages from '@/i18n/locales/sq.json';
import esMessages from '@/i18n/locales/es.json';
import arMessages from '@/i18n/locales/ar.json';
import ruMessages from '@/i18n/locales/ru.json';
import nlMessages from '@/i18n/locales/nl.json';

const messages: Record<Locale, AbstractIntlMessages> = {
  en: enMessages,
  he: heMessages,
  pt: ptMessages,
  sq: sqMessages,
  es: esMessages,
  ar: arMessages,
  ru: ruMessages,
  nl: nlMessages,
};

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

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
    updateDocumentDirection(initialLocale);
  }, []);

  const updateDocumentDirection = (lang: Locale) => {
    document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  // Provide a function to change locale that can be used by LanguageSwitcher
  useEffect(() => {
    // Expose locale change function globally for LanguageSwitcher
    (window as unknown as { __setLocale: (l: Locale) => void }).__setLocale = (newLocale: Locale) => {
      setLocale(newLocale);
      localStorage.setItem('locale', newLocale);
      // Set cookie for server-side detection
      document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
      updateDocumentDirection(newLocale);
    };

    return () => {
      delete (window as unknown as { __setLocale?: (l: Locale) => void }).__setLocale;
    };
  }, []);

  // Prevent hydration mismatch by rendering with default locale on first render
  if (!mounted) {
    return (
      <NextIntlClientProvider locale={defaultLocale} messages={messages[defaultLocale]}>
        {children}
      </NextIntlClientProvider>
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
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
