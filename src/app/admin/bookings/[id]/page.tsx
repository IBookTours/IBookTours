/**
 * Admin Booking Detail Page
 *
 * Shows full booking details with approval actions.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBookingService } from '@/lib/services/booking';
import { BookingDetail } from '@/components/Admin';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Booking ${id.slice(0, 8)} | Admin | IBookTours`,
  };
}

export default async function AdminBookingDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Validate booking ID format (UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  const bookingService = getBookingService();
  const booking = await bookingService.findById(id);

  if (!booking) {
    notFound();
  }

  // Serialize booking for client component
  const serializedBooking = {
    ...booking,
    selectedDate: booking.selectedDate?.toISOString() || null,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    depositPaidAt: booking.depositPaidAt?.toISOString() || null,
    approvedAt: booking.approvedAt?.toISOString() || null,
  };

  return (
    <div>
      <nav style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/admin/bookings"
          style={{
            color: 'var(--muted-foreground)',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
        >
          &larr; Back to Bookings
        </Link>
      </nav>

      <BookingDetail booking={serializedBooking} />
    </div>
  );
}
