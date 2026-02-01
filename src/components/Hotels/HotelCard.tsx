'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Star, Wifi, Car, UtensilsCrossed, Waves } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Hotel } from '@/types/hotel';
import styles from './HotelCard.module.scss';

interface HotelCardProps {
  hotel: Hotel;
  variant?: 'default' | 'featured' | 'compact';
}

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  parking: Car,
  restaurant: UtensilsCrossed,
  pool: Waves,
};

export default function HotelCard({ hotel, variant = 'default' }: HotelCardProps) {
  const t = useTranslations('hotels');
  const [isFavorite, setIsFavorite] = useState(false);

  const cardClasses = [
    styles.card,
    variant !== 'default' && styles[variant],
  ]
    .filter(Boolean)
    .join(' ');

  // Get first 4 amenities with icons
  const displayAmenities = hotel.amenities
    .filter(a => amenityIcons[a])
    .slice(0, 4);

  return (
    <article className={cardClasses}>
      <Link href={`/hotels/${hotel.slug}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            priority={variant === 'featured'}
            unoptimized={hotel.image.includes('unsplash.com')}
          />
          {hotel.featured && (
            <span className={styles.badge}>{t('featured')}</span>
          )}
          {hotel.discountPercent && (
            <span className={styles.discountBadge}>-{hotel.discountPercent}%</span>
          )}
          <button
            type="button"
            className={`${styles.favorite} ${isFavorite ? styles.active : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart />
          </button>
          <div className={styles.starRating} aria-label={`${hotel.starRating} star hotel`}>
            {Array.from({ length: hotel.starRating }).map((_, i) => (
              <Star key={i} className={styles.starIcon} aria-hidden="true" />
            ))}
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.location}>
              <MapPin aria-hidden="true" />
              {hotel.location}
            </span>
            <span className={styles.category}>{t(`categories.${hotel.category}`)}</span>
          </div>

          <h3 className={styles.name}>{hotel.name}</h3>
          <p className={styles.description}>{hotel.shortDescription}</p>

          {displayAmenities.length > 0 && (
            <div className={styles.amenities}>
              {displayAmenities.map((amenity) => {
                const Icon = amenityIcons[amenity];
                return (
                  <span key={amenity} className={styles.amenity} title={t(`amenityLabels.${amenity}`)}>
                    <Icon aria-hidden="true" />
                  </span>
                );
              })}
              {hotel.amenities.length > 4 && (
                <span className={styles.moreAmenities}>+{hotel.amenities.length - 4}</span>
              )}
            </div>
          )}

          <div className={styles.footer}>
            <div className={styles.rating} aria-label={`Rating: ${hotel.rating} out of 5`}>
              <Star aria-hidden="true" />
              <span>{hotel.rating}</span>
              <span className={styles.reviews}>
                ({hotel.reviewCount.toLocaleString()} {t('reviews')})
              </span>
            </div>

            <div className={styles.price}>
              <span className={styles.label}>{t('from')}</span>
              {hotel.originalPrice && (
                <span className={styles.originalPrice}>€{hotel.originalPrice}</span>
              )}
              <span className={styles.amount}>€{hotel.priceFrom}</span>
              <span className={styles.perNight}>/{t('perNight')}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
