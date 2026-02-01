'use client';

/**
 * Booking List Component
 *
 * Displays a filterable table of bookings for admin management.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './BookingList.module.scss';

interface Booking {
  id: string;
  tourName: string;
  bookerName: string;
  bookerEmail: string;
  totalAmount: number;
  currency: string;
  status: string;
  paymentStatus: string;
  approvalStatus: string;
  productType: string;
  createdAt: string;
}

interface BookingListProps {
  initialFilter?: string;
}

export function BookingList({ initialFilter }: BookingListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(
    initialFilter || searchParams.get('approvalStatus') || 'all'
  );

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter !== 'all') {
          params.set('approvalStatus', filter);
        }

        const response = await fetch(`/api/admin/bookings?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setBookings(data.bookings || []);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [filter]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    router.push(`/admin/bookings?approvalStatus=${newFilter}`);
  };

  const getStatusBadge = (status: string, type: 'status' | 'payment' | 'approval') => {
    const statusColors: Record<string, string> = {
      // Booking status
      pending: 'warning',
      confirmed: 'success',
      cancelled: 'error',
      completed: 'success',
      refunded: 'info',
      // Payment status
      deposit_paid: 'info',
      succeeded: 'success',
      failed: 'error',
      // Approval status
      not_required: 'default',
      approved: 'success',
      rejected: 'error',
    };

    return (
      <span className={`${styles.badge} ${styles[statusColors[status] || 'default']}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className={styles.bookingList}>
      {/* Filters */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`}
          onClick={() => handleFilterChange('pending')}
        >
          Pending Approval
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'approved' ? styles.active : ''}`}
          onClick={() => handleFilterChange('approved')}
        >
          Approved
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'rejected' ? styles.active : ''}`}
          onClick={() => handleFilterChange('rejected')}
        >
          Rejected
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className={styles.loading}>Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No bookings found</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Booking</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Approval</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <div className={styles.tourName}>{booking.tourName}</div>
                    <div className={styles.bookingId}>{booking.id.slice(0, 8)}...</div>
                  </td>
                  <td>
                    <div className={styles.customerName}>{booking.bookerName}</div>
                    <div className={styles.customerEmail}>{booking.bookerEmail}</div>
                  </td>
                  <td>
                    <span className={styles.productType}>{booking.productType}</span>
                  </td>
                  <td className={styles.amount}>
                    {(booking.totalAmount / 100).toLocaleString('en-US', {
                      style: 'currency',
                      currency: booking.currency.toUpperCase(),
                    })}
                  </td>
                  <td>{getStatusBadge(booking.status, 'status')}</td>
                  <td>{getStatusBadge(booking.paymentStatus, 'payment')}</td>
                  <td>{getStatusBadge(booking.approvalStatus, 'approval')}</td>
                  <td className={styles.date}>
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className={styles.viewBtn}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
