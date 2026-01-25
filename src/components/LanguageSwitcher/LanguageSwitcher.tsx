'use client';

import { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLocale } from '@/components/providers/I18nProvider';
import { localeNames, type Locale } from '@/i18n/config';
import styles from './LanguageSwitcher.module.scss';

interface LanguageSwitcherProps {
  variant?: 'desktop' | 'mobile';
  onAction?: () => void;
}

const languages: { code: Locale; name: string; nativeName: string; flag: string }[] = [
  { code: 'en', name: 'English', nativeName: localeNames.en, flag: '🇬🇧' },
  { code: 'he', name: 'Hebrew', nativeName: localeNames.he, flag: '🇮🇱' },
];

export default function LanguageSwitcher({ variant = 'desktop', onAction }: LanguageSwitcherProps) {
  const [locale, setLocale] = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: Locale) => {
    setLocale(langCode);
    setIsOpen(false);
    onAction?.();
  };

  const currentLanguage = languages.find((l) => l.code === locale) || languages[0];
  const otherLanguage = languages.find((l) => l.code !== locale) || languages[1];

  if (variant === 'mobile') {
    return (
      <button
        className={styles.mobileButton}
        onClick={() => handleLanguageChange(otherLanguage.code)}
      >
        <Globe size={20} />
        <span>{otherLanguage.nativeName}</span>
      </button>
    );
  }

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe size={18} />
        <span className={styles.langCode}>{locale.toUpperCase()}</span>
        <ChevronDown size={14} className={`${styles.chevron} ${isOpen ? styles.open : ''}`} />
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`${styles.option} ${lang.code === locale ? styles.active : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
              role="option"
              aria-selected={lang.code === locale}
            >
              <span className={styles.flag}>{lang.flag}</span>
              <span className={styles.langName}>{lang.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
