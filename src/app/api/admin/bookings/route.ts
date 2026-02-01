/**
 * Admin Bookings API
 *
 * GET /api/admin/bookings - List all bookings with filters
 *
 * SECURITY:
 * - Protected by middleware (requires admin role)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBookingService } from '@/lib/services/booking';
import { createLogger } from '@/lib/logger';
import type { BookingStatus, PaymentStatus, ApprovalStatus, ProductType } from '@/lib/services/booking/BookingService';

const logger = createLogger('AdminBookingsAPI');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filters from query params
    const status = searchParams.get('status') as BookingStatus | null;
    const paymentStatus = searchParams.get('paymentStatus') as PaymentStatus | null;
    const approvalStatus = searchParams.get('approvalStatus') as ApprovalStatus | null;
    const productType = searchParams.get('productType') as ProductType | null;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const bookingService = getBookingService();

    // Build filters object
    const filters: {
      status?: BookingStatus;
      paymentStatus?: PaymentStatus;
      approvalStatus?: ApprovalStatus;
      productType?: ProductType;
      limit?: number;
      offset?: number;
    } = { limit, offset };

    if (status) filters.status = status;
    if (paymentStatus) filters.paymentStatus = paymentStatus;
    if (approvalStatus) filters.approvalStatus = approvalStatus;
    if (productType) filters.productType = productType;

    // Fetch bookings
    const bookings = await bookingService.findAll(filters);

    // Get pending count for dashboard stats
    const pendingBookings = await bookingService.findPendingApproval();

    // Calculate basic stats
    const total = bookings.length;
    const pendingCount = pendingBookings.length;

    // Calculate today's confirmed bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const confirmedToday = bookings.filter((b) => {
      const updated = new Date(b.updatedAt);
      updated.setHours(0, 0, 0, 0);
      return b.status === 'confirmed' && updated.getTime() === today.getTime();
    }).length;

    // Calculate total revenue from confirmed bookings
    const revenue = bookings
      .filter((b) => b.status === 'confirmed' || b.paymentStatus === 'succeeded')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    logger.info('Admin fetched bookings', {
      filters,
      count: bookings.length,
      pendingCount,
    });

    // Serialize bookings for JSON response
    const serializedBookings = bookings.map((booking) => ({
      ...booking,
      selectedDate: booking.selectedDate?.toISOString() || null,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      depositPaidAt: booking.depositPaidAt?.toISOString() || null,
      approvedAt: booking.approvedAt?.toISOString() || null,
    }));

    return NextResponse.json({
      bookings: serializedBookings,
      total,
      pendingCount,
      confirmedToday,
      revenue,
    });
  } catch (error) {
    logger.error('Failed to fetch admin bookings', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
