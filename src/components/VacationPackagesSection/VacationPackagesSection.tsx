'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plane,
  Hotel,
  Calendar,
  MapPin,
  Star,
  ArrowRight,
  ShoppingCart,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { priceStringToCents } from '@/store/bookingStore';
import { useIsMobile, useSwipe } from '@/hooks';
import styles from './VacationPackagesSection.module.scss';

export interface VacationPackage {
  id: string;
  destination: string;
  location: string;
  departureCities: string[];
  hotelName: string;
  hotelRating: number;
  duration: string;
  nights: number;
  pricePerPerson: string;
  image: string;
  highlights: string[];
  includesFlights: boolean;
  includesHotel: boolean;
  rating: number;
  reviewCount: number;
}

interface VacationPackagesSectionProps {
  packages: VacationPackage[];
  maxDisplay?: number;
  showSlider?: boolean;
}

export default function VacationPackagesSection({
  packages,
  maxDisplay = 3,
  showSlider = true,
}: VacationPackagesSectionProps) {
  const { addItem } = useCartStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Calculate visible items and navigation
  const totalItems = packages.length;
  const canShowSlider = showSlider && totalItems > maxDisplay;
  const maxIndex = Math.max(0, totalItems - maxDisplay);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  // Mobile navigation handlers
  const handleMobilePrev = useCallback(() => {
    setMobileIndex((prev) => (prev === 0 ? packages.length - 1 : prev - 1));
  }, [packages.length]);

  const handleMobileNext = useCallback(() => {
    setMobileIndex((prev) => (prev === packages.length - 1 ? 0 : prev + 1));
  }, [packages.length]);

  // Swipe handlers for mobile
  const swipeHandlers = useSwipe(handleMobileNext, handleMobilePrev);

  const handleAddToCart = (pkg: VacationPackage) => {
    addItem({
      id: pkg.id,
      type: 'vacation-package',
      name: `${pkg.destination} - ${pkg.hotelName}`,
      image: pkg.image,
      duration: pkg.duration,
      location: pkg.location,
      basePrice: priceStringToCents(pkg.pricePerPerson),
      quantity: 1,
      date: '',
      travelers: { adults: 1, children: 0 },
      childDiscountPercent: 30,
      options: {
        hotelName: pkg.hotelName,
        includesFlights: pkg.includesFlights,
      },
    });
  };

  // Get visible packages
  const visiblePackages = canShowSlider
    ? packages.slice(currentIndex, currentIndex + maxDisplay)
    : packages.slice(0, maxDisplay);

  // Render a package card (reusable)
  const renderPackageCard = (pkg: VacationPackage) => (
    <article key={pkg.id} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={pkg.image}
          alt={pkg.destination}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className={styles.badges}>
          {pkg.includesFlights && (
            <span className={styles.includeBadge}>
              <Plane size={14} />
              Flights Included
            </span>
          )}
          {pkg.includesHotel && (
            <span className={styles.includeBadge}>
              <Hotel size={14} />
              Hotel Included
            </span>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.location}>
          <MapPin size={14} />
          {pkg.location}
        </div>

        <h3 className={styles.destination}>{pkg.destination}</h3>

        <div className={styles.hotelInfo}>
          <Hotel size={16} />
          <span>{pkg.hotelName}</span>
          <div className={styles.stars}>
            {Array.from({ length: pkg.hotelRating }).map((_, i) => (
              <Star key={i} size={12} fill="currentColor" />
            ))}
          </div>
        </div>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Calendar size={14} />
            {pkg.nights} nights
          </span>
          <span className={styles.metaItem}>
            <Users size={14} />
            From {pkg.departureCities[0]}
          </span>
        </div>

        <ul className={styles.highlights}>
          {pkg.highlights.slice(0, 3).map((highlight, index) => (
            <li key={index}>{highlight}</li>
          ))}
        </ul>

        <div className={styles.footer}>
          <div className={styles.pricing}>
            <span className={styles.price}>{pkg.pricePerPerson}</span>
            <span className={styles.perPerson}>per person</span>
          </div>

          <div className={styles.rating}>
            <Star size={14} fill="currentColor" />
            <span>{pkg.rating}</span>
            <span className={styles.reviews}>({pkg.reviewCount})</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href={`/tours/${pkg.id}`} className={styles.viewBtn}>
            View Details
            <ArrowRight size={16} />
          </Link>
          <button
            className={styles.cartBtn}
            onClick={() => handleAddToCart(pkg)}
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </article>
  );

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>
            <Plane size={16} />
            Flight + Hotel Packages
          </span>
          <h2 className={styles.title}>Vacation Packages</h2>
          <p className={styles.subtitle}>
            Complete holiday packages with flights and handpicked hotels. Everything you need for the perfect getaway.
          </p>
        </div>

        {/* Mobile: Single card carousel with swipe */}
        {isMobile && packages.length > 0 && (
          <>
            <div className={styles.mobileCarousel} {...swipeHandlers}>
              <button
                className={`${styles.mobileArrow} ${styles.mobilePrev}`}
                onClick={handleMobilePrev}
                aria-label="Previous package"
              >
                <ChevronLeft size={20} />
              </button>

              <div className={styles.mobileCard}>
                {renderPackageCard(packages[mobileIndex])}
              </div>

              <button
                className={`${styles.mobileArrow} ${styles.mobileNext}`}
                onClick={handleMobileNext}
                aria-label="Next package"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Mobile dots */}
            <div className={styles.mobileDots}>
              {packages.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.mobileDot} ${i === mobileIndex ? styles.activeDot : ''}`}
                  onClick={() => setMobileIndex(i)}
                  aria-label={`Go to package ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Desktop/Tablet: Grid with slider */}
        {!isMobile && (
          <>
            <div className={styles.sliderWrapper}>
              {canShowSlider && (
                <button
                  className={`${styles.navButton} ${styles.prevButton}`}
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  aria-label="Previous packages"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              <div
                className={`${styles.grid} ${canShowSlider ? styles.sliderGrid : ''}`}
                ref={sliderRef}
                style={
                  canShowSlider
                    ? {
                        '--visible-items': maxDisplay,
                      } as React.CSSProperties
                    : undefined
                }
              >
                {visiblePackages.map((pkg) => renderPackageCard(pkg))}
              </div>

              {canShowSlider && (
                <button
                  className={`${styles.navButton} ${styles.nextButton}`}
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex}
                  aria-label="Next packages"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            {/* Desktop slider indicators */}
            {canShowSlider && (
              <div className={styles.indicators}>
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.indicator} ${i === currentIndex ? styles.activeIndicator : ''}`}
                    onClick={() => setCurrentIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <div className={styles.cta}>
          <Link href="/tours?type=package" className={styles.ctaButton}>
            View All Packages
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
