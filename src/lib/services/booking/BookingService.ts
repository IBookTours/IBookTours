/**
 * Booking Service - Interface & Types
 *
 * Provides booking management operations including:
 * - Creating bookings
 * - Updating booking status
 * - Finding bookings by various criteria
 */

import type { Booking, NewBooking } from '@/lib/db/schema';
import type { ProductType, PaymentMethod, ApprovalStatus } from '@/lib/config/products';

export type { ProductType, PaymentMethod, ApprovalStatus };

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
export type PaymentStatus = 'pending' | 'deposit_paid' | 'succeeded' | 'failed' | 'refunded';

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
  // New fields for approval/deposit workflow
  productType?: ProductType;
  paymentMethod?: PaymentMethod;
  depositAmount?: number; // in cents
  balanceAmount?: number; // in cents
  approvalStatus?: ApprovalStatus;
}

export interface UpdateBookingParams {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  paymentIntentId?: string;
  // New update fields
  depositPaidAt?: Date;
  balancePaymentIntentId?: string;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  adminNotes?: string;
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
   * Approve a booking (admin action)
   */
  approveBooking(
    bookingId: string,
    approvedBy: string,
    adminNotes?: string
  ): Promise<Booking>;

  /**
   * Reject a booking (admin action)
   */
  rejectBooking(
    bookingId: string,
    rejectedBy: string,
    reason: string
  ): Promise<Booking>;

  /**
   * Find bookings pending approval
   */
  findPendingApproval(): Promise<Booking[]>;

  /**
   * Find all bookings with optional filters
   */
  findAll(filters?: {
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
    approvalStatus?: ApprovalStatus;
    productType?: ProductType;
    limit?: number;
    offset?: number;
  }): Promise<Booking[]>;

  /**
   * Get the provider name
   */
  getProviderName(): string;
}
