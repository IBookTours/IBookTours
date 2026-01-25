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
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/store/cartStore';
import { priceStringToCents } from '@/store/bookingStore';
import { useIsMobile, useIsTablet, useSwipe, useInView } from '@/hooks';
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
  const t = useTranslations('vacationPackages');
  const { addItem } = useCartStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [tabletIndex, setTabletIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

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

  // Mobile navigation handlers - navigate by slides (2 cards per slide)
  const totalSlides = Math.ceil(packages.length / 2);

  const handleMobilePrev = useCallback(() => {
    setMobileIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  const handleMobileNext = useCallback(() => {
    setMobileIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  // Tablet navigation handlers - single card per slide
  const handleTabletPrev = useCallback(() => {
    setTabletIndex((prev) => (prev === 0 ? packages.length - 1 : prev - 1));
  }, [packages.length]);

  const handleTabletNext = useCallback(() => {
    setTabletIndex((prev) => (prev === packages.length - 1 ? 0 : prev + 1));
  }, [packages.length]);

  // Swipe handlers for mobile
  const swipeHandlers = useSwipe(handleMobileNext, handleMobilePrev);

  // Swipe handlers for tablet
  const tabletSwipeHandlers = useSwipe(handleTabletNext, handleTabletPrev);

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
  const renderPackageCard = (pkg: VacationPackage, index: number = 0) => (
    <article
      key={pkg.id}
      className={`${styles.card} ${isInView ? styles.visible : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
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
              {t('flightsIncluded')}
            </span>
          )}
          {pkg.includesHotel && (
            <span className={styles.includeBadge}>
              <Hotel size={14} />
              {t('hotelIncluded')}
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
            {pkg.nights} {t('nights')}
          </span>
          <span className={styles.metaItem}>
            <Users size={14} />
            {pkg.departureCities[0]}
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
            {t('viewDetails')}
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
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.header} ${isInView ? styles.visible : ''}`}>
          <span className={styles.badge}>
            <Plane size={16} />
            {t('sectionLabel')}
          </span>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>
            {t('subtitle')}
          </p>
        </div>

        {/* Mobile: 2-column horizontal scroll with arrows */}
        {isMobile && packages.length > 0 && (
          <div className={styles.mobileCarouselWrapper}>
            <button
              className={`${styles.mobileArrow} ${styles.mobilePrev}`}
              onClick={handleMobilePrev}
              aria-label="Previous packages"
            >
              <ChevronLeft size={20} />
            </button>

            <div
              className={styles.mobileCarousel}
              ref={sliderRef}
              {...swipeHandlers}
            >
              <div
                className={styles.mobileTrack}
                style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
              >
                {/* Group packages in pairs */}
                {Array.from({ length: Math.ceil(packages.length / 2) }).map((_, slideIndex) => (
                  <div key={slideIndex} className={styles.mobileSlide}>
                    {packages.slice(slideIndex * 2, slideIndex * 2 + 2).map((pkg) => (
                      <div key={pkg.id} className={styles.mobileCardWrapper}>
                        {renderPackageCard(pkg)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`${styles.mobileArrow} ${styles.mobileNext}`}
              onClick={handleMobileNext}
              aria-label="Next packages"
            >
              <ChevronRight size={20} />
            </button>

            {/* Mobile dots - one per slide (2 cards per slide) */}
            <div className={styles.mobileDots}>
              {Array.from({ length: Math.ceil(packages.length / 2) }).map((_, i) => (
                <button
                  key={i}
                  className={`${styles.mobileDot} ${i === mobileIndex ? styles.activeDot : ''}`}
                  onClick={() => setMobileIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tablet: Single card carousel */}
        {!isMobile && isTablet && packages.length > 0 && (
          <div className={styles.tabletCarouselWrapper}>
            <button
              className={`${styles.tabletArrow} ${styles.tabletPrev}`}
              onClick={handleTabletPrev}
              aria-label="Previous package"
            >
              <ChevronLeft size={24} />
            </button>

            <div className={styles.tabletCarousel} {...tabletSwipeHandlers}>
              <div
                className={styles.tabletTrack}
                style={{ transform: `translateX(-${tabletIndex * 100}%)` }}
              >
                {packages.map((pkg) => (
                  <div key={pkg.id} className={styles.tabletSlide}>
                    {renderPackageCard(pkg)}
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`${styles.tabletArrow} ${styles.tabletNext}`}
              onClick={handleTabletNext}
              aria-label="Next package"
            >
              <ChevronRight size={24} />
            </button>

            {/* Tablet dots */}
            <div className={styles.tabletDots}>
              {packages.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.tabletDot} ${i === tabletIndex ? styles.activeDot : ''}`}
                  onClick={() => setTabletIndex(i)}
                  aria-label={`Go to package ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Desktop: Grid with slider */}
        {!isMobile && !isTablet && (
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
                {visiblePackages.map((pkg, index) => renderPackageCard(pkg, index))}
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
            {t('viewAll')}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
