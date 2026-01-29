/**
 * GDPR-Compliant Cookie Consent Types
 *
 * Defines the structure for granular cookie consent management.
 */

/**
 * Cookie consent categories
 * - necessary: Always required, cannot be disabled (site functionality)
 * - analytics: Track site usage, performance metrics (e.g., Google Analytics)
 * - marketing: Advertising, retargeting, personalization
 * - preferences: User settings, language, theme persistence
 */
export interface CookieConsentPreferences {
  necessary: true; // Always required, enforced as true
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

/**
 * Full cookie consent state stored in localStorage
 */
export interface CookieConsentState {
  /** User's consent preferences by category */
  preferences: CookieConsentPreferences;
  /** Unix timestamp when consent was given */
  timestamp: number;
  /** Version of consent format (for future migrations) */
  version: string;
}

/**
 * Category information for display in UI
 */
export interface CookieCategoryInfo {
  id: keyof Omit<CookieConsentPreferences, 'necessary'> | 'necessary';
  name: string;
  description: string;
  required: boolean;
  cookies: CookieInfo[];
}

/**
 * Individual cookie information
 */
export interface CookieInfo {
  name: string;
  provider: string;
  purpose: string;
  expiry: string;
}

/**
 * Current consent version
 * Increment this when consent structure changes to re-prompt users
 */
export const CONSENT_VERSION = '1.0.0';

/**
 * Cookie category definitions with details
 */
export const COOKIE_CATEGORIES: CookieCategoryInfo[] = [
  {
    id: 'necessary',
    name: 'Essential',
    description:
      'These cookies are required for the website to function properly. They enable core features like security, session management, and accessibility.',
    required: true,
    cookies: [
      {
        name: 'next-auth.session-token',
        provider: 'IBookTours',
        purpose: 'Maintains user login session',
        expiry: '24 hours',
      },
      {
        name: 'ibooktours-cookie-consent',
        provider: 'IBookTours',
        purpose: 'Stores your cookie preferences',
        expiry: '1 year',
      },
      {
        name: '__stripe_mid',
        provider: 'Stripe',
        purpose: 'Fraud prevention during payments',
        expiry: '1 year',
      },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description:
      'These cookies help us understand how visitors interact with our website. All data is anonymized and used to improve our services.',
    required: false,
    cookies: [
      {
        name: '_ga',
        provider: 'Google Analytics',
        purpose: 'Distinguishes unique users',
        expiry: '2 years',
      },
      {
        name: '_ga_*',
        provider: 'Google Analytics',
        purpose: 'Maintains session state',
        expiry: '2 years',
      },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description:
      'These cookies are used to deliver advertisements more relevant to you and your interests. They may also be used to limit the number of times you see an advertisement.',
    required: false,
    cookies: [
      {
        name: '_fbp',
        provider: 'Facebook',
        purpose: 'Tracks visits for ad targeting',
        expiry: '3 months',
      },
      {
        name: '_gcl_au',
        provider: 'Google Ads',
        purpose: 'Conversion tracking',
        expiry: '3 months',
      },
    ],
  },
  {
    id: 'preferences',
    name: 'Preferences',
    description:
      'These cookies allow the website to remember choices you make (such as language or theme) and provide enhanced features.',
    required: false,
    cookies: [
      {
        name: 'ibooktours-theme',
        provider: 'IBookTours',
        purpose: 'Remembers your theme preference',
        expiry: '1 year',
      },
      {
        name: 'ibooktours-locale',
        provider: 'IBookTours',
        purpose: 'Remembers your language preference',
        expiry: '1 year',
      },
    ],
  },
];

/**
 * Default consent state (all optional categories disabled)
 */
export const DEFAULT_CONSENT: CookieConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

/**
 * Accept all consent state
 */
export const ACCEPT_ALL_CONSENT: CookieConsentPreferences = {
  necessary: true,
  analytics: true,
  marketing: true,
  preferences: true,
};
