'use client';

/**
 * Admin Dashboard Component
 *
 * Shows overview metrics and pending approvals.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './AdminDashboard.module.scss';

interface DashboardStats {
  totalBookings: number;
  pendingApproval: number;
  confirmedToday: number;
  revenue: number;
}

interface PendingBooking {
  id: string;
  tourName: string;
  bookerName: string;
  bookerEmail: string;
  totalAmount: number;
  productType: string;
  createdAt: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingApproval: 0,
    confirmedToday: 0,
    revenue: 0,
  });
  const [pendingBookings, setPendingBookings] = useState<PendingBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/admin/bookings?approvalStatus=pending&limit=5');
        if (response.ok) {
          const data = await response.json();
          setPendingBookings(data.bookings || []);
          setStats({
            totalBookings: data.total || 0,
            pendingApproval: data.pendingCount || 0,
            confirmedToday: data.confirmedToday || 0,
            revenue: data.revenue || 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <p>Welcome to the IBookTours admin panel</p>
      </header>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.totalBookings}</span>
            <span className={styles.statLabel}>Total Bookings</span>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.pendingApproval}</span>
            <span className={styles.statLabel}>Pending Approval</span>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.success}`}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22,4 12,14.01 9,11.01" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.confirmedToday}</span>
            <span className={styles.statLabel}>Confirmed Today</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>
              {(stats.revenue / 100).toLocaleString('en-US', {
                style: 'currency',
                currency: 'EUR',
              })}
            </span>
            <span className={styles.statLabel}>Total Revenue</span>
          </div>
        </div>
      </div>

      {/* Pending Approvals Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Pending Approvals</h2>
          <Link href="/admin/bookings?approvalStatus=pending" className={styles.viewAll}>
            View All
          </Link>
        </div>

        {pendingBookings.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No bookings pending approval</p>
          </div>
        ) : (
          <div className={styles.bookingsList}>
            {pendingBookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/admin/bookings/${booking.id}`}
                className={styles.bookingCard}
              >
                <div className={styles.bookingInfo}>
                  <h3>{booking.tourName}</h3>
                  <p>
                    {booking.bookerName} &bull; {booking.bookerEmail}
                  </p>
                  <span className={styles.productType}>{booking.productType}</span>
                </div>
                <div className={styles.bookingMeta}>
                  <span className={styles.amount}>
                    {(booking.totalAmount / 100).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </span>
                  <span className={styles.date}>
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
