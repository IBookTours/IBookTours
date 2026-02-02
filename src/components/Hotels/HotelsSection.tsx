'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, ChevronLeft, ChevronRight, Building2, Filter, Grid3X3 } from 'lucide-react';
import { hotels } from '@/data/hotelsData';
import { HotelCategory, HOTEL_CATEGORIES } from '@/types/hotel';
import HotelCard from './HotelCard';
import { useInView, useIsMobile, useIsTablet, useIsTouchDevice } from '@/hooks';
import { ANIMATION } from '@/lib/constants';
import styles from './HotelsSection.module.scss';

export default function HotelsSection() {
  const t = useTranslations('hotels');
  const [selectedCategory, setSelectedCategory] = useState<HotelCategory | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [desktopIndex, setDesktopIndex] = useState(0);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isTouchDevice = useIsTouchDevice();
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: ANIMATION.THRESHOLD_LIGHT,
    triggerOnce: true,
  });

  const filteredHotels = selectedCategory === 'all'
    ? hotels
    : hotels.filter(h => h.category === selectedCategory);

  // Desktop carousel settings - show 3 at a time + View All card
  const desktopItemsPerView = 3;
  const desktopMaxIndex = Math.max(0, filteredHotels.length - desktopItemsPerView);

  // Get display hotels for mobile/tablet (max 8)
  const displayHotels = filteredHotels.slice(0, 8);
  const totalSlides = displayHotels.length;

  // Get visible hotels for desktop slider
  const visibleDesktopHotels = filteredHotels.slice(desktopIndex, desktopIndex + desktopItemsPerView);

  // Total count for View All card
  const totalHotelsCount = filteredHotels.length;

  // View All promotional card
  const renderViewAllCard = (index: number = 0) => (
    <Link
      key="view-all"
      href="/hotels"
      className={`${styles.viewAllCard} ${isInView ? styles.visible : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className={styles.viewAllIcon}>
        <Grid3X3 />
      </div>
      <span className={styles.viewAllCount}>{totalHotelsCount}+</span>
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
  const handleCategoryChange = (category: HotelCategory | 'all') => {
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
              <Building2 size={20} />
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
            {HOTEL_CATEGORIES.map(cat => (
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
        {showNativeScroll && displayHotels.length > 0 && (
          <div className={styles.nativeScrollContainer}>
            {displayHotels.map((hotel) => (
              <div key={hotel.id} className={styles.nativeScrollCard}>
                <HotelCard hotel={hotel} />
              </div>
            ))}
            {/* View All card at the end */}
            <div className={styles.nativeScrollViewAll}>
              {renderViewAllCard(displayHotels.length)}
            </div>
          </div>
        )}

        {/* Mouse devices at small viewports: Carousel with arrows */}
        {showSmallScreenCarousel && displayHotels.length > 0 && (
          <div className={styles.carouselWrapper}>
            <button
              className={`${styles.carouselArrow} ${styles.prevArrow}`}
              onClick={handlePrev}
              aria-label="Previous hotel"
            >
              <ChevronLeft size={24} />
            </button>

            <div className={styles.carouselTrack}>
              <div
                className={styles.carouselSlides}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {displayHotels.map((hotel) => (
                  <div key={hotel.id} className={styles.carouselSlide}>
                    <HotelCard hotel={hotel} />
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`${styles.carouselArrow} ${styles.nextArrow}`}
              onClick={handleNext}
              aria-label="Next hotel"
            >
              <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className={styles.carouselDots}>
              {displayHotels.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === currentIndex ? styles.activeDot : ''}`}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to hotel ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Desktop: Grid with slider navigation */}
        {!isMobile && !isTablet && (
          <div className={styles.sliderWrapper}>
            {filteredHotels.length > desktopItemsPerView && (
              <button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={handleDesktopPrev}
                disabled={desktopIndex === 0}
                aria-label="Previous hotels"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div className={`${styles.grid} ${isInView ? styles.visible : ''}`}>
              {visibleDesktopHotels.map((hotel, index) => (
                <div key={hotel.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <HotelCard hotel={hotel} />
                </div>
              ))}
              {renderViewAllCard(visibleDesktopHotels.length)}
            </div>

            {filteredHotels.length > desktopItemsPerView && (
              <button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={handleDesktopNext}
                disabled={desktopIndex >= desktopMaxIndex}
                aria-label="Next hotels"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        )}

        {/* Desktop slider indicators */}
        {!isMobile && !isTablet && filteredHotels.length > desktopItemsPerView && (
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
