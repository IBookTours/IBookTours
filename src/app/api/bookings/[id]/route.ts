/**
 * Booking API - Single Booking Operations
 *
 * GET /api/bookings/[id] - Returns a specific booking (with ownership verification)
 *
 * SECURITY:
 * - Protected by middleware (requires authentication)
 * - Ownership check: Users can only access their own bookings (IDOR prevention)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getBookingService } from '@/lib/services/booking';
import { getUserService } from '@/lib/services/user';
import { createLogger } from '@/lib/logger';

const logger = createLogger('BookingDetailAPI');

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: bookingId } = await params;

    // SECURITY: Validate booking ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(bookingId)) {
      return NextResponse.json(
        { error: 'Invalid booking ID format' },
        { status: 400 }
      );
    }

    // SECURITY: Get authenticated user from JWT
    // Middleware already verified authentication, but we double-check
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'dev-only-insecure-secret-do-not-use-in-production',
    });

    if (!token || !token.email) {
      logger.warn('Unauthenticated request to booking detail endpoint');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user from database to get their ID
    const userService = getUserService();
    const user = await userService.findByEmail(token.email);

    if (!user) {
      logger.warn('Authenticated user not found in database', { email: token.email });
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get the booking
    const bookingService = getBookingService();
    const booking = await bookingService.findById(bookingId);

    if (!booking) {
      logger.info('Booking not found', { bookingId, requestedBy: user.id });
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // SECURITY: Ownership check - prevent IDOR attacks
    // Users can only access their own bookings (admins bypass via different endpoint)
    if (booking.userId !== user.id) {
      logger.warn('Unauthorized booking access attempt (IDOR)', {
        bookingId,
        bookingOwnerId: booking.userId,
        requestedBy: user.id,
      });
      // Return 404 instead of 403 to prevent enumeration
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    logger.info('Booking retrieved', { bookingId, userId: user.id });

    // Return full booking details (user has verified ownership)
    return NextResponse.json({
      booking: {
        id: booking.id,
        tourId: booking.tourId,
        tourName: booking.tourName,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        travelers: booking.travelers,
        selectedDate: booking.selectedDate,
        bookerName: booking.bookerName,
        bookerEmail: booking.bookerEmail,
        bookerPhone: booking.bookerPhone,
        specialRequests: booking.specialRequests,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Failed to retrieve booking', error);
    return NextResponse.json(
      { error: 'Failed to retrieve booking' },
      { status: 500 }
    );
  }
}
