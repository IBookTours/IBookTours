'use client';

import { useEffect, useState } from 'react';
import '@/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set initial direction based on saved language
    const savedLang = localStorage.getItem('language') || 'en';
    document.documentElement.dir = savedLang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang;
    setMounted(true);
  }, []);

  // Prevent flash of wrong direction
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
