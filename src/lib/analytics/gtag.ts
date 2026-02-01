/**
 * Google Analytics 4 - Consent-Aware gtag Wrapper
 *
 * All gtag calls go through this wrapper to ensure:
 * 1. We're in a browser environment
 * 2. User has granted analytics consent
 * 3. GA Measurement ID is configured
 */

import { hasConsentFor } from '@/lib/cookies';
import type { ConsentModeParams } from './types';

// ============================================
// CONFIGURATION
// ============================================

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
export const GA_DEBUG = process.env.NEXT_PUBLIC_GA_DEBUG === 'true';

/**
 * Check if Google Analytics is properly configured
 */
export function isGAConfigured(): boolean {
  return Boolean(GA_MEASUREMENT_ID && GA_MEASUREMENT_ID.startsWith('G-'));
}

/**
 * Check if we're in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if user has granted analytics consent
 */
export function hasAnalyticsConsent(): boolean {
  return hasConsentFor('analytics');
}

// ============================================
// GTAG WRAPPER FUNCTIONS
// ============================================

/**
 * Safe gtag call that respects consent
 * Only executes if:
 * - In browser
 * - GA is configured
 * - User has granted analytics consent (or it's a consent update)
 */
export function gtag(
  command: 'config' | 'event' | 'consent' | 'set' | 'js',
  targetOrAction: string | Date,
  params?: Record<string, unknown>
): void {
  if (!isBrowser()) return;
  if (!isGAConfigured()) return;

  // Allow consent commands without consent check (they manage consent state)
  if (command !== 'consent' && !hasAnalyticsConsent()) {
    if (GA_DEBUG) {
      console.debug('[GA4] Blocked - no analytics consent:', command, targetOrAction);
    }
    return;
  }

  // Ensure gtag exists
  if (typeof window.gtag !== 'function') {
    if (GA_DEBUG) {
      console.debug('[GA4] gtag not loaded yet:', command, targetOrAction);
    }
    return;
  }

  // Execute gtag call
  if (GA_DEBUG) {
    console.debug('[GA4]', command, targetOrAction, params);
  }

  window.gtag(command, targetOrAction, params);
}

/**
 * Track a GA4 event
 */
export function trackEvent(
  eventName: string,
  params: Record<string, unknown> = {}
): void {
  gtag('event', eventName, params);
}

/**
 * Configure GA4 with measurement ID
 */
export function configureGA(params: Record<string, unknown> = {}): void {
  if (!isGAConfigured()) return;

  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // We'll track page views manually for SPA
    debug_mode: GA_DEBUG,
    ...params,
  });
}

// ============================================
// CONSENT MODE v2
// ============================================

/**
 * Set default consent state (before user decision)
 * Call this on initial page load
 */
export function setDefaultConsent(): void {
  if (!isBrowser() || !isGAConfigured()) return;

  // Initialize dataLayer if needed
  window.dataLayer = window.dataLayer || [];

  // Default to denied (GDPR compliant)
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500, // Wait 500ms for consent UI
  });

  if (GA_DEBUG) {
    console.debug('[GA4] Default consent set to denied');
  }
}

/**
 * Update consent state after user decision
 */
export function updateConsent(params: ConsentModeParams): void {
  if (!isBrowser() || !isGAConfigured()) return;

  gtag('consent', 'update', params);

  if (GA_DEBUG) {
    console.debug('[GA4] Consent updated:', params);
  }
}

/**
 * Grant analytics consent
 * Called when user accepts analytics cookies
 */
export function grantAnalyticsConsent(): void {
  updateConsent({
    analytics_storage: 'granted',
  });
}

/**
 * Revoke analytics consent
 * Called when user rejects or revokes analytics cookies
 */
export function revokeAnalyticsConsent(): void {
  updateConsent({
    analytics_storage: 'denied',
  });
}

// ============================================
// PAGE VIEW TRACKING (for SPA)
// ============================================

/**
 * Track a page view
 * Call this on route changes in Next.js
 */
export function trackPageView(url: string, title?: string): void {
  trackEvent('page_view', {
    page_location: url,
    page_title: title || document.title,
  });
}

// ============================================
// DEBUG UTILITIES
// ============================================

/**
 * Log current GA4 state (for debugging)
 */
export function logGAState(): void {
  if (!GA_DEBUG) return;

  console.group('[GA4] State');
  console.log('Configured:', isGAConfigured());
  console.log('Measurement ID:', GA_MEASUREMENT_ID);
  console.log('Has Consent:', hasAnalyticsConsent());
  console.log('Debug Mode:', GA_DEBUG);
  console.log('DataLayer:', window.dataLayer);
  console.groupEnd();
}
