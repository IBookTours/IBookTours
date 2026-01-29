/**
 * Booking Service - Interface & Types
 *
 * Provides booking management operations including:
 * - Creating bookings
 * - Updating booking status
 * - Finding bookings by various criteria
 */

import type { Booking, NewBooking } from '@/lib/db/schema';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface CreateBookingParams {
  userId?: string;
  tourId: string;
  tourName: string;
  totalAmount: number; // in cents
  currency?: string;
  travelers?: number;
  selectedDate?: Date;
  bookerName: string;
  bookerEmail: string;
  bookerPhone?: string;
  specialRequests?: string;
}

export interface UpdateBookingParams {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  paymentIntentId?: string;
}

export interface IBookingService {
  /**
   * Create a new booking
   */
  createBooking(params: CreateBookingParams): Promise<Booking>;

  /**
   * Find a booking by ID
   */
  findById(id: string): Promise<Booking | null>;

  /**
   * Find a booking by payment intent ID
   */
  findByPaymentIntentId(paymentIntentId: string): Promise<Booking | null>;

  /**
   * Find all bookings for a user
   */
  findByUserId(userId: string): Promise<Booking[]>;

  /**
   * Update a booking
   */
  updateBooking(id: string, params: UpdateBookingParams): Promise<Booking>;

  /**
   * Update booking payment status
   */
  updatePaymentStatus(
    paymentIntentId: string,
    status: PaymentStatus
  ): Promise<Booking | null>;

  /**
   * Mark booking as confirmed (after successful payment)
   */
  confirmBooking(bookingId: string): Promise<Booking>;

  /**
   * Cancel a booking
   */
  cancelBooking(bookingId: string): Promise<Booking>;

  /**
   * Get the provider name
   */
  getProviderName(): string;
}
