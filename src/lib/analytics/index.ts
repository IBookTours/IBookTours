/**
 * Google Analytics 4 Module
 *
 * Provides GDPR-compliant GA4 tracking with:
 * - Consent Mode v2 integration
 * - Enhanced E-commerce tracking
 * - TypeScript support
 *
 * Usage:
 * ```typescript
 * import { trackAddToCart, trackPurchase } from '@/lib/analytics';
 *
 * // Track add to cart
 * trackAddToCart({
 *   currency: 'EUR',
 *   value: 299,
 *   items: [{ item_id: 'tour-1', item_name: 'Tirana Day Tour', ... }]
 * });
 * ```
 */

// Types
export * from './types';

// Core gtag functions
export {
  GA_MEASUREMENT_ID,
  GA_DEBUG,
  isGAConfigured,
  isBrowser,
  hasAnalyticsConsent,
  gtag,
  trackEvent,
  configureGA,
  setDefaultConsent,
  updateConsent,
  grantAnalyticsConsent,
  revokeAnalyticsConsent,
  trackPageView,
  logGAState,
} from './gtag';

// Event tracking functions
export {
  // Helpers
  toGA4Item,
  toGA4Items,
  calculateValue,
  // E-commerce
  trackViewItemList,
  trackViewItem,
  trackSelectItem,
  trackAddToCart,
  trackRemoveFromCart,
  trackViewCart,
  trackBeginCheckout,
  trackAddShippingInfo,
  trackAddPaymentInfo,
  trackPurchase,
  // Discovery
  trackSearch,
  trackGenerateLead,
  trackLogin,
  trackSignUp,
  // Content
  trackViewContent,
  // Custom
  trackFilterApplied,
  trackShare,
  // Convenience
  trackTourView,
  trackTourAddToCart,
  trackTourRemoveFromCart,
} from './events';
