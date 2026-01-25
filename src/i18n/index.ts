'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import he from './locales/he.json';

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined';

// Get saved language from localStorage or default to 'en'
const getSavedLanguage = (): string => {
  if (isBrowser) {
    return localStorage.getItem('language') || 'en';
  }
  return 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    he: { translation: he },
  },
  lng: getSavedLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

// Update document direction when language changes
i18n.on('languageChanged', (lng) => {
  if (isBrowser) {
    localStorage.setItem('language', lng);
    document.documentElement.dir = lng === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  }
});

export default i18n;
