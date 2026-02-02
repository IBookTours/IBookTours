'use client';

import { useState, memo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Heart, Percent } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Hotel } from '@/types/hotel';
import styles from './HotelCard.module.scss';

interface HotelCardProps {
  hotel: Hotel;
}

function HotelCard({ hotel }: HotelCardProps) {
  const t = useTranslations('hotels');
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(prev => !prev);
  }, []);

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={hotel.image}
          alt={hotel.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        />
        <span className={styles.categoryBadge}>
          {t(`categories.${hotel.category}`)}
        </span>
        <span className={styles.starBadge}>
          <Star size={12} fill="currentColor" />
          {hotel.starRating} Star
        </span>
        {hotel.discountPercent && (
          <span className={styles.promoBadge}>
            <Percent size={12} />
            {hotel.discountPercent}% OFF
          </span>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.location}>
          <MapPin size={12} />
          {hotel.location}
        </div>

        <h3 className={styles.name}>{hotel.name}</h3>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            {hotel.reviewCount.toLocaleString()} {t('reviews')}
          </span>
          <span className={styles.rating}>
            <Star size={14} fill="currentColor" />
            {hotel.rating}
          </span>
        </div>

        {/* Highlights */}
        {hotel.highlights && hotel.highlights.length > 0 && (
          <ul className={styles.highlights}>
            {hotel.highlights.slice(0, 3).map((highlight, idx) => (
              <li key={idx}>{highlight}</li>
            ))}
          </ul>
        )}

        <div className={styles.footer}>
          <div className={styles.pricing}>
            <div>
              {hotel.originalPrice && (
                <span className={styles.originalPrice}>€{hotel.originalPrice}</span>
              )}
              <span className={styles.price}>€{hotel.priceFrom}</span>
            </div>
            <span className={styles.perNight}>/{t('perNight')}</span>
          </div>

          <div className={styles.actions}>
            <Link href={`/hotels/${hotel.slug}`} className={styles.viewBtn}>
              {t('viewDetails')}
            </Link>
            <button
              className={`${styles.favBtn} ${isFavorite ? styles.active : ''}`}
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// Memoize to prevent unnecessary re-renders when parent updates
export default memo(HotelCard, (prevProps, nextProps) => {
  return prevProps.hotel.id === nextProps.hotel.id;
});
