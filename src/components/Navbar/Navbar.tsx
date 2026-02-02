'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, Sun, Moon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { NavItem } from '@/types';
import { LoginButton } from '@/components/Auth';
import { ThemeToggle, useTheme } from '@/components/ThemeProvider';
import { CartIcon } from '@/components/Cart';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { SearchOverlay } from '@/components/SearchOverlay';
import styles from './Navbar.module.scss';

interface NavbarProps {
  navigation: NavItem[];
  siteName: string;
}

export default function Navbar({ navigation, siteName }: NavbarProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const t = useTranslations('nav');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Scroll handler with rAF throttling for performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`} role="banner">
        <div className={styles.container}>
          <Link href="/" className={styles.logo} aria-label="IBookTours Home - Book Tours to Albania">
            <span className={styles.logoIcon}>
              <Image src="/logo.svg" alt="" width={40} height={40} priority aria-hidden="true" />
            </span>
            {siteName}
          </Link>

          <nav className={styles.nav} aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`${styles.navLink} ${item.isActive ? styles.active : ''}`}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {t(item.id)}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <ThemeToggle className={styles.themeToggle} />
            <div className={styles.langSwitcherDesktop}>
              <LanguageSwitcher variant="desktop" />
            </div>
            <button
              className={styles.searchBtn}
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search />
            </button>
            <CartIcon scrolled={isScrolled} />
            <div className={styles.loginWrapper}>
              <LoginButton variant="navbar" />
            </div>
            <button
              className={styles.mobileMenuBtn}
              onClick={toggleMobileMenu}
              aria-label="Open menu"
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuHeader}>
          <Link href="/" className={styles.logo} onClick={closeMobileMenu} aria-label="IBookTours Home - Book Tours to Albania">
            <span className={styles.logoIcon}>
              <Image src="/logo.svg" alt="" width={40} height={40} aria-hidden="true" />
            </span>
            {siteName}
          </Link>
          <button
            className={styles.mobileMenuClose}
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <X />
          </button>
        </div>

        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`${styles.mobileNavLink} ${item.isActive ? styles.active : ''}`}
              onClick={closeMobileMenu}
              aria-current={item.isActive ? 'page' : undefined}
            >
              {t(item.id)}
            </Link>
          ))}
        </nav>

        <div className={styles.mobileActions}>
          <button
            className={styles.mobileThemeToggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span>{resolvedTheme === 'light' ? t('darkMode') : t('lightMode')}</span>
            {resolvedTheme === 'light' ? <Moon /> : <Sun />}
          </button>
          <LanguageSwitcher variant="mobile" onAction={closeMobileMenu} />
          <LoginButton variant="mobile" onAction={closeMobileMenu} />
        </div>
      </div>

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
