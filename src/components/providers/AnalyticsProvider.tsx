'use client';

/**
 * Analytics Provider Component
 *
 * Handles Google Analytics 4 initialization with GDPR-compliant consent management.
 * Only loads GA4 scripts after user grants analytics consent.
 *
 * Features:
 * - Consent Mode v2 integration
 * - Automatic page view tracking for SPA navigation
 * - Listens for consent changes from cookie consent banner
 */

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';
import {
  GA_MEASUREMENT_ID,
  isGAConfigured,
  setDefaultConsent,
  grantAnalyticsConsent,
  revokeAnalyticsConsent,
  configureGA,
  trackPageView,
  GA_DEBUG,
} from '@/lib/analytics';
import { hasConsentFor, getCookieConsent } from '@/lib/cookies';

export default function AnalyticsProvider() {
  const [hasConsent, setHasConsent] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Check initial consent state
  useEffect(() => {
    if (!isGAConfigured()) {
      if (GA_DEBUG) {
        console.debug('[AnalyticsProvider] GA not configured - skipping');
      }
      return;
    }

    // Set default consent mode (denied until user decides)
    setDefaultConsent();

    // Check if user already gave consent
    const consent = getCookieConsent();
    if (consent?.preferences.analytics) {
      setHasConsent(true);
      grantAnalyticsConsent();
    }

    setIsInitialized(true);
  }, []);

  // Listen for consent changes
  const handleConsentChange = useCallback((event: Event) => {
    const customEvent = event as CustomEvent;
    const newConsent = customEvent.detail?.preferences?.analytics;

    if (GA_DEBUG) {
      console.debug('[AnalyticsProvider] Consent changed:', newConsent);
    }

    if (newConsent) {
      setHasConsent(true);
      grantAnalyticsConsent();
    } else {
      setHasConsent(false);
      revokeAnalyticsConsent();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('cookieConsentChanged', handleConsentChange);
    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange);
    };
  }, [handleConsentChange]);

  // Configure GA4 when consent is granted
  useEffect(() => {
    if (hasConsent && isInitialized) {
      configureGA({
        anonymize_ip: true,
        cookie_flags: 'SameSite=Lax;Secure',
      });
    }
  }, [hasConsent, isInitialized]);

  // Track page views on route change (SPA navigation)
  useEffect(() => {
    if (!hasConsent || !isInitialized) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(url);

    if (GA_DEBUG) {
      console.debug('[AnalyticsProvider] Page view:', url);
    }
  }, [pathname, searchParams, hasConsent, isInitialized]);

  // Don't render anything if GA is not configured
  if (!isGAConfigured()) {
    return null;
  }

  // Render GoogleAnalytics component only when consent is granted
  // The component handles script loading optimally
  return hasConsent ? (
    <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
  ) : null;
}
