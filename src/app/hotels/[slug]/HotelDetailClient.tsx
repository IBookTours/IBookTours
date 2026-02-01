'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  ArrowLeft,
  Star,
  MapPin,
  Check,
  Wifi,
  Car,
  UtensilsCrossed,
  Waves,
  Dumbbell,
  Sparkles,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Hotel } from '@/types/hotel';
import styles from './hotel-detail.module.scss';

interface Props {
  hotel: Hotel;
}

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  parking: Car,
  restaurant: UtensilsCrossed,
  pool: Waves,
  gym: Dumbbell,
  spa: Sparkles,
};

export default function HotelDetailClient({ hotel }: Props) {
  const t = useTranslations('hotels');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % hotel.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
  };

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className={styles.container}>
          <Link href="/hotels" className={styles.backLink}>
            <ArrowLeft size={18} />
            {t('backToHotels')}
          </Link>
        </div>
      </div>

      {/* Image Gallery */}
      <section className={styles.gallery}>
        <div className={styles.mainImage}>
          <Image
            src={hotel.images[activeImageIndex]}
            alt={`${hotel.name} - Image ${activeImageIndex + 1}`}
            fill
            priority
            sizes="100vw"
          />
          {hotel.images.length > 1 && (
            <>
              <button
                type="button"
                className={`${styles.galleryNav} ${styles.prev}`}
                onClick={prevImage}
                aria-label="Previous image"
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                className={`${styles.galleryNav} ${styles.next}`}
                onClick={nextImage}
                aria-label="Next image"
              >
                <ChevronRight />
              </button>
              <div className={styles.imageCounter}>
                {activeImageIndex + 1} / {hotel.images.length}
              </div>
            </>
          )}
        </div>
        {hotel.images.length > 1 && (
          <div className={styles.thumbnails}>
            {hotel.images.map((img, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.thumbnail} ${index === activeImageIndex ? styles.active : ''}`}
                onClick={() => setActiveImageIndex(index)}
              >
                <Image src={img} alt={`${hotel.name} thumbnail ${index + 1}`} fill sizes="100px" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Main Content */}
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Left Column - Details */}
          <div className={styles.details}>
            {/* Header */}
            <header className={styles.header}>
              <div className={styles.starRating} aria-label={`${hotel.starRating} star hotel`}>
                {Array.from({ length: hotel.starRating }).map((_, i) => (
                  <Star key={i} className={styles.starIcon} aria-hidden="true" />
                ))}
              </div>
              <span className={styles.category}>{t(`categories.${hotel.category}`)}</span>
              <h1 className={styles.title}>{hotel.name}</h1>
              <p className={styles.location}>
                <MapPin size={18} />
                {hotel.location}
              </p>
              <div className={styles.rating}>
                <Star className={styles.ratingIcon} />
                <span className={styles.ratingValue}>{hotel.rating}</span>
                <span className={styles.reviewCount}>
                  ({hotel.reviewCount} {t('reviews')})
                </span>
              </div>
            </header>

            {/* Description */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('about')}</h2>
              <div className={styles.description}>
                {hotel.description.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Highlights */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('highlights')}</h2>
              <ul className={styles.highlights}>
                {hotel.highlights.map((highlight, index) => (
                  <li key={index}>
                    <Check size={18} />
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>

            {/* Amenities */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('amenities')}</h2>
              <div className={styles.amenities}>
                {hotel.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || Check;
                  return (
                    <div key={amenity} className={styles.amenity}>
                      <Icon size={20} />
                      <span>{t(`amenityLabels.${amenity}`)}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Rooms */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('roomTypes.title')}</h2>
              <div className={styles.rooms}>
                {hotel.rooms.map((room) => (
                  <div key={room.id} className={styles.roomCard}>
                    <div className={styles.roomImage}>
                      <Image src={room.image} alt={room.name} fill sizes="200px" />
                    </div>
                    <div className={styles.roomContent}>
                      <h3 className={styles.roomName}>{room.name}</h3>
                      <p className={styles.roomDescription}>{room.description}</p>
                      <p className={styles.roomGuests}>
                        {t('maxGuests')}: {room.maxGuests}
                      </p>
                      <div className={styles.roomPrice}>
                        <span className={styles.roomPriceAmount}>€{room.pricePerNight}</span>
                        <span className={styles.roomPriceUnit}>/{t('perNight')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <aside className={styles.sidebar}>
            <div className={styles.bookingCard}>
              <div className={styles.priceHeader}>
                <span className={styles.priceLabel}>{t('from')}</span>
                {hotel.originalPrice && (
                  <span className={styles.originalPrice}>€{hotel.originalPrice}</span>
                )}
                <span className={styles.priceAmount}>€{hotel.priceFrom}</span>
                <span className={styles.priceUnit}>/{t('perNight')}</span>
              </div>

              {hotel.discountPercent && (
                <div className={styles.discountBadge}>
                  {t('save')} {hotel.discountPercent}%
                </div>
              )}

              <div className={styles.bookingInfo}>
                <p>{t('booking.contactToBook')}</p>
              </div>

              <div className={styles.contactButtons}>
                <a href="tel:+355123456789" className={styles.contactBtn}>
                  <Phone size={18} />
                  {t('booking.callUs')}
                </a>
                <a href="mailto:hotels@ibooktours.com" className={styles.contactBtnSecondary}>
                  <Mail size={18} />
                  {t('booking.emailUs')}
                </a>
              </div>

              <p className={styles.note}>{t('booking.note')}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
