'use client';

import styles from './Skeleton.module.scss';

// ============================================
// BASE SKELETON COMPONENT
// ============================================

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({
  width,
  height,
  borderRadius,
  className = '',
  variant = 'rectangular',
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius:
      variant === 'circular'
        ? '50%'
        : typeof borderRadius === 'number'
        ? `${borderRadius}px`
        : borderRadius,
  };

  return (
    <div
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

// ============================================
// CARD SKELETON
// ============================================

interface CardSkeletonProps {
  showImage?: boolean;
  showBadge?: boolean;
  lines?: number;
  className?: string;
}

export function CardSkeleton({
  showImage = true,
  showBadge = true,
  lines = 3,
  className = '',
}: CardSkeletonProps) {
  return (
    <div className={`${styles.cardSkeleton} ${className}`}>
      {showImage && (
        <div className={styles.cardImage}>
          <Skeleton height="100%" borderRadius={0} />
          {showBadge && (
            <div className={styles.cardBadge}>
              <Skeleton width={60} height={24} borderRadius={12} />
            </div>
          )}
        </div>
      )}
      <div className={styles.cardContent}>
        <Skeleton width="70%" height={24} borderRadius={4} />
        <Skeleton width="50%" height={16} borderRadius={4} />
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            width={i === lines - 1 ? '60%' : '100%'}
            height={14}
            borderRadius={4}
          />
        ))}
        <div className={styles.cardFooter}>
          <Skeleton width={80} height={28} borderRadius={4} />
          <Skeleton width={100} height={36} borderRadius={18} />
        </div>
      </div>
    </div>
  );
}

// ============================================
// LIST SKELETON
// ============================================

interface ListSkeletonProps {
  count?: number;
  showAvatar?: boolean;
  lines?: number;
  className?: string;
}

export function ListSkeleton({
  count = 3,
  showAvatar = true,
  lines = 2,
  className = '',
}: ListSkeletonProps) {
  return (
    <div className={`${styles.listSkeleton} ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.listItem}>
          {showAvatar && (
            <Skeleton width={48} height={48} variant="circular" />
          )}
          <div className={styles.listContent}>
            <Skeleton width="40%" height={18} borderRadius={4} />
            {Array.from({ length: lines }).map((_, i) => (
              <Skeleton
                key={i}
                width={i === lines - 1 ? '70%' : '100%'}
                height={14}
                borderRadius={4}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// FORM SKELETON
// ============================================

interface FormSkeletonProps {
  fields?: number;
  showButton?: boolean;
  className?: string;
}

export function FormSkeleton({
  fields = 4,
  showButton = true,
  className = '',
}: FormSkeletonProps) {
  return (
    <div className={`${styles.formSkeleton} ${className}`}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className={styles.formField}>
          <Skeleton width={80} height={14} borderRadius={4} />
          <Skeleton width="100%" height={44} borderRadius={8} />
        </div>
      ))}
      {showButton && (
        <Skeleton width="100%" height={48} borderRadius={24} />
      )}
    </div>
  );
}

// ============================================
// STATS SKELETON
// ============================================

interface StatsSkeletonProps {
  count?: number;
  className?: string;
}

export function StatsSkeleton({ count = 4, className = '' }: StatsSkeletonProps) {
  return (
    <div className={`${styles.statsSkeleton} ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.statItem}>
          <Skeleton width={48} height={48} variant="circular" />
          <Skeleton width={60} height={32} borderRadius={4} />
          <Skeleton width={80} height={16} borderRadius={4} />
        </div>
      ))}
    </div>
  );
}

// ============================================
// HERO SKELETON
// ============================================

export function HeroSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`${styles.heroSkeleton} ${className}`}>
      <Skeleton height="100%" borderRadius={0} />
      <div className={styles.heroContent}>
        <Skeleton width={100} height={28} borderRadius={14} />
        <Skeleton width="60%" height={48} borderRadius={8} />
        <Skeleton width="40%" height={24} borderRadius={4} />
        <div className={styles.heroActions}>
          <Skeleton width={140} height={48} borderRadius={24} />
          <Skeleton width={140} height={48} borderRadius={24} />
        </div>
      </div>
    </div>
  );
}

// ============================================
// BOOKING CARD SKELETON
// ============================================

export function BookingCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`${styles.bookingCardSkeleton} ${className}`}>
      <div className={styles.bookingImage}>
        <Skeleton height="100%" borderRadius={0} />
        <div className={styles.bookingBadge}>
          <Skeleton width={80} height={24} borderRadius={12} />
        </div>
      </div>
      <div className={styles.bookingContent}>
        <div className={styles.bookingMeta}>
          <Skeleton width={100} height={16} borderRadius={4} />
          <Skeleton width={60} height={16} borderRadius={4} />
        </div>
        <Skeleton width="80%" height={22} borderRadius={4} />
        <Skeleton width={120} height={16} borderRadius={4} />
        <div className={styles.bookingFooter}>
          <Skeleton width={80} height={24} borderRadius={4} />
          <Skeleton width={60} height={24} borderRadius={4} />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
