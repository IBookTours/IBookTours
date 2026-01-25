'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, Sun, Moon } from 'lucide-react';
import { NavItem } from '@/types';
import { LoginButton } from '@/components/Auth';
import { ThemeToggle, useTheme } from '@/components/ThemeProvider';
import { CartIcon } from '@/components/Cart';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import styles from './Navbar.module.scss';

interface NavbarProps {
  navigation: NavItem[];
  siteName: string;
}

export default function Navbar({ navigation, siteName }: NavbarProps) {
  const router = useRouter();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>
              <Image src="/logo.svg" alt="ITravelTours" width={32} height={32} />
            </span>
            {siteName}
          </Link>

          <nav className={styles.nav}>
            {navigation.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`${styles.navLink} ${item.isActive ? styles.active : ''}`}
              >
                {item.label}
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
              onClick={() => router.push('/tours')}
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
          <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
            <span className={styles.logoIcon}>
              <Image src="/logo.svg" alt="ITravelTours" width={32} height={32} />
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

        <nav className={styles.mobileNav}>
          {navigation.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`${styles.mobileNavLink} ${item.isActive ? styles.active : ''}`}
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.mobileActions}>
          <button
            className={styles.mobileThemeToggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span>{resolvedTheme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            {resolvedTheme === 'light' ? <Moon /> : <Sun />}
          </button>
          <LanguageSwitcher variant="mobile" onAction={closeMobileMenu} />
          <LoginButton variant="mobile" onAction={closeMobileMenu} />
        </div>
      </div>
    </>
  );
}
