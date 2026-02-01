'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import {
  User,
  LogOut,
  Settings,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import styles from './LoginButton.module.scss';

interface LoginButtonProps {
  variant?: 'navbar' | 'mobile';
  onAction?: () => void;
}

export default function LoginButton({
  variant = 'navbar',
  onAction,
}: LoginButtonProps) {
  const { data: session, status } = useSession();
  const t = useTranslations('auth');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSignIn = () => {
    onAction?.();
    signIn();
  };

  const handleSignOut = () => {
    setIsDropdownOpen(false);
    onAction?.();
    signOut({ callbackUrl: '/' });
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLinkClick = () => {
    setIsDropdownOpen(false);
    onAction?.();
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className={`${styles.loginButton} ${styles[variant]}`}>
        <div className={styles.loadingState}>
          <Loader2 className={styles.spinner} />
        </div>
      </div>
    );
  }

  // Not authenticated - show sign in button
  if (!session) {
    return (
      <button
        className={`${styles.signInButton} ${styles[variant]}`}
        onClick={handleSignIn}
      >
        {t('signIn')}
      </button>
    );
  }

  // Authenticated - show user dropdown
  const isAdmin = session.user?.role === 'admin';

  return (
    <div
      className={`${styles.loginButton} ${styles[variant]}`}
      ref={dropdownRef}
    >
      <button
        className={styles.userButton}
        onClick={handleDropdownToggle}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <div className={styles.avatar}>
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User avatar'}
              width={32}
              height={32}
              className={styles.avatarImage}
            />
          ) : (
            <User className={styles.avatarIcon} />
          )}
        </div>
        <span className={styles.userName}>
          {session.user?.name?.split(' ')[0] || 'User'}
        </span>
        <ChevronDown
          className={`${styles.chevron} ${isDropdownOpen ? styles.open : ''}`}
        />
      </button>

      {isDropdownOpen && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.dropdownHeader}>
            <div className={styles.userInfo}>
              <span className={styles.userFullName}>{session.user?.name}</span>
              <span className={styles.userEmail}>{session.user?.email}</span>
              {isAdmin && <span className={styles.adminBadge}>Admin</span>}
            </div>
          </div>

          <div className={styles.dropdownDivider} />

          <Link
            href="/profile"
            className={styles.dropdownItem}
            onClick={handleLinkClick}
            role="menuitem"
          >
            <User className={styles.itemIcon} />
            <span>{t('profile')}</span>
          </Link>

          {isAdmin && (
            <Link
              href="/studio"
              className={styles.dropdownItem}
              onClick={handleLinkClick}
              role="menuitem"
            >
              <Settings className={styles.itemIcon} />
              <span>{t('adminStudio')}</span>
            </Link>
          )}

          <div className={styles.dropdownDivider} />

          <button
            className={`${styles.dropdownItem} ${styles.signOutItem}`}
            onClick={handleSignOut}
            role="menuitem"
          >
            <LogOut className={styles.itemIcon} />
            <span>{t('signOut')}</span>
          </button>
        </div>
      )}
    </div>
  );
}
