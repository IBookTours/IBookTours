'use client';

import { useState, memo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Car, Users, Fuel, Settings, ArrowRight, ChevronLeft, ChevronRight, Filter, Grid3X3 } from 'lucide-react';
import { carRentalVehicles } from '@/data/carRentalData';
import { CarRentalVehicle, VehicleCategory, VEHICLE_CATEGORIES } from '@/types/carRental';
import { useInView, useIsMobile, useIsTablet, useIsTouchDevice } from '@/hooks';
import { ANIMATION } from '@/lib/constants';
import styles from './CarRentalSection.module.scss';

export default function CarRentalSection() {
  const t = useTranslations('carRental');
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [desktopIndex, setDesktopIndex] = useState(0);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isTouchDevice = useIsTouchDevice();
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: ANIMATION.THRESHOLD_LIGHT,
    triggerOnce: true,
  });

  const filteredVehicles = selectedCategory === 'all'
    ? carRentalVehicles
    : carRentalVehicles.filter(v => v.category === selectedCategory);

  // Desktop carousel settings - show 3 at a time + View All card
  const desktopItemsPerView = 3;
  const desktopMaxIndex = Math.max(0, filteredVehicles.length - desktopItemsPerView);

  // Get display vehicles for mobile/tablet (max 4)
  const displayVehicles = filteredVehicles.slice(0, 8);
  const totalSlides = displayVehicles.length;

  // Get visible vehicles for desktop slider
  const visibleDesktopVehicles = filteredVehicles.slice(desktopIndex, desktopIndex + desktopItemsPerView);

  // Total count for View All card
  const totalVehiclesCount = filteredVehicles.length;

  // View All promotional card
  const renderViewAllCard = (index: number = 0) => (
    <Link
      key="view-all"
      href="/car-rental"
      className={`${styles.viewAllCard} ${isInView ? styles.visible : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className={styles.viewAllIcon}>
        <Grid3X3 />
      </div>
      <span className={styles.viewAllCount}>{totalVehiclesCount}+</span>
      <span className={styles.viewAllText}>{t('title')}</span>
      <span className={styles.viewAllSubtext}>{t('subtitle')}</span>
      <span className={styles.viewAllArrow}>
        {t('viewAll')}
        <ArrowRight />
      </span>
    </Link>
  );

  // Touch devices get native scroll, mouse devices get carousel with arrows
  const showNativeScroll = isTouchDevice && (isMobile || isTablet);
  const showSmallScreenCarousel = !isTouchDevice && (isMobile || isTablet);

  // Navigation handlers for mobile/tablet
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  // Desktop navigation handlers
  const handleDesktopPrev = useCallback(() => {
    setDesktopIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleDesktopNext = useCallback(() => {
    setDesktopIndex((prev) => Math.min(desktopMaxIndex, prev + 1));
  }, [desktopMaxIndex]);

  // Reset index when category changes
  const handleCategoryChange = (category: VehicleCategory | 'all') => {
    setSelectedCategory(category);
    setCurrentIndex(0);
    setDesktopIndex(0);
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.header} ${isInView ? styles.visible : ''}`}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelIcon}>
              <Car size={20} />
            </span>
            <span className={styles.labelText}>{t('sectionLabel')}</span>
          </div>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        {/* Category Filter */}
        <div className={`${styles.filtersWrapper} ${isInView ? styles.visible : ''}`}>
          <div className={styles.filters}>
            <Filter size={16} className={styles.filterIcon} />
            <button
              className={`${styles.filterBtn} ${selectedCategory === 'all' ? styles.active : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              {t('filters.all')}
            </button>
            {VEHICLE_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                className={`${styles.filterBtn} ${selectedCategory === cat.value ? styles.active : ''}`}
                onClick={() => handleCategoryChange(cat.value)}
              >
                {t(`categories.${cat.value}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Touch devices: Native horizontal scroll */}
        {showNativeScroll && displayVehicles.length > 0 && (
          <div className={styles.nativeScrollContainer}>
            {displayVehicles.map((vehicle, index) => (
              <div key={vehicle.id} className={styles.nativeScrollCard}>
                <VehicleCard vehicle={vehicle} index={index} t={t} />
              </div>
            ))}
            {/* View All card at the end */}
            <div className={styles.nativeScrollViewAll}>
              {renderViewAllCard(displayVehicles.length)}
            </div>
          </div>
        )}

        {/* Mouse devices at small viewports: Carousel with arrows */}
        {showSmallScreenCarousel && displayVehicles.length > 0 && (
          <div className={styles.carouselWrapper}>
            <button
              className={`${styles.carouselArrow} ${styles.prevArrow}`}
              onClick={handlePrev}
              aria-label="Previous vehicle"
            >
              <ChevronLeft size={24} />
            </button>

            <div className={styles.carouselTrack}>
              <div
                className={styles.carouselSlides}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {displayVehicles.map((vehicle, index) => (
                  <div key={vehicle.id} className={styles.carouselSlide}>
                    <VehicleCard vehicle={vehicle} index={index} t={t} />
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`${styles.carouselArrow} ${styles.nextArrow}`}
              onClick={handleNext}
              aria-label="Next vehicle"
            >
              <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className={styles.carouselDots}>
              {displayVehicles.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === currentIndex ? styles.activeDot : ''}`}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to vehicle ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Desktop: Grid with slider navigation */}
        {!isMobile && !isTablet && (
          <div className={styles.sliderWrapper}>
            {filteredVehicles.length > desktopItemsPerView && (
              <button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={handleDesktopPrev}
                disabled={desktopIndex === 0}
                aria-label="Previous vehicles"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div className={`${styles.grid} ${isInView ? styles.visible : ''}`}>
              {visibleDesktopVehicles.map((vehicle, index) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} t={t} />
              ))}
              {renderViewAllCard(visibleDesktopVehicles.length)}
            </div>

            {filteredVehicles.length > desktopItemsPerView && (
              <button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={handleDesktopNext}
                disabled={desktopIndex >= desktopMaxIndex}
                aria-label="Next vehicles"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        )}

        {/* Desktop slider indicators */}
        {!isMobile && !isTablet && filteredVehicles.length > desktopItemsPerView && (
          <div className={styles.indicators}>
            {Array.from({ length: desktopMaxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                className={`${styles.indicator} ${i === desktopIndex ? styles.activeIndicator : ''}`}
                onClick={() => setDesktopIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

interface VehicleCardProps {
  vehicle: CarRentalVehicle;
  index: number;
  t: ReturnType<typeof useTranslations<'carRental'>>;
}

// Memoized to prevent re-renders when filter changes don't affect this card
const VehicleCard = memo(function VehicleCard({ vehicle, index, t }: VehicleCardProps) {
  return (
    <article className={styles.card} style={{ animationDelay: `${index * 100}ms` }}>
      <div className={styles.imageWrapper}>
        {vehicle.image ? (
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <Car size={48} />
          </div>
        )}
        <span className={styles.categoryBadge}>{t(`categories.${vehicle.category}`)}</span>
        <span className={styles.seatsBadge}>
          <Users size={12} />
          {vehicle.seats} {t('seats')}
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.location}>
          <Settings size={12} />
          {t(vehicle.transmission)} • {t(vehicle.fuelType)}
        </div>

        <h3 className={styles.name}>{vehicle.name}</h3>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Fuel size={14} />
            {t(vehicle.fuelType)}
          </span>
          <span className={styles.rating}>
            {t(`categories.${vehicle.category}`)}
          </span>
        </div>

        {/* Features as highlights */}
        {vehicle.features && vehicle.features.length > 0 && (
          <ul className={styles.highlights}>
            {vehicle.features.slice(0, 3).map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        )}

        <div className={styles.footer}>
          <div className={styles.pricing}>
            <div>
              <span className={styles.price}>€{vehicle.pricePerDay}</span>
            </div>
            <span className={styles.perDay}>/{t('perDay')}</span>
          </div>

          <div className={styles.actions}>
            <Link href={`/car-rental/${vehicle.id}`} className={styles.viewBtn}>
              {t('viewDetails')}
            </Link>
            <Link href={`/car-rental/${vehicle.id}`} className={styles.bookBtn}>
              {t('bookNow')}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
});
