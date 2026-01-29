/**
 * Tour Availability Types
 *
 * Types for managing per-tour availability, capacity, and booking slots.
 */

/**
 * Availability status for a specific date
 */
export type AvailabilityStatus = 'available' | 'limited' | 'full' | 'blocked';

/**
 * Tour type classification
 */
export type TourType = 'day-tour' | 'vacation-package';

/**
 * Availability for a specific date
 */
export interface AvailabilityDate {
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Total capacity for this date (-1 = unlimited) */
  capacity: number;
  /** Number of guests already booked */
  booked: number;
  /** Computed availability status */
  status: AvailabilityStatus;
  /** Admin notes for this date */
  notes?: string;
  /** Price override for this date (if different from default) */
  priceOverride?: number;
}

/**
 * Tour availability configuration
 */
export interface TourAvailability {
  /** Tour identifier */
  tourId: string;
  /** Tour type */
  tourType: TourType;
  /** Default capacity per date (-1 = unlimited) */
  defaultCapacity: number;
  /** Minimum advance booking days */
  minAdvanceDays: number;
  /** Maximum advance booking days */
  maxAdvanceDays: number;
  /** Dates with specific availability settings */
  dates: Record<string, AvailabilityDate>;
  /** Last updated timestamp */
  lastUpdated: string;
}

/**
 * Booking slot reservation
 */
export interface BookingSlot {
  /** Unique slot identifier */
  id: string;
  /** Tour identifier */
  tourId: string;
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Number of guests in this booking */
  guestCount: number;
  /** Associated booking/order ID */
  bookingId: string;
  /** Customer email */
  customerEmail: string;
  /** Reservation status */
  status: 'pending' | 'confirmed' | 'cancelled';
  /** When the slot was reserved */
  createdAt: string;
  /** When the slot expires if not confirmed */
  expiresAt?: string;
}

/**
 * Availability check result
 */
export interface AvailabilityCheckResult {
  /** Whether the date is available for the requested guests */
  available: boolean;
  /** Remaining slots (null if unlimited) */
  remainingSlots: number | null;
  /** Status of the date */
  status: AvailabilityStatus;
  /** Reason if not available */
  reason?: string;
}

/**
 * Monthly availability summary
 */
export interface MonthlyAvailability {
  /** Year */
  year: number;
  /** Month (1-12) */
  month: number;
  /** Days with availability info */
  days: AvailabilityDate[];
}

/**
 * Default capacities by tour type
 */
export const DEFAULT_CAPACITIES: Record<TourType, number> = {
  'day-tour': 1,           // Single slot by default
  'vacation-package': -1,   // Unlimited by default
};

/**
 * Default booking windows
 */
export const BOOKING_WINDOWS = {
  minAdvanceDays: 1,       // Must book at least 1 day ahead
  maxAdvanceDays: 365,     // Can book up to 1 year ahead
};
