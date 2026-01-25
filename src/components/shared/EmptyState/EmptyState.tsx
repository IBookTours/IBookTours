'use client';

import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  MapPin,
  Calendar,
  Heart,
  FileText,
  Users,
  Package,
  AlertCircle,
  LucideIcon,
} from 'lucide-react';
import styles from './EmptyState.module.scss';

// ============================================
// TYPES
// ============================================

type EmptyStateVariant =
  | 'no-results'
  | 'empty-cart'
  | 'no-bookings'
  | 'no-trips'
  | 'empty-wishlist'
  | 'no-reviews'
  | 'no-posts'
  | 'error'
  | 'custom';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// ============================================
// PRESET CONFIGURATIONS
// ============================================

const presets: Record<
  Exclude<EmptyStateVariant, 'custom'>,
  {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
  }
> = {
  'no-results': {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you\'re looking for.',
    actionLabel: 'Clear filters',
  },
  'empty-cart': {
    icon: ShoppingCart,
    title: 'Your cart is empty',
    description: 'Browse our tours and vacation packages to start planning your adventure.',
    actionLabel: 'Explore Tours',
    actionHref: '/tours',
  },
  'no-bookings': {
    icon: Package,
    title: 'No bookings yet',
    description: 'You haven\'t made any bookings. Start planning your next adventure!',
    actionLabel: 'Browse Packages',
    actionHref: '/tours',
  },
  'no-trips': {
    icon: MapPin,
    title: 'No upcoming trips',
    description: 'Start planning your next adventure!',
    actionLabel: 'Explore Destinations',
    actionHref: '/destinations',
  },
  'empty-wishlist': {
    icon: Heart,
    title: 'Your wishlist is empty',
    description: 'Save destinations you love to plan future trips!',
    actionLabel: 'Browse Destinations',
    actionHref: '/#destinations',
  },
  'no-reviews': {
    icon: Users,
    title: 'No reviews yet',
    description: 'Be the first to share your experience!',
    actionLabel: 'Write a Review',
  },
  'no-posts': {
    icon: FileText,
    title: 'No posts found',
    description: 'Check back later for new content or try a different category.',
    actionLabel: 'View All Posts',
    actionHref: '/blog',
  },
  error: {
    icon: AlertCircle,
    title: 'Something went wrong',
    description: 'We couldn\'t load the content. Please try again later.',
    actionLabel: 'Try Again',
  },
};

// ============================================
// COMPONENT
// ============================================

export function EmptyState({
  variant = 'custom',
  title,
  description,
  icon,
  actionLabel,
  actionHref,
  onAction,
  className = '',
  size = 'md',
}: EmptyStateProps) {
  // Get preset or use custom values
  const preset = variant !== 'custom' ? presets[variant] : null;

  const Icon = icon || preset?.icon || Search;
  const displayTitle = title || preset?.title || 'Nothing here';
  const displayDescription = description || preset?.description || '';
  const displayActionLabel = actionLabel || preset?.actionLabel;
  const displayActionHref = actionHref || preset?.actionHref;

  const hasAction = displayActionLabel && (displayActionHref || onAction);

  return (
    <div className={`${styles.emptyState} ${styles[size]} ${className}`}>
      <div className={styles.iconWrapper}>
        <Icon className={styles.icon} />
      </div>
      <h3 className={styles.title}>{displayTitle}</h3>
      {displayDescription && (
        <p className={styles.description}>{displayDescription}</p>
      )}
      {hasAction && (
        displayActionHref ? (
          <Link href={displayActionHref} className={styles.actionButton}>
            {displayActionLabel}
          </Link>
        ) : (
          <button onClick={onAction} className={styles.actionButton}>
            {displayActionLabel}
          </button>
        )
      )}
    </div>
  );
}

// ============================================
// SPECIALIZED VARIANTS (for convenience)
// ============================================

export function NoResultsState(props: Omit<EmptyStateProps, 'variant'>) {
  return <EmptyState variant="no-results" {...props} />;
}

export function EmptyCartState(props: Omit<EmptyStateProps, 'variant'>) {
  return <EmptyState variant="empty-cart" {...props} />;
}

export function NoBookingsState(props: Omit<EmptyStateProps, 'variant'>) {
  return <EmptyState variant="no-bookings" {...props} />;
}

export function NoTripsState(props: Omit<EmptyStateProps, 'variant'>) {
  return <EmptyState variant="no-trips" {...props} />;
}

export function EmptyWishlistState(props: Omit<EmptyStateProps, 'variant'>) {
  return <EmptyState variant="empty-wishlist" {...props} />;
}

export function ErrorState(props: Omit<EmptyStateProps, 'variant'>) {
  return <EmptyState variant="error" {...props} />;
}

export default EmptyState;
