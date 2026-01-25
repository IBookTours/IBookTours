import { Skeleton, BookingCardSkeleton, StatsSkeleton } from '@/components/shared/Skeleton';
import styles from './loading.module.scss';

export default function ProfileLoading() {
  return (
    <div className={styles.loadingPage}>
      <div className={styles.container}>
        {/* Back link skeleton */}
        <div className={styles.backLink}>
          <Skeleton width={120} height={20} borderRadius={4} />
        </div>

        {/* Header skeleton */}
        <header className={styles.headerSkeleton}>
          <div className={styles.avatarSection}>
            <Skeleton width={120} height={120} variant="circular" />
          </div>
          <div className={styles.userInfo}>
            <Skeleton width={200} height={32} borderRadius={6} />
            <Skeleton width={180} height={18} borderRadius={4} />
            <Skeleton width={100} height={18} borderRadius={4} />
          </div>
          <div className={styles.headerActions}>
            <Skeleton width={130} height={44} borderRadius={22} />
          </div>
        </header>

        {/* Stats skeleton */}
        <StatsSkeleton count={4} />

        {/* Upcoming trips section skeleton */}
        <section className={styles.sectionSkeleton}>
          <div className={styles.sectionHeader}>
            <Skeleton width={160} height={28} borderRadius={6} />
            <Skeleton width={140} height={20} borderRadius={4} />
          </div>
          <div className={styles.bookingsGrid}>
            {Array.from({ length: 2 }).map((_, i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* Past trips section skeleton */}
        <section className={styles.sectionSkeleton}>
          <div className={styles.sectionHeader}>
            <Skeleton width={120} height={28} borderRadius={6} />
          </div>
          <div className={styles.bookingsGrid}>
            {Array.from({ length: 2 }).map((_, i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
