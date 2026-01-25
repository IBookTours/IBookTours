import { CardSkeleton } from '@/components/shared/Skeleton';
import styles from './loading.module.scss';

export default function BlogLoading() {
  return (
    <div className={styles.loadingPage}>
      {/* Hero skeleton */}
      <div className={styles.heroSkeleton}>
        <div className={styles.heroContent}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonSubtitle} />
        </div>
      </div>

      <div className={styles.container}>
        {/* Categories skeleton */}
        <div className={styles.categoriesSkeleton}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.skeletonCategory} />
          ))}
        </div>

        {/* Blog posts grid skeleton */}
        <div className={styles.postsGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} showImage showBadge={false} lines={3} />
          ))}
        </div>
      </div>
    </div>
  );
}
