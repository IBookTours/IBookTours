/**
 * Admin Single Booking API
 *
 * GET /api/admin/bookings/[id] - Get booking details
 * PATCH /api/admin/bookings/[id] - Approve/reject booking
 *
 * SECURITY:
 * - Protected by middleware (requires admin role)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getBookingService } from '@/lib/services/booking';
import { emailService } from '@/lib/services/email';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AdminBookingAPI');

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Validate booking ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid booking ID format' },
        { status: 400 }
      );
    }

    const bookingService = getBookingService();
    const booking = await bookingService.findById(id);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Serialize booking for JSON response
    const serializedBooking = {
      ...booking,
      selectedDate: booking.selectedDate?.toISOString() || null,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      depositPaidAt: booking.depositPaidAt?.toISOString() || null,
      approvedAt: booking.approvedAt?.toISOString() || null,
    };

    return NextResponse.json({ booking: serializedBooking });
  } catch (error) {
    logger.error('Failed to fetch booking', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Validate booking ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid booking ID format' },
        { status: 400 }
      );
    }

    // Get admin user from token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'dev-only-insecure-secret-do-not-use-in-production',
    });

    if (!token || !token.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, reason, adminNotes } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    const bookingService = getBookingService();

    let updatedBooking;

    if (action === 'approve') {
      logger.info('Admin approving booking', { bookingId: id, adminId: token.id });

      updatedBooking = await bookingService.approveBooking(
        id,
        token.id,
        adminNotes
      );

      // Send approval email to customer
      if (updatedBooking.bookerEmail) {
        try {
          await emailService.sendBookingConfirmation({
            customerEmail: updatedBooking.bookerEmail,
            customerName: updatedBooking.bookerName || 'Guest',
            bookingId: updatedBooking.id,
            tourName: updatedBooking.tourName,
            tourDate: updatedBooking.selectedDate?.toISOString() || 'TBD',
            totalAmount: `Your booking has been approved! Total: €${(updatedBooking.totalAmount / 100).toFixed(2)}`,
          });
          logger.info('Approval email sent', { email: updatedBooking.bookerEmail });
        } catch (emailError) {
          logger.error('Failed to send approval email', emailError);
          // Don't fail the API call if email fails
        }
      }
    } else {
      // Reject
      if (!reason) {
        return NextResponse.json(
          { error: 'Rejection reason is required' },
          { status: 400 }
        );
      }

      logger.info('Admin rejecting booking', { bookingId: id, adminId: token.id, reason });

      updatedBooking = await bookingService.rejectBooking(
        id,
        token.id,
        reason
      );

      // Send rejection email to customer
      if (updatedBooking.bookerEmail) {
        try {
          // Using the booking confirmation template with rejection message
          // In production, you'd have a dedicated rejection email template
          await emailService.sendBookingConfirmation({
            customerEmail: updatedBooking.bookerEmail,
            customerName: updatedBooking.bookerName || 'Guest',
            bookingId: updatedBooking.id,
            tourName: updatedBooking.tourName,
            tourDate: updatedBooking.selectedDate?.toISOString() || 'TBD',
            totalAmount: `Unfortunately, your booking could not be confirmed. Reason: ${reason}`,
          });
          logger.info('Rejection email sent', { email: updatedBooking.bookerEmail });
        } catch (emailError) {
          logger.error('Failed to send rejection email', emailError);
          // Don't fail the API call if email fails
        }
      }
    }

    logger.info('Booking updated', {
      bookingId: id,
      action,
      newStatus: updatedBooking.approvalStatus,
    });

    // Serialize booking for JSON response
    const serializedBooking = {
      ...updatedBooking,
      selectedDate: updatedBooking.selectedDate?.toISOString() || null,
      createdAt: updatedBooking.createdAt.toISOString(),
      updatedAt: updatedBooking.updatedAt.toISOString(),
      depositPaidAt: updatedBooking.depositPaidAt?.toISOString() || null,
      approvedAt: updatedBooking.approvedAt?.toISOString() || null,
    };

    return NextResponse.json({
      booking: serializedBooking,
      message: `Booking ${action}d successfully`,
    });
  } catch (error) {
    logger.error('Failed to update booking', error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }
      if (error.message.includes('not pending')) {
        return NextResponse.json(
          { error: 'Booking is not pending approval' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}
