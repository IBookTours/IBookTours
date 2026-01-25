import { CardSkeleton } from '@/components/shared/Skeleton';
import styles from './loading.module.scss';

export default function ToursLoading() {
  return (
    <div className={styles.loadingPage}>
      {/* Hero skeleton */}
      <div className={styles.heroSkeleton}>
        <div className={styles.heroContent}>
          <div className={styles.skeletonBadge} />
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonSubtitle} />
        </div>
      </div>

      <div className={styles.container}>
        {/* Tabs skeleton */}
        <div className={styles.tabsSkeleton}>
          <div className={styles.skeletonTab} />
          <div className={styles.skeletonTab} />
          <div className={styles.skeletonTab} />
        </div>

        {/* Filters skeleton */}
        <div className={styles.filtersSkeleton}>
          <div className={styles.skeletonFilter} />
          <div className={styles.skeletonFilter} />
          <div className={styles.skeletonFilter} />
        </div>

        {/* Cards grid skeleton */}
        <div className={styles.cardsGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} showImage showBadge lines={2} />
          ))}
        </div>
      </div>
    </div>
  );
}
