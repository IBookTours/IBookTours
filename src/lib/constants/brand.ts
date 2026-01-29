/**
 * Brand Constants
 *
 * Centralized brand configuration for IBookTours.
 * All brand-related strings should reference this file.
 */

export const BRAND = {
  // Primary brand name
  name: 'IBookTours',
  shortName: 'IBT',

  // Domain configuration
  domain: 'ibooktours.com',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ibooktours.com',

  // Email addresses
  email: {
    support: 'support@ibooktours.com',
    contact: 'contact@ibooktours.com',
    noreply: 'noreply@ibooktours.com',
    bookings: 'bookings@ibooktours.com',
  },

  // Social media handles
  social: {
    facebook: 'ibooktours',
    instagram: 'ibooktours',
    twitter: 'ibooktours',
    linkedin: 'ibooktours',
    youtube: '@ibooktours',
  },

  // Social media URLs
  socialUrls: {
    facebook: 'https://facebook.com/ibooktours',
    instagram: 'https://instagram.com/ibooktours',
    twitter: 'https://twitter.com/ibooktours',
    linkedin: 'https://linkedin.com/company/ibooktours',
    youtube: 'https://youtube.com/@ibooktours',
  },

  // Legal
  copyright: `© ${new Date().getFullYear()} IBookTours. All rights reserved.`,
  companyName: 'IBookTours Ltd.',

  // Contact
  phone: {
    primary: '+355 69 XXX XXXX',
    whatsapp: '+355 69 XXX XXXX',
  },

  // Location
  address: {
    street: 'Rruga e Durresit',
    city: 'Tirana',
    country: 'Albania',
    postalCode: '1001',
    full: 'Rruga e Durresit, Tirana 1001, Albania',
  },
} as const;

/**
 * Storage keys for localStorage/cookies
 * Prefixed with brand name to avoid conflicts
 */
export const STORAGE_KEYS = {
  cookieConsent: 'ibooktours-cookie-consent',
  theme: 'ibooktours-theme',
  locale: 'ibooktours-locale',
  cart: 'ibooktours-cart',
  booking: 'ibooktours-booking',
  recentSearches: 'ibooktours-recent-searches',
} as const;

/**
 * Brand colors (matching SCSS variables)
 * Use CSS variables in components, this is for reference/JS usage
 */
export const BRAND_COLORS = {
  primary: '#2563eb',
  secondary: '#1e40af',
  accent: '#f59e0b',
  background: '#f8fafc',
  text: '#1e293b',
  textLight: '#64748b',
} as const;

/**
 * SEO defaults
 */
export const SEO_DEFAULTS = {
  title: 'IBookTours - Discover Albania & Beyond',
  description: 'Book unforgettable tours and experiences in Albania and the Balkans. Day tours, vacation packages, and custom travel experiences.',
  keywords: ['Albania tours', 'Balkans travel', 'day tours', 'vacation packages', 'travel Albania'],
  ogImage: '/images/og-image.jpg',
} as const;

export type BrandConfig = typeof BRAND;
export type StorageKeys = typeof STORAGE_KEYS;
