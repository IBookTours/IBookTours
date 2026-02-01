'use client';

/**
 * Booking Detail Component
 *
 * Shows full booking details with approve/reject actions for admins.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './BookingDetail.module.scss';

interface Booking {
  id: string;
  tourId: string;
  tourName: string;
  bookerName: string;
  bookerEmail: string;
  bookerPhone: string | null;
  totalAmount: number;
  depositAmount: number | null;
  balanceAmount: number | null;
  currency: string;
  travelers: number;
  selectedDate: string | null;
  specialRequests: string | null;
  status: string;
  paymentStatus: string | null;
  approvalStatus: string | null;
  productType: string | null;
  paymentMethod: string | null;
  adminNotes: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BookingDetailProps {
  booking: Booking;
}

export function BookingDetail({ booking }: BookingDetailProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [adminNotes, setAdminNotes] = useState(booking.adminNotes || '');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this booking?')) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          adminNotes: adminNotes || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to approve booking');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          reason: rejectReason,
          adminNotes: adminNotes || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reject booking');
      }

      setShowRejectModal(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return (amount / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: booking.currency.toUpperCase(),
    });
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: 'warning',
      confirmed: 'success',
      cancelled: 'error',
      completed: 'success',
      refunded: 'info',
      deposit_paid: 'info',
      succeeded: 'success',
      failed: 'error',
      not_required: 'default',
      approved: 'success',
      rejected: 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <div className={styles.bookingDetail}>
      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>{booking.tourName}</h1>
          <p className={styles.bookingId}>Booking ID: {booking.id}</p>
        </div>
        <div className={styles.headerActions}>
          <span className={`${styles.statusBadge} ${styles[getStatusColor(booking.approvalStatus || 'pending')]}`}>
            {(booking.approvalStatus || 'pending').replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.grid}>
        {/* Customer Info */}
        <section className={styles.card}>
          <h2>Customer Information</h2>
          <dl className={styles.infoList}>
            <div>
              <dt>Name</dt>
              <dd>{booking.bookerName}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${booking.bookerEmail}`}>{booking.bookerEmail}</a>
              </dd>
            </div>
            {booking.bookerPhone && (
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${booking.bookerPhone}`}>{booking.bookerPhone}</a>
                </dd>
              </div>
            )}
            <div>
              <dt>Travelers</dt>
              <dd>{booking.travelers}</dd>
            </div>
          </dl>
        </section>

        {/* Booking Info */}
        <section className={styles.card}>
          <h2>Booking Details</h2>
          <dl className={styles.infoList}>
            <div>
              <dt>Product Type</dt>
              <dd className={styles.capitalize}>{booking.productType || 'day-tour'}</dd>
            </div>
            <div>
              <dt>Tour Date</dt>
              <dd>
                {booking.selectedDate
                  ? new Date(booking.selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Not specified'}
              </dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <span className={`${styles.badge} ${styles[getStatusColor(booking.status)]}`}>
                  {booking.status}
                </span>
              </dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{new Date(booking.createdAt).toLocaleString()}</dd>
            </div>
          </dl>
        </section>

        {/* Payment Info */}
        <section className={styles.card}>
          <h2>Payment Information</h2>
          <dl className={styles.infoList}>
            <div>
              <dt>Payment Method</dt>
              <dd className={styles.capitalize}>{booking.paymentMethod || 'full'}</dd>
            </div>
            <div>
              <dt>Total Amount</dt>
              <dd className={styles.amount}>{formatAmount(booking.totalAmount)}</dd>
            </div>
            {booking.depositAmount && (
              <div>
                <dt>Deposit</dt>
                <dd>{formatAmount(booking.depositAmount)}</dd>
              </div>
            )}
            {booking.balanceAmount && (
              <div>
                <dt>Balance Due</dt>
                <dd>{formatAmount(booking.balanceAmount)}</dd>
              </div>
            )}
            <div>
              <dt>Payment Status</dt>
              <dd>
                <span className={`${styles.badge} ${styles[getStatusColor(booking.paymentStatus || 'pending')]}`}>
                  {(booking.paymentStatus || 'pending').replace('_', ' ')}
                </span>
              </dd>
            </div>
          </dl>
        </section>

        {/* Special Requests */}
        {booking.specialRequests && (
          <section className={styles.card}>
            <h2>Special Requests</h2>
            <p className={styles.specialRequests}>{booking.specialRequests}</p>
          </section>
        )}

        {/* Admin Notes */}
        <section className={styles.card}>
          <h2>Admin Notes</h2>
          <textarea
            className={styles.notesInput}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add internal notes about this booking..."
            rows={4}
          />
        </section>

        {/* Rejection Reason (if rejected) */}
        {booking.rejectionReason && (
          <section className={`${styles.card} ${styles.rejectionCard}`}>
            <h2>Rejection Reason</h2>
            <p>{booking.rejectionReason}</p>
          </section>
        )}
      </div>

      {/* Approval Actions */}
      {booking.approvalStatus === 'pending' && (
        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.approveBtn}`}
            onClick={handleApprove}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Approve Booking'}
          </button>
          <button
            className={`${styles.btn} ${styles.rejectBtn}`}
            onClick={() => setShowRejectModal(true)}
            disabled={loading}
          >
            Reject Booking
          </button>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Reject Booking</h3>
            <p>Please provide a reason for rejecting this booking:</p>
            <textarea
              className={styles.notesInput}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={4}
              autoFocus
            />
            <div className={styles.modalActions}>
              <button
                className={`${styles.btn} ${styles.cancelBtn}`}
                onClick={() => setShowRejectModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className={`${styles.btn} ${styles.rejectBtn}`}
                onClick={handleReject}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
