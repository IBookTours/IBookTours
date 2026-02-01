'use client';

import { useState, useEffect, useRef, useCallback, KeyboardEvent } from 'react';
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
  { code: 'pt', name: 'Portuguese', nativeName: localeNames.pt, flag: '🇧🇷' },
  { code: 'sq', name: 'Albanian', nativeName: localeNames.sq, flag: '🇦🇱' },
  { code: 'es', name: 'Spanish', nativeName: localeNames.es, flag: '🇪🇸' },
  { code: 'ar', name: 'Arabic', nativeName: localeNames.ar, flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', nativeName: localeNames.ru, flag: '🇷🇺' },
  { code: 'nl', name: 'Dutch', nativeName: localeNames.nl, flag: '🇳🇱' },
];

export default function LanguageSwitcher({ variant = 'desktop', onAction }: LanguageSwitcherProps) {
  const [locale, setLocale] = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Memoize click outside handler
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleLanguageChange = useCallback((langCode: Locale) => {
    setLocale(langCode);
    setIsOpen(false);
    setFocusedIndex(-1);
    onAction?.();
  }, [setLocale, onAction]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev < languages.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : languages.length - 1));
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(languages.length - 1);
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < languages.length) {
          handleLanguageChange(languages[focusedIndex].code);
        }
        break;
      case 'Tab':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  }, [isOpen, focusedIndex, handleLanguageChange]);

  // Focus the option when focusedIndex changes
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.focus();
    }
  }, [isOpen, focusedIndex]);

  const currentLanguage = languages.find((l) => l.code === locale) || languages[0];

  if (variant === 'mobile') {
    return (
      <div className={styles.mobileContainer} ref={dropdownRef} onKeyDown={handleKeyDown}>
        <button
          className={styles.mobileButton}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={`Select language, current: ${currentLanguage.name}`}
        >
          <Globe size={20} aria-hidden="true" />
          <span>{currentLanguage.nativeName}</span>
          <ChevronDown size={14} className={`${styles.chevron} ${isOpen ? styles.open : ''}`} aria-hidden="true" />
        </button>
        {isOpen && (
          <div className={styles.mobileDropdown} role="listbox" aria-activedescendant={focusedIndex >= 0 ? `lang-option-mobile-${languages[focusedIndex].code}` : undefined}>
            {languages.map((lang, index) => (
              <button
                key={lang.code}
                id={`lang-option-mobile-${lang.code}`}
                ref={(el) => { optionRefs.current[index] = el; }}
                className={`${styles.mobileOption} ${lang.code === locale ? styles.active : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
                role="option"
                aria-selected={lang.code === locale}
                tabIndex={focusedIndex === index ? 0 : -1}
              >
                <span className={styles.flag} aria-hidden="true">{lang.flag}</span>
                <span className={styles.langName}>{lang.nativeName}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container} ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Select language, current: ${currentLanguage.name}`}
      >
        <Globe size={18} aria-hidden="true" />
        <span className={styles.langCode}>{locale.toUpperCase()}</span>
        <ChevronDown size={14} className={`${styles.chevron} ${isOpen ? styles.open : ''}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="listbox" aria-activedescendant={focusedIndex >= 0 ? `lang-option-${languages[focusedIndex].code}` : undefined}>
          {languages.map((lang, index) => (
            <button
              key={lang.code}
              id={`lang-option-${lang.code}`}
              ref={(el) => { optionRefs.current[index] = el; }}
              className={`${styles.option} ${lang.code === locale ? styles.active : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
              role="option"
              aria-selected={lang.code === locale}
              tabIndex={focusedIndex === index ? 0 : -1}
            >
              <span className={styles.flag} aria-hidden="true">{lang.flag}</span>
              <span className={styles.langName}>{lang.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
