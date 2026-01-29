'use client';

import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';
import styles from './CookieConsent.module.scss';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(STORAGE_KEYS.cookieConsent);
    if (consent === null) {
      // Small delay before showing banner for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEYS.cookieConsent, 'accepted');
    setShowBanner(false);
    // Here you would enable analytics/tracking scripts
    // window.dataLayer?.push({ event: 'cookie_consent_given' });
  };

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEYS.cookieConsent, 'declined');
    setShowBanner(false);
    // Analytics remain disabled
  };

  if (!showBanner) return null;

  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie consent">
      <div className={styles.content}>
        <div className={styles.text}>
          <h3 className={styles.title}>We value your privacy</h3>
          <p className={styles.description}>
            We use cookies to enhance your browsing experience and analyze our traffic.
            By clicking &quot;Accept&quot;, you consent to our use of cookies.{' '}
            <a href="/cookies" className={styles.link}>Learn more</a>
          </p>
        </div>
        <div className={styles.actions}>
          <button
            onClick={handleDecline}
            className={styles.declineButton}
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className={styles.acceptButton}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
