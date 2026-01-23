'use client';

import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
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
} from 'lucide-react';
import { getRoleDisplayName } from '@/lib/auth';
import styles from './profile.module.scss';

interface UserProfileClientProps {
  session: Session;
}

export default function UserProfileClient({ session }: UserProfileClientProps) {
  const { user } = session;
  const isAdmin = user?.role === 'admin';

  // Placeholder bookings data
  const placeholderBookings = [
    {
      id: '1',
      destination: 'Kyoto, Japan',
      date: 'March 15-22, 2025',
      status: 'upcoming',
      image: 'https://picsum.photos/seed/kyoto-japan/400/300',
    },
    {
      id: '2',
      destination: 'Santorini, Greece',
      date: 'June 1-8, 2025',
      status: 'upcoming',
      image: 'https://picsum.photos/seed/santorini-greece/400/300',
    },
  ];

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
              <span className={styles.statValue}>0</span>
              <span className={styles.statLabel}>Trips Completed</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Calendar />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{placeholderBookings.length}</span>
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
              <Clock />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>New</span>
              <span className={styles.statLabel}>Member Since</span>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>My Bookings</h2>
            <Link href="/destinations" className={styles.sectionLink}>
              Explore Destinations
            </Link>
          </div>

          {placeholderBookings.length > 0 ? (
            <div className={styles.bookingsGrid}>
              {placeholderBookings.map((booking) => (
                <div key={booking.id} className={styles.bookingCard}>
                  <div className={styles.bookingImage}>
                    <Image
                      src={booking.image}
                      alt={booking.destination}
                      width={400}
                      height={200}
                      className={styles.image}
                    />
                    <span
                      className={`${styles.bookingStatus} ${
                        styles[booking.status]
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className={styles.bookingContent}>
                    <h3 className={styles.bookingDestination}>
                      {booking.destination}
                    </h3>
                    <p className={styles.bookingDate}>
                      <Calendar className={styles.dateIcon} />
                      {booking.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <MapPin className={styles.emptyIcon} />
              <h3>No bookings yet</h3>
              <p>Start planning your next adventure!</p>
              <Link href="/#destinations" className={styles.exploreButton}>
                Explore Destinations
              </Link>
            </div>
          )}
        </section>

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
