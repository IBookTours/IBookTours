/**
 * Bookings API - List User Bookings
 *
 * GET /api/bookings - Returns all bookings for the authenticated user
 *
 * SECURITY: Protected by middleware (requires authentication)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getBookingService } from '@/lib/services/booking';
import { getUserService } from '@/lib/services/user';
import { createLogger } from '@/lib/logger';

const logger = createLogger('BookingsAPI');

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Get authenticated user from JWT
    // Middleware already verified authentication, but we double-check
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'dev-only-insecure-secret-do-not-use-in-production',
    });

    if (!token || !token.email) {
      logger.warn('Unauthenticated request to bookings endpoint');
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

    // SECURITY: Only return bookings belonging to this user
    const bookingService = getBookingService();
    const bookings = await bookingService.findByUserId(user.id);

    logger.info('Bookings retrieved', { userId: user.id, count: bookings.length });

    // Return bookings (PII is filtered - only return what's needed for display)
    return NextResponse.json({
      bookings: bookings.map((booking) => ({
        id: booking.id,
        tourId: booking.tourId,
        tourName: booking.tourName,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        travelers: booking.travelers,
        selectedDate: booking.selectedDate,
        createdAt: booking.createdAt,
      })),
    });
  } catch (error) {
    logger.error('Failed to retrieve bookings', error);
    return NextResponse.json(
      { error: 'Failed to retrieve bookings' },
      { status: 500 }
    );
  }
}
