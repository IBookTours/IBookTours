/**
 * Admin Dashboard Page
 *
 * Overview of bookings, pending approvals, and key metrics.
 */

import { Suspense } from 'react';
import { AdminDashboard } from './AdminDashboard';

export const metadata = {
  title: 'Admin Dashboard | IBookTours',
  description: 'Manage bookings and approvals',
};

export default function AdminPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminDashboard />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div style={{ padding: '1rem' }}>
      <div
        style={{
          height: '2rem',
          width: '200px',
          background: 'var(--accent)',
          borderRadius: '6px',
          marginBottom: '2rem',
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              height: '120px',
              background: 'var(--accent)',
              borderRadius: '8px',
            }}
          />
        ))}
      </div>
    </div>
  );
}
