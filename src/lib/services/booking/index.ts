/**
 * Booking Service Factory
 *
 * Provides booking service instances based on configuration.
 * Uses DatabaseBookingProvider when DATABASE_URL is configured,
 * falls back to MockBookingProvider for development/demo mode.
 *
 * Usage:
 * ```typescript
 * import { getBookingService } from '@/lib/services/booking';
 *
 * const bookingService = getBookingService();
 * const booking = await bookingService.createBooking({
 *   tourId: 'tour-123',
 *   tourName: 'Berat Day Tour',
 *   totalAmount: 5000,
 *   bookerName: 'John Doe',
 *   bookerEmail: 'john@example.com',
 * });
 * ```
 */

import { createLogger } from '@/lib/logger';
import { isDatabaseConfigured } from '@/lib/db';
import { DatabaseBookingProvider } from './DatabaseBookingProvider';
import { MockBookingProvider } from './MockBookingProvider';
import type { IBookingService } from './BookingService';

// Types
export type {
  IBookingService,
  CreateBookingParams,
  UpdateBookingParams,
  BookingStatus,
  PaymentStatus,
} from './BookingService';

// Providers (for direct use if needed)
export { DatabaseBookingProvider } from './DatabaseBookingProvider';
export { MockBookingProvider } from './MockBookingProvider';

const logger = createLogger('BookingServiceFactory');

/**
 * Booking service singleton
 */
let bookingServiceInstance: IBookingService | null = null;

/**
 * Create booking service based on configuration
 */
function createBookingService(): IBookingService {
  if (isDatabaseConfigured()) {
    logger.info('Creating database booking service');
    return new DatabaseBookingProvider();
  }

  logger.info('Creating mock booking service (DATABASE_URL not configured)');
  return new MockBookingProvider();
}

/**
 * Get the configured booking service
 *
 * This is the primary way to access booking functionality.
 * The provider is determined by DATABASE_URL configuration.
 */
export function getBookingService(): IBookingService {
  if (!bookingServiceInstance) {
    bookingServiceInstance = createBookingService();
    logger.info('Booking service initialized', {
      provider: bookingServiceInstance.getProviderName(),
    });
  }
  return bookingServiceInstance;
}

/**
 * Reset booking service (for testing)
 */
export function resetBookingService(): void {
  bookingServiceInstance = null;
}

/**
 * Default booking service instance (for backward compatibility)
 *
 * Prefer using getBookingService() for explicit initialization.
 */
export const bookingService = getBookingService();
