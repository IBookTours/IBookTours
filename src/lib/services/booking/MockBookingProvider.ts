/**
 * Mock Booking Provider - Demo Mode Implementation
 *
 * Used when DATABASE_URL is not configured.
 * Provides in-memory booking storage for development/demo purposes.
 */

import { randomBytes } from 'crypto';
import { BaseService } from '../base/BaseService';
import type { Booking } from '@/lib/db/schema';
import type {
  IBookingService,
  CreateBookingParams,
  UpdateBookingParams,
  BookingStatus,
  PaymentStatus,
} from './BookingService';

// In-memory storage for demo mode
const mockBookings: Map<string, Booking> = new Map();

export class MockBookingProvider extends BaseService implements IBookingService {
  constructor() {
    super('BookingService');
    this.logWarn('Using MockBookingProvider - data is not persisted! Configure DATABASE_URL for production.');
  }

  getProviderName(): string {
    return 'mock';
  }

  async createBooking(params: CreateBookingParams): Promise<Booking> {
    this.logInfo('Creating new booking (mock)', {
      tourId: params.tourId,
      bookerEmail: params.bookerEmail,
    });

    const booking: Booking = {
      id: `booking-${randomBytes(8).toString('hex')}`,
      userId: params.userId ?? null,
      tourId: params.tourId,
      tourName: params.tourName,
      totalAmount: params.totalAmount,
      currency: params.currency ?? 'eur',
      travelers: params.travelers ?? 1,
      selectedDate: params.selectedDate ?? null,
      bookerName: params.bookerName,
      bookerEmail: params.bookerEmail.toLowerCase().trim(),
      bookerPhone: params.bookerPhone ?? null,
      specialRequests: params.specialRequests ?? null,
      status: 'pending',
      paymentStatus: 'pending',
      paymentIntentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockBookings.set(booking.id, booking);
    this.logInfo('Booking created successfully (mock)', { bookingId: booking.id });

    return booking;
  }

  async findById(id: string): Promise<Booking | null> {
    this.logDebug('Finding booking by ID (mock)', { id });
    return mockBookings.get(id) ?? null;
  }

  async findByPaymentIntentId(paymentIntentId: string): Promise<Booking | null> {
    this.logDebug('Finding booking by payment intent ID (mock)', { paymentIntentId });

    const allBookings = Array.from(mockBookings.values());
    for (const booking of allBookings) {
      if (booking.paymentIntentId === paymentIntentId) {
        return booking;
      }
    }
    return null;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    this.logDebug('Finding bookings for user (mock)', { userId });

    const allBookings = Array.from(mockBookings.values());
    return allBookings
      .filter(booking => booking.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateBooking(id: string, params: UpdateBookingParams): Promise<Booking> {
    this.logInfo('Updating booking (mock)', { id, params });

    const booking = mockBookings.get(id);
    if (!booking) {
      throw new Error(`Booking with ID ${id} not found`);
    }

    const updated: Booking = {
      ...booking,
      ...params,
      updatedAt: new Date(),
    };

    mockBookings.set(id, updated);
    this.logInfo('Booking updated successfully (mock)', { bookingId: id });

    return updated;
  }

  async updatePaymentStatus(
    paymentIntentId: string,
    status: PaymentStatus
  ): Promise<Booking | null> {
    this.logInfo('Updating payment status (mock)', { paymentIntentId, status });

    const booking = await this.findByPaymentIntentId(paymentIntentId);
    if (!booking) {
      return null;
    }

    return this.updateBooking(booking.id, {
      paymentStatus: status,
      status: status === 'succeeded' ? 'confirmed' : (booking.status as BookingStatus),
    });
  }

  async confirmBooking(bookingId: string): Promise<Booking> {
    return this.updateBooking(bookingId, {
      status: 'confirmed',
      paymentStatus: 'succeeded',
    });
  }

  async cancelBooking(bookingId: string): Promise<Booking> {
    return this.updateBooking(bookingId, { status: 'cancelled' });
  }
}
