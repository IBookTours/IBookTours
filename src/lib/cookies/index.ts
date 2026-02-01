/**
 * GDPR-Compliant Cookie Consent Utilities
 *
 * Provides functions to manage cookie consent preferences
 * with versioning and granular category control.
 */

import {
  CookieConsentState,
  CookieConsentPreferences,
  CONSENT_VERSION,
  DEFAULT_CONSENT,
  ACCEPT_ALL_CONSENT,
} from './types';

// Re-export types
export * from './types';

/** Storage key for cookie consent */
const STORAGE_KEY = 'ibooktours-cookie-consent';

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Get the current cookie consent state from localStorage
 * Returns null if no consent has been given or version mismatch
 */
export function getCookieConsent(): CookieConsentState | null {
  if (!isBrowser) return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const state: CookieConsentState = JSON.parse(stored);

    // Check version - if different, consent needs to be re-obtained
    if (state.version !== CONSENT_VERSION) {
      return null;
    }

    // Validate structure
    if (
      typeof state.preferences?.necessary !== 'boolean' ||
      typeof state.preferences?.analytics !== 'boolean' ||
      typeof state.preferences?.marketing !== 'boolean' ||
      typeof state.preferences?.preferences !== 'boolean'
    ) {
      return null;
    }

    return state;
  } catch {
    return null;
  }
}

/**
 * Save cookie consent preferences to localStorage
 */
export function setCookieConsent(preferences: CookieConsentPreferences): void {
  if (!isBrowser) return;

  const state: CookieConsentState = {
    preferences: {
      ...preferences,
      necessary: true, // Always enforce necessary as true
    },
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  // Dispatch event for other parts of the app to react
  window.dispatchEvent(
    new CustomEvent('cookieConsentChanged', { detail: state })
  );
}

/**
 * Accept all cookie categories
 */
export function acceptAllCookies(): void {
  setCookieConsent(ACCEPT_ALL_CONSENT);
}

/**
 * Reject all non-essential cookies
 */
export function rejectNonEssentialCookies(): void {
  setCookieConsent(DEFAULT_CONSENT);
}

/**
 * Check if consent has been given for a specific category
 */
export function hasConsentFor(
  category: keyof CookieConsentPreferences
): boolean {
  if (category === 'necessary') return true;

  const consent = getCookieConsent();
  if (!consent) return false;

  return consent.preferences[category] === true;
}

/**
 * Check if any consent decision has been made
 */
export function hasConsentDecision(): boolean {
  return getCookieConsent() !== null;
}

/**
 * Get the timestamp of when consent was given
 */
export function getConsentTimestamp(): number | null {
  const consent = getCookieConsent();
  return consent?.timestamp ?? null;
}

/**
 * Clear all cookie consent data
 * Useful for allowing users to reset their preferences
 */
export function clearCookieConsent(): void {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('cookieConsentCleared'));
}

/**
 * Hook to listen for consent changes
 * Use in React components to react to consent updates
 */
export function onConsentChange(
  callback: (state: CookieConsentState) => void
): () => void {
  if (!isBrowser) return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<CookieConsentState>;
    callback(customEvent.detail);
  };

  window.addEventListener('cookieConsentChanged', handler);
  return () => window.removeEventListener('cookieConsentChanged', handler);
}

/**
 * Initialize analytics scripts if consent is given
 * Call this on app load to conditionally load tracking
 */
export function initializeConditionalScripts(): void {
  if (!isBrowser) return;

  const consent = getCookieConsent();
  if (!consent) return;

  // Analytics (Google Analytics)
  if (consent.preferences.analytics) {
    initializeAnalytics();
  }

  // Marketing (Facebook Pixel, etc.)
  if (consent.preferences.marketing) {
    initializeMarketing();
  }
}

/**
 * Initialize Google Analytics
 * Only called when analytics consent is given
 *
 * Note: The actual GA4 initialization is handled by AnalyticsProvider.
 * This function is called for logging/debugging purposes.
 */
function initializeAnalytics(): void {
  // GA4 is initialized by AnalyticsProvider component which:
  // 1. Sets up Consent Mode v2
  // 2. Loads GoogleAnalytics from @next/third-parties
  // 3. Listens for consent changes via cookieConsentChanged event

  if (process.env.NODE_ENV === 'development') {
    console.debug('[Cookies] Analytics consent granted - GA4 will be loaded by AnalyticsProvider');
  }
}

/**
 * Initialize marketing/advertising scripts
 * Only called when marketing consent is given
 */
function initializeMarketing(): void {
  // Marketing scripts initialization
  // This is a placeholder - implement actual marketing pixel initialization
  if (process.env.NODE_ENV === 'development') {
    console.debug('[Cookies] Marketing scripts initialized');
  }
}
