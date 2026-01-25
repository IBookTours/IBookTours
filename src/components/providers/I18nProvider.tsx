'use client';

import { useEffect } from 'react';
import '@/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // Set initial direction based on saved language
    const savedLang = localStorage.getItem('language') || 'en';
    document.documentElement.dir = savedLang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang;
  }, []);

  // Always render children to avoid hydration mismatch
  return <>{children}</>;
}
