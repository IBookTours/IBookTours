/**
 * Admin Bookings Page
 *
 * Lists all bookings with filtering and management options.
 */

import { Suspense } from 'react';
import { BookingList } from '@/components/Admin';

export const metadata = {
  title: 'Manage Bookings | Admin | IBookTours',
  description: 'View and manage all bookings',
};

export default function AdminBookingsPage() {
  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Bookings
        </h1>
        <p style={{ color: 'var(--muted-foreground)' }}>
          Manage bookings and approvals
        </p>
      </header>

      <Suspense fallback={<div>Loading bookings...</div>}>
        <BookingList />
      </Suspense>
    </div>
  );
}
