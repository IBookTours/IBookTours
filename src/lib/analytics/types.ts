/**
 * Google Analytics 4 Type Definitions
 *
 * Standard GA4 event parameters for Enhanced E-commerce tracking.
 * All prices should be in currency units (EUR), NOT cents.
 */

// ============================================
// GA4 ITEM (Product) Structure
// ============================================

export interface GA4Item {
  item_id: string;
  item_name: string;
  item_category: 'vacation-package' | 'day-tour' | 'night-tour' | 'cruise' | 'event';
  item_category2?: string; // Location (e.g., 'Tirana', 'Saranda')
  item_category3?: string; // Sub-category (e.g., 'cultural', 'adventure')
  price: number; // In currency units (EUR), NOT cents
  quantity: number;
  currency?: string; // Default: 'EUR'
  item_brand?: string; // 'IBookTours'
  item_variant?: string; // e.g., 'with-flights', 'hotel-only'
  index?: number; // Position in list
}

// ============================================
// E-COMMERCE EVENTS
// ============================================

export interface ViewItemListParams {
  item_list_id: string;
  item_list_name: string;
  items: GA4Item[];
}

export interface ViewItemParams {
  currency: string;
  value: number;
  items: GA4Item[];
}

export interface SelectItemParams {
  item_list_id?: string;
  item_list_name?: string;
  items: GA4Item[];
}

export interface AddToCartParams {
  currency: string;
  value: number;
  items: GA4Item[];
}

export interface RemoveFromCartParams {
  currency: string;
  value: number;
  items: GA4Item[];
}

export interface ViewCartParams {
  currency: string;
  value: number;
  items: GA4Item[];
}

export interface BeginCheckoutParams {
  currency: string;
  value: number;
  items: GA4Item[];
  coupon?: string;
}

export interface AddShippingInfoParams {
  currency: string;
  value: number;
  items: GA4Item[];
  shipping_tier?: string;
}

export interface AddPaymentInfoParams {
  currency: string;
  value: number;
  items: GA4Item[];
  payment_type: string; // 'card', 'stripe'
}

export interface PurchaseParams {
  transaction_id: string;
  value: number;
  currency: string;
  items: GA4Item[];
  tax?: number;
  shipping?: number;
  coupon?: string;
}

// ============================================
// DISCOVERY / ENGAGEMENT EVENTS
// ============================================

export interface SearchParams {
  search_term: string;
}

export interface GenerateLeadParams {
  value?: number;
  currency?: string;
  form_name: string; // 'contact', 'newsletter', 'booking_inquiry'
}

export interface LoginParams {
  method: 'credentials' | 'google';
}

export interface SignUpParams {
  method: 'credentials' | 'google';
}

// ============================================
// CONTENT TRACKING
// ============================================

export interface ViewContentParams {
  content_type: 'blog_post' | 'destination' | 'faq' | 'page';
  content_id: string;
  content_group?: string; // Category
}

// ============================================
// CUSTOM EVENTS (use sparingly for free tier)
// ============================================

export interface FilterAppliedParams {
  filter_type: 'price' | 'category' | 'location' | 'duration';
  filter_value: string;
}

export interface ShareParams {
  method: string; // 'facebook', 'twitter', 'email', 'copy_link'
  content_type: string;
  item_id: string;
}

// ============================================
// CONSENT MODE
// ============================================

export interface ConsentModeParams {
  analytics_storage: 'granted' | 'denied';
  ad_storage?: 'granted' | 'denied';
  ad_user_data?: 'granted' | 'denied';
  ad_personalization?: 'granted' | 'denied';
  wait_for_update?: number;
  [key: string]: string | number | undefined; // Index signature for Record compatibility
}

// ============================================
// GTAG TYPE DECLARATIONS
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GtagFunction = (...args: any[]) => void;

declare global {
  interface Window {
    gtag?: GtagFunction;
    dataLayer?: unknown[];
  }
}
