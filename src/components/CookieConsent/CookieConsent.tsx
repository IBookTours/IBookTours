'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getCookieConsent,
  setCookieConsent,
  acceptAllCookies,
  rejectNonEssentialCookies,
  hasConsentDecision,
  CookieConsentPreferences,
  COOKIE_CATEGORIES,
  DEFAULT_CONSENT,
  initializeConditionalScripts,
} from '@/lib/cookies';
import { TIMING } from '@/lib/constants';
import styles from './CookieConsent.module.scss';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState<CookieConsentPreferences>(DEFAULT_CONSENT);

  useEffect(() => {
    // Check if user has already made a choice
    if (!hasConsentDecision()) {
      // Small delay before showing banner for better UX
      const timer = setTimeout(() => setShowBanner(true), TIMING.BANNER_SHOW_DELAY);
      return () => clearTimeout(timer);
    } else {
      // Initialize scripts based on existing consent
      initializeConditionalScripts();
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    acceptAllCookies();
    setShowBanner(false);
    setShowModal(false);
    initializeConditionalScripts();
  }, []);

  const handleRejectNonEssential = useCallback(() => {
    rejectNonEssentialCookies();
    setShowBanner(false);
    setShowModal(false);
  }, []);

  const handleOpenPreferences = useCallback(() => {
    // Load current preferences or defaults
    const current = getCookieConsent();
    setPreferences(current?.preferences ?? DEFAULT_CONSENT);
    setShowModal(true);
  }, []);

  const handleSavePreferences = useCallback(() => {
    setCookieConsent(preferences);
    setShowBanner(false);
    setShowModal(false);
    initializeConditionalScripts();
  }, [preferences]);

  const handleToggleCategory = useCallback(
    (category: keyof Omit<CookieConsentPreferences, 'necessary'>) => {
      setPreferences((prev) => ({
        ...prev,
        [category]: !prev[category],
      }));
    },
    []
  );

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  // Don't render anything if banner shouldn't be shown and modal is closed
  if (!showBanner && !showModal) return null;

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && !showModal && (
        <div
          className={styles.banner}
          role="dialog"
          aria-label="Cookie consent"
          aria-describedby="cookie-description"
        >
          <div className={styles.content}>
            <div className={styles.text}>
              <h3 className={styles.title}>We value your privacy</h3>
              <p id="cookie-description" className={styles.description}>
                We use cookies to enhance your browsing experience, analyze site traffic,
                and personalize content. You can choose which cookies to allow.{' '}
                <a href="/cookies" className={styles.link}>
                  Learn more
                </a>
              </p>
            </div>
            <div className={styles.actions}>
              <button
                onClick={handleRejectNonEssential}
                className={styles.rejectButton}
                type="button"
              >
                Reject All
              </button>
              <button
                onClick={handleOpenPreferences}
                className={styles.preferencesButton}
                type="button"
              >
                Manage Preferences
              </button>
              <button
                onClick={handleAcceptAll}
                className={styles.acceptButton}
                type="button"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={handleCloseModal}
          role="presentation"
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-label="Cookie preferences"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Cookie Preferences</h2>
              <button
                onClick={handleCloseModal}
                className={styles.closeButton}
                aria-label="Close"
                type="button"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.modalDescription}>
                We use cookies and similar technologies to help personalize content,
                tailor and measure ads, and provide a better experience. By clicking
                accept, you agree to this as outlined in our{' '}
                <a href="/cookies" className={styles.link}>
                  Cookie Policy
                </a>
                .
              </p>

              <div className={styles.categories}>
                {COOKIE_CATEGORIES.map((category) => (
                  <div key={category.id} className={styles.category}>
                    <div className={styles.categoryHeader}>
                      <div className={styles.categoryInfo}>
                        <h3 className={styles.categoryName}>
                          {category.name}
                          {category.required && (
                            <span className={styles.requiredBadge}>Required</span>
                          )}
                        </h3>
                        <p className={styles.categoryDescription}>
                          {category.description}
                        </p>
                      </div>
                      <label className={styles.toggle}>
                        <input
                          type="checkbox"
                          checked={
                            category.id === 'necessary'
                              ? true
                              : preferences[category.id as keyof CookieConsentPreferences]
                          }
                          onChange={() => {
                            if (category.id !== 'necessary') {
                              handleToggleCategory(
                                category.id as keyof Omit<CookieConsentPreferences, 'necessary'>
                              );
                            }
                          }}
                          disabled={category.required}
                          aria-label={`${category.required ? 'Required' : 'Enable'} ${category.name} cookies`}
                        />
                        <span className={styles.toggleSlider} />
                      </label>
                    </div>

                    {category.cookies.length > 0 && (
                      <details className={styles.cookieDetails}>
                        <summary className={styles.cookieSummary}>
                          View cookies ({category.cookies.length})
                        </summary>
                        <table className={styles.cookieTable}>
                          <thead>
                            <tr>
                              <th>Cookie</th>
                              <th>Provider</th>
                              <th>Purpose</th>
                              <th>Expiry</th>
                            </tr>
                          </thead>
                          <tbody>
                            {category.cookies.map((cookie) => (
                              <tr key={cookie.name}>
                                <td>{cookie.name}</td>
                                <td>{cookie.provider}</td>
                                <td>{cookie.purpose}</td>
                                <td>{cookie.expiry}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={handleRejectNonEssential}
                className={styles.rejectButton}
                type="button"
              >
                Reject All
              </button>
              <button
                onClick={handleSavePreferences}
                className={styles.saveButton}
                type="button"
              >
                Save Preferences
              </button>
              <button
                onClick={handleAcceptAll}
                className={styles.acceptButton}
                type="button"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
