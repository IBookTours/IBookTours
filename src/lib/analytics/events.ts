/**
 * Google Analytics 4 - Event Tracking Functions
 *
 * Provides typed helper functions for all tracked events.
 * All functions are safe to call - they check consent internally.
 */

import { trackEvent } from './gtag';
import type {
  GA4Item,
  ViewItemListParams,
  ViewItemParams,
  SelectItemParams,
  AddToCartParams,
  RemoveFromCartParams,
  ViewCartParams,
  BeginCheckoutParams,
  AddShippingInfoParams,
  AddPaymentInfoParams,
  PurchaseParams,
  SearchParams,
  GenerateLeadParams,
  LoginParams,
  SignUpParams,
  ViewContentParams,
  FilterAppliedParams,
} from './types';

// ============================================
// HELPER: Convert cart item to GA4 item
// ============================================

interface CartItemLike {
  id: string;
  name: string;
  type?: string;
  location?: string;
  basePrice: number; // In cents
  quantity?: number;
  travelers?: { adults: number; children: number };
}

/**
 * Convert a cart item to GA4 item format
 * Handles price conversion from cents to currency units
 */
export function toGA4Item(
  item: CartItemLike,
  index?: number
): GA4Item {
  const quantity = item.travelers
    ? item.travelers.adults + item.travelers.children
    : item.quantity || 1;

  return {
    item_id: item.id,
    item_name: item.name,
    item_category: (item.type as GA4Item['item_category']) || 'day-tour',
    item_category2: item.location,
    price: item.basePrice / 100, // Convert cents to EUR
    quantity,
    currency: 'EUR',
    item_brand: 'IBookTours',
    index,
  };
}

/**
 * Convert multiple cart items to GA4 items
 */
export function toGA4Items(items: CartItemLike[]): GA4Item[] {
  return items.map((item, index) => toGA4Item(item, index));
}

/**
 * Calculate total value from GA4 items
 */
export function calculateValue(items: GA4Item[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// ============================================
// E-COMMERCE EVENTS
// ============================================

/**
 * Track when user views a list of tours
 */
export function trackViewItemList(params: ViewItemListParams): void {
  trackEvent('view_item_list', {
    item_list_id: params.item_list_id,
    item_list_name: params.item_list_name,
    items: params.items,
  });
}

/**
 * Track when user views a tour detail page
 */
export function trackViewItem(params: ViewItemParams): void {
  trackEvent('view_item', {
    currency: params.currency || 'EUR',
    value: params.value,
    items: params.items,
  });
}

/**
 * Track when user clicks on a tour from a list
 */
export function trackSelectItem(params: SelectItemParams): void {
  trackEvent('select_item', {
    item_list_id: params.item_list_id,
    item_list_name: params.item_list_name,
    items: params.items,
  });
}

/**
 * Track when user adds a tour to cart
 */
export function trackAddToCart(params: AddToCartParams): void {
  trackEvent('add_to_cart', {
    currency: params.currency || 'EUR',
    value: params.value,
    items: params.items,
  });
}

/**
 * Track when user removes a tour from cart
 */
export function trackRemoveFromCart(params: RemoveFromCartParams): void {
  trackEvent('remove_from_cart', {
    currency: params.currency || 'EUR',
    value: params.value,
    items: params.items,
  });
}

/**
 * Track when user views their cart
 */
export function trackViewCart(params: ViewCartParams): void {
  trackEvent('view_cart', {
    currency: params.currency || 'EUR',
    value: params.value,
    items: params.items,
  });
}

/**
 * Track when user begins checkout
 */
export function trackBeginCheckout(params: BeginCheckoutParams): void {
  trackEvent('begin_checkout', {
    currency: params.currency || 'EUR',
    value: params.value,
    items: params.items,
    coupon: params.coupon,
  });
}

/**
 * Track when user completes traveler details (checkout step 2)
 */
export function trackAddShippingInfo(params: AddShippingInfoParams): void {
  trackEvent('add_shipping_info', {
    currency: params.currency || 'EUR',
    value: params.value,
    items: params.items,
    shipping_tier: params.shipping_tier || 'tour_booking',
  });
}

/**
 * Track when user enters payment info (checkout step 4)
 */
export function trackAddPaymentInfo(params: AddPaymentInfoParams): void {
  trackEvent('add_payment_info', {
    currency: params.currency || 'EUR',
    value: params.value,
    items: params.items,
    payment_type: params.payment_type,
  });
}

/**
 * Track successful purchase
 */
export function trackPurchase(params: PurchaseParams): void {
  trackEvent('purchase', {
    transaction_id: params.transaction_id,
    value: params.value,
    currency: params.currency || 'EUR',
    items: params.items,
    tax: params.tax,
    shipping: params.shipping,
    coupon: params.coupon,
  });
}

// ============================================
// DISCOVERY / ENGAGEMENT EVENTS
// ============================================

/**
 * Track search queries
 */
export function trackSearch(params: SearchParams): void {
  if (!params.search_term || params.search_term.trim().length < 2) return;

  trackEvent('search', {
    search_term: params.search_term.trim(),
  });
}

/**
 * Track lead generation (contact form, newsletter)
 */
export function trackGenerateLead(params: GenerateLeadParams): void {
  trackEvent('generate_lead', {
    value: params.value,
    currency: params.currency || 'EUR',
    form_name: params.form_name,
  });
}

/**
 * Track user login
 */
export function trackLogin(params: LoginParams): void {
  trackEvent('login', {
    method: params.method,
  });
}

/**
 * Track user sign up
 */
export function trackSignUp(params: SignUpParams): void {
  trackEvent('sign_up', {
    method: params.method,
  });
}

// ============================================
// CONTENT TRACKING
// ============================================

/**
 * Track content view (blog posts, destinations)
 */
export function trackViewContent(params: ViewContentParams): void {
  trackEvent('view_item', {
    content_type: params.content_type,
    items: [
      {
        item_id: params.content_id,
        item_name: params.content_id,
        item_category: params.content_type,
        item_category2: params.content_group,
        price: 0,
        quantity: 1,
      },
    ],
  });
}

// ============================================
// CUSTOM EVENTS (use sparingly)
// ============================================

/**
 * Track filter usage
 */
export function trackFilterApplied(params: FilterAppliedParams): void {
  trackEvent('filter_applied', {
    filter_type: params.filter_type,
    filter_value: params.filter_value,
  });
}

/**
 * Track social share
 */
export function trackShare(method: string, contentType: string, itemId: string): void {
  trackEvent('share', {
    method,
    content_type: contentType,
    item_id: itemId,
  });
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Track a simple tour view from cart item data
 */
export function trackTourView(item: CartItemLike): void {
  const ga4Item = toGA4Item(item);
  trackViewItem({
    currency: 'EUR',
    value: ga4Item.price,
    items: [ga4Item],
  });
}

/**
 * Track adding a tour to cart from cart item data
 */
export function trackTourAddToCart(item: CartItemLike): void {
  const ga4Item = toGA4Item(item);
  trackAddToCart({
    currency: 'EUR',
    value: ga4Item.price * ga4Item.quantity,
    items: [ga4Item],
  });
}

/**
 * Track removing a tour from cart
 */
export function trackTourRemoveFromCart(item: CartItemLike): void {
  const ga4Item = toGA4Item(item);
  trackRemoveFromCart({
    currency: 'EUR',
    value: ga4Item.price * ga4Item.quantity,
    items: [ga4Item],
  });
}
