/**
 * Database Booking Provider - Neon Postgres Implementation
 *
 * Implements IBookingService using Drizzle ORM with Neon Postgres.
 */

import {
  requireDb,
  bookings,
  eq,
  and,
  desc,
  type Booking,
} from '@/lib/db';
import { BaseService } from '../base/BaseService';
import type {
  IBookingService,
  CreateBookingParams,
  UpdateBookingParams,
  PaymentStatus,
  ApprovalStatus,
  ProductType,
  BookingStatus,
} from './BookingService';

export class DatabaseBookingProvider extends BaseService implements IBookingService {
  constructor() {
    super('BookingService');
  }

  getProviderName(): string {
    return 'neon-postgres';
  }

  async createBooking(params: CreateBookingParams): Promise<Booking> {
    const db = requireDb();

    this.logInfo('Creating new booking', {
      tourId: params.tourId,
      bookerEmail: params.bookerEmail,
      amount: params.totalAmount,
    });

    const [booking] = await db
      .insert(bookings)
      .values({
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
        // New fields for approval/deposit workflow
        productType: params.productType ?? 'day-tour',
        paymentMethod: params.paymentMethod ?? 'full',
        depositAmount: params.depositAmount ?? null,
        balanceAmount: params.balanceAmount ?? null,
        approvalStatus: params.approvalStatus ?? 'not_required',
      })
      .returning();

    this.logInfo('Booking created successfully', { bookingId: booking.id });

    return booking;
  }

  async findById(id: string): Promise<Booking | null> {
    const db = requireDb();

    this.logDebug('Finding booking by ID', { id });

    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
    });

    return booking ?? null;
  }

  async findByPaymentIntentId(paymentIntentId: string): Promise<Booking | null> {
    const db = requireDb();

    this.logDebug('Finding booking by payment intent ID', { paymentIntentId });

    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.paymentIntentId, paymentIntentId),
    });

    return booking ?? null;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const db = requireDb();

    this.logDebug('Finding bookings for user', { userId });

    const userBookings = await db.query.bookings.findMany({
      where: eq(bookings.userId, userId),
      orderBy: (bookings, { desc }) => [desc(bookings.createdAt)],
    });

    return userBookings;
  }

  async updateBooking(id: string, params: UpdateBookingParams): Promise<Booking> {
    const db = requireDb();

    this.logInfo('Updating booking', { id, params });

    const [updated] = await db
      .update(bookings)
      .set({
        ...params,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, id))
      .returning();

    if (!updated) {
      throw new Error(`Booking with ID ${id} not found`);
    }

    this.logInfo('Booking updated successfully', { bookingId: id });

    return updated;
  }

  async updatePaymentStatus(
    paymentIntentId: string,
    status: PaymentStatus
  ): Promise<Booking | null> {
    const db = requireDb();

    this.logInfo('Updating payment status', { paymentIntentId, status });

    const [updated] = await db
      .update(bookings)
      .set({
        paymentStatus: status,
        status: status === 'succeeded' ? 'confirmed' : bookings.status,
        updatedAt: new Date(),
      })
      .where(eq(bookings.paymentIntentId, paymentIntentId))
      .returning();

    if (updated) {
      this.logInfo('Payment status updated', { bookingId: updated.id, status });
    }

    return updated ?? null;
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

  async approveBooking(
    bookingId: string,
    approvedBy: string,
    adminNotes?: string
  ): Promise<Booking> {
    const db = requireDb();

    this.logInfo('Approving booking', { bookingId, approvedBy });

    const booking = await this.findById(bookingId);
    if (!booking) {
      throw new Error(`Booking with ID ${bookingId} not found`);
    }

    if (booking.approvalStatus !== 'pending') {
      throw new Error(`Booking ${bookingId} is not pending approval`);
    }

    const [updated] = await db
      .update(bookings)
      .set({
        approvalStatus: 'approved',
        approvedBy,
        approvedAt: new Date(),
        adminNotes: adminNotes || booking.adminNotes,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))
      .returning();

    this.logInfo('Booking approved', { bookingId });

    return updated;
  }

  async rejectBooking(
    bookingId: string,
    rejectedBy: string,
    reason: string
  ): Promise<Booking> {
    const db = requireDb();

    this.logInfo('Rejecting booking', { bookingId, rejectedBy, reason });

    const booking = await this.findById(bookingId);
    if (!booking) {
      throw new Error(`Booking with ID ${bookingId} not found`);
    }

    if (booking.approvalStatus !== 'pending') {
      throw new Error(`Booking ${bookingId} is not pending approval`);
    }

    const [updated] = await db
      .update(bookings)
      .set({
        approvalStatus: 'rejected',
        status: 'cancelled',
        rejectionReason: reason,
        adminNotes: `Rejected by ${rejectedBy}: ${reason}`,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))
      .returning();

    this.logInfo('Booking rejected', { bookingId });

    return updated;
  }

  async findPendingApproval(): Promise<Booking[]> {
    const db = requireDb();

    this.logDebug('Finding pending approval bookings');

    const pendingBookings = await db.query.bookings.findMany({
      where: eq(bookings.approvalStatus, 'pending'),
      orderBy: [desc(bookings.createdAt)],
    });

    return pendingBookings;
  }

  async findAll(filters?: {
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
    approvalStatus?: ApprovalStatus;
    productType?: ProductType;
    limit?: number;
    offset?: number;
  }): Promise<Booking[]> {
    const db = requireDb();

    this.logDebug('Finding all bookings', { filters });

    // Build where conditions dynamically
    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(bookings.status, filters.status));
    }
    if (filters?.paymentStatus) {
      conditions.push(eq(bookings.paymentStatus, filters.paymentStatus));
    }
    if (filters?.approvalStatus) {
      conditions.push(eq(bookings.approvalStatus, filters.approvalStatus));
    }
    if (filters?.productType) {
      conditions.push(eq(bookings.productType, filters.productType));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const allBookings = await db.query.bookings.findMany({
      where: whereClause,
      orderBy: [desc(bookings.createdAt)],
      limit: filters?.limit,
      offset: filters?.offset,
    });

    return allBookings;
  }
}
