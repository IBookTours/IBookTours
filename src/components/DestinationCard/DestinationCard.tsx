'use client';

import { useState, memo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Star, ArrowRight } from 'lucide-react';
import { Destination } from '@/types';
import styles from './DestinationCard.module.scss';

interface DestinationCardProps {
  destination: Destination;
  variant?: 'default' | 'horizontal' | 'featured' | 'mini';
  showCta?: boolean;
}

function DestinationCard({
  destination,
  variant = 'default',
  showCta = false,
}: DestinationCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = useCallback(() => {
    setIsFavorite(prev => !prev);
  }, []);

  const cardClasses = [
    styles.card,
    variant !== 'default' && styles[variant],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={cardClasses}>
      <div className={styles.imageWrapper}>
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {destination.featured && (
          <span className={styles.badge}>Featured</span>
        )}
        <button
          className={`${styles.favorite} ${isFavorite ? styles.active : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart />
        </button>
      </div>

      <div className={styles.content}>
        <span className={styles.location}>
          <MapPin />
          {destination.location}
        </span>
        <h3 className={styles.name}>{destination.name}</h3>
        <p className={styles.description}>{destination.description}</p>

        <div className={styles.footer}>
          {destination.rating && (
            <div className={styles.rating} aria-label={`Rating: ${destination.rating} out of 5 stars${destination.reviewCount ? `, ${destination.reviewCount.toLocaleString()} reviews` : ''}`}>
              <Star aria-hidden="true" />
              <span>{destination.rating}</span>
              {destination.reviewCount && (
                <span className={styles.reviews}>
                  ({destination.reviewCount.toLocaleString()})
                </span>
              )}
            </div>
          )}

          {showCta ? (
            <Link
              href={`/tours?search=${encodeURIComponent(destination.name)}`}
              className={styles.cta}
            >
              Explore
              <ArrowRight />
            </Link>
          ) : (
            destination.price && (
              <div className={styles.price}>
                <span className={styles.label}>From</span>
                <span className={styles.amount}>{destination.price}</span>
              </div>
            )
          )}
        </div>
      </div>
    </article>
  );
}

// Memoize to prevent unnecessary re-renders when parent updates
export default memo(DestinationCard, (prevProps, nextProps) => {
  return (
    prevProps.destination.id === nextProps.destination.id &&
    prevProps.variant === nextProps.variant &&
    prevProps.showCta === nextProps.showCta
  );
});
