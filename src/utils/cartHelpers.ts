// ============================================
// CART HELPER UTILITIES
// ============================================
// Centralized cart item creation and manipulation
// Eliminates duplicate handleAddToCart logic across components

import { CartItem } from '@/store/cartStore';
import { VacationPackage } from '@/components/VacationPackagesSection/VacationPackagesSection';
import { DayTour } from '@/components/DayToursSection/DayToursSection';
import { priceStringToCents } from '@/store/bookingStore';

// Type for adding items to cart (before cartItemId and addedAt are generated)
export type CartItemInput = Omit<CartItem, 'cartItemId' | 'addedAt'>;

// ============================================
// TYPES
// ============================================

export type ProductType = 'vacation-package' | 'day-tour';

export interface CartItemOptions {
  /** Number of adults (default: 1) */
  adults?: number;
  /** Number of children (default: 0) */
  children?: number;
  /** Travel date (default: empty) */
  date?: string;
  /** Quantity (default: 1) */
  quantity?: number;
}

// ============================================
// FACTORY FUNCTIONS
// ============================================

/**
 * Create a cart item from a Vacation Package
 * Standardizes the conversion with consistent field mapping
 */
export function createCartItemFromPackage(
  pkg: VacationPackage,
  options: CartItemOptions = {}
): CartItemInput {
  const { adults = 1, children = 0, date = '', quantity = 1 } = options;

  return {
    id: pkg.id,
    type: 'vacation-package' as const,
    name: `${pkg.destination} - ${pkg.hotelName}`,
    image: pkg.image,
    duration: pkg.duration,
    location: pkg.location,
    basePrice: priceStringToCents(pkg.pricePerPerson),
    quantity,
    date,
    travelers: { adults, children },
    childDiscountPercent: 30, // Standard package discount
    options: {
      hotelName: pkg.hotelName,
      includesFlights: pkg.includesFlights,
    },
  };
}

/**
 * Create a cart item from a Day Tour
 * Standardizes the conversion with consistent field mapping
 */
export function createCartItemFromTour(
  tour: DayTour,
  options: CartItemOptions = {}
): CartItemInput {
  const { adults = 1, children = 0, date = '', quantity = 1 } = options;

  return {
    id: tour.id,
    type: 'day-tour' as const,
    name: tour.name,
    image: tour.image,
    duration: tour.duration,
    location: tour.location,
    basePrice: priceStringToCents(tour.pricePerPerson),
    quantity,
    date,
    travelers: { adults, children },
    childDiscountPercent: 50, // Standard tour discount (50% for kids)
  };
}

/**
 * Generic factory that works with either product type
 * Uses discriminated union for type safety
 */
export function createCartItem(
  product: VacationPackage | DayTour,
  type: ProductType,
  options: CartItemOptions = {}
): CartItemInput {
  if (type === 'vacation-package') {
    return createCartItemFromPackage(product as VacationPackage, options);
  }
  return createCartItemFromTour(product as DayTour, options);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if a product is a vacation package
 */
export function isVacationPackage(product: VacationPackage | DayTour): product is VacationPackage {
  return 'hotelName' in product && 'includesFlights' in product;
}

/**
 * Check if a product is a day tour
 */
export function isDayTour(product: VacationPackage | DayTour): product is DayTour {
  return 'groupSize' in product && 'departsFrom' in product;
}

/**
 * Auto-detect product type and create cart item
 */
export function createCartItemAuto(
  product: VacationPackage | DayTour,
  options: CartItemOptions = {}
): CartItemInput {
  if (isVacationPackage(product)) {
    return createCartItemFromPackage(product, options);
  }
  return createCartItemFromTour(product, options);
}

// ============================================
// PRICE FORMATTING
// ============================================

/**
 * Format cents as display price (e.g., 29900 -> "€299")
 */
export function formatPrice(cents: number, currency = '€'): string {
  const amount = cents / 100;
  return `${currency}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Calculate total price for travelers
 */
export function calculateTotalPrice(
  basePrice: number,
  adults: number,
  children: number,
  childDiscountPercent: number
): number {
  const adultTotal = basePrice * adults;
  const childPrice = basePrice * (1 - childDiscountPercent / 100);
  const childTotal = childPrice * children;
  return Math.round(adultTotal + childTotal);
}

/**
 * Get price breakdown for cart item
 */
export function getCartItemPriceBreakdown(item: {
  basePrice: number;
  travelers: { adults: number; children: number };
  childDiscountPercent: number;
}): {
  adultPrice: number;
  childPrice: number;
  adultTotal: number;
  childTotal: number;
  total: number;
} {
  const { basePrice, travelers, childDiscountPercent } = item;
  const adultPrice = basePrice;
  const childPrice = Math.round(basePrice * (1 - childDiscountPercent / 100));
  const adultTotal = adultPrice * travelers.adults;
  const childTotal = childPrice * travelers.children;
  const total = adultTotal + childTotal;

  return {
    adultPrice,
    childPrice,
    adultTotal,
    childTotal,
    total,
  };
}
