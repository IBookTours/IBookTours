'use client';

import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import {
  User,
  Mail,
  Shield,
  Calendar,
  MapPin,
  Heart,
  Clock,
  ArrowLeft,
  Settings,
  Package,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { getRoleDisplayName } from '@/lib/auth';
import {
  useBookingsStore,
  formatBookingDate,
  getBookingStatusColor,
  Booking,
} from '@/store/bookingsStore';
import styles from './profile.module.scss';

interface UserProfileClientProps {
  session: Session;
}

// Helper to get status icon
function getStatusIcon(status: string) {
  switch (status) {
    case 'confirmed':
      return <CheckCircle size={14} />;
    case 'cancelled':
      return <XCircle size={14} />;
    case 'pending':
      return <AlertCircle size={14} />;
    default:
      return <Package size={14} />;
  }
}

export default function UserProfileClient({ session }: UserProfileClientProps) {
  const { user } = session;
  const isAdmin = user?.role === 'admin';

  // Get bookings from store
  const { bookings, getUpcomingBookings, getPastBookings } = useBookingsStore();

  // Filter bookings for this user
  const userBookings = useMemo(() => {
    if (!user?.email) return [];
    return bookings.filter(
      (b) => b.userEmail.toLowerCase() === user.email!.toLowerCase()
    );
  }, [bookings, user?.email]);

  const upcomingBookings = useMemo(() => {
    return userBookings.filter((booking) => {
      if (booking.status === 'cancelled') return false;
      const now = new Date();
      return booking.items.some((item) => new Date(item.travelDate) >= now);
    });
  }, [userBookings]);

  const completedBookings = useMemo(() => {
    return userBookings.filter((booking) => {
      if (booking.status === 'cancelled') return true;
      const now = new Date();
      return booking.items.every((item) => new Date(item.travelDate) < now);
    });
  }, [userBookings]);

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        {/* Back Link */}
        <Link href="/" className={styles.backLink}>
          <ArrowLeft />
          <span>Back to Home</span>
        </Link>

        {/* Profile Header */}
        <header className={styles.header}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'Profile'}
                  width={120}
                  height={120}
                  className={styles.avatarImage}
                />
              ) : (
                <User className={styles.avatarIcon} />
              )}
            </div>
            {isAdmin && <span className={styles.adminBadge}>Admin</span>}
          </div>

          <div className={styles.userInfo}>
            <h1 className={styles.userName}>{user?.name || 'Traveler'}</h1>
            <p className={styles.userEmail}>
              <Mail className={styles.infoIcon} />
              {user?.email}
            </p>
            <p className={styles.userRole}>
              <Shield className={styles.infoIcon} />
              {getRoleDisplayName(user?.role || 'user')}
            </p>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.editButton}>
              <Settings />
              <span>Edit Profile</span>
            </button>
            {isAdmin && (
              <Link href="/studio" className={styles.studioLink}>
                <Settings />
                <span>Admin Studio</span>
              </Link>
            )}
          </div>
        </header>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <MapPin />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{completedBookings.length}</span>
              <span className={styles.statLabel}>Trips Completed</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Calendar />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{upcomingBookings.length}</span>
              <span className={styles.statLabel}>Upcoming Trips</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Heart />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>0</span>
              <span className={styles.statLabel}>Wishlist Items</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Package />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{userBookings.length}</span>
              <span className={styles.statLabel}>Total Bookings</span>
            </div>
          </div>
        </div>

        {/* Upcoming Bookings Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Upcoming Trips</h2>
            <Link href="/destinations" className={styles.sectionLink}>
              Explore Destinations
            </Link>
          </div>

          {upcomingBookings.length > 0 ? (
            <div className={styles.bookingsGrid}>
              {upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <MapPin className={styles.emptyIcon} />
              <h3>No upcoming trips</h3>
              <p>Start planning your next adventure!</p>
              <Link href="/tours" className={styles.exploreButton}>
                Explore Tours
              </Link>
            </div>
          )}
        </section>

        {/* Past Bookings Section */}
        {completedBookings.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Past Trips</h2>
            </div>

            <div className={styles.bookingsGrid}>
              {completedBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </section>
        )}

        {/* Wishlist Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>My Wishlist</h2>
          </div>

          <div className={styles.emptyState}>
            <Heart className={styles.emptyIcon} />
            <h3>Your wishlist is empty</h3>
            <p>Save destinations you love to plan future trips!</p>
            <Link href="/#destinations" className={styles.exploreButton}>
              Browse Destinations
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

// ============================================
// BOOKING CARD COMPONENT
// ============================================

interface BookingCardProps {
  booking: Booking;
}

function BookingCard({ booking }: BookingCardProps) {
  // Get first item for display
  const primaryItem = booking.items[0];
  const totalItems = booking.items.length;
  const statusColor = getBookingStatusColor(booking.status);

  // Format price
  const formatPrice = (cents: number) => {
    return `€${(cents / 100).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <div className={styles.bookingCard}>
      <div className={styles.bookingImage}>
        <Image
          src={primaryItem?.image || 'https://picsum.photos/seed/travel/400/300'}
          alt={primaryItem?.name || 'Booking'}
          width={400}
          height={200}
          className={styles.image}
        />
        <span
          className={styles.bookingStatus}
          style={{ backgroundColor: statusColor, color: '#fff' }}
        >
          {getStatusIcon(booking.status)}
          <span style={{ marginLeft: '4px' }}>{booking.status}</span>
        </span>
      </div>
      <div className={styles.bookingContent}>
        <div className={styles.bookingMeta}>
          <span className={styles.confirmationNumber}>
            {booking.confirmationNumber}
          </span>
          {totalItems > 1 && (
            <span className={styles.itemCount}>{totalItems} items</span>
          )}
        </div>
        <h3 className={styles.bookingDestination}>
          {primaryItem?.name || 'Travel Package'}
        </h3>
        <p className={styles.bookingDate}>
          <Calendar className={styles.dateIcon} />
          {formatBookingDate(primaryItem?.travelDate || booking.createdAt)}
        </p>
        <div className={styles.bookingFooter}>
          <span className={styles.bookingPrice}>
            {formatPrice(booking.totalAmount)}
          </span>
          <span
            className={styles.paymentStatus}
            style={{
              color:
                booking.paymentStatus === 'paid'
                  ? '#10b981'
                  : booking.paymentStatus === 'pending'
                  ? '#f59e0b'
                  : '#6b7280',
            }}
          >
            {booking.paymentStatus === 'paid' ? 'Paid' : booking.paymentStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
