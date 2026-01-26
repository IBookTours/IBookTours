'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock,
  Users,
  MapPin,
  Star,
  ArrowRight,
  ShoppingCart,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Percent,
  TrendingUp,
  Grid3X3,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/store/cartStore';
import { priceStringToCents } from '@/store/bookingStore';
import { useIsMobile, useSwipe, useInView } from '@/hooks';
import styles from './DayToursSection.module.scss';

export type TourCategory = 'all' | 'cultural' | 'adventure' | 'food' | 'nature';
type PromoBadgeType = 'limitedTime' | 'discount' | 'featured' | 'popular';

export interface DayTour {
  id: string;
  name: string;
  description?: string;
  duration: string;
  location: string;
  departsFrom: string;
  groupSize: { min: number; max: number };
  pricePerPerson: string;
  category: TourCategory;
  image: string;
  rating: number;
  reviewCount: number;
  highlights: string[];
  promoBadge?: PromoBadgeType;
  discountPercent?: number;
  originalPrice?: string;
}

interface DayToursSectionProps {
  tours: DayTour[];
  showFilters?: boolean;
  maxDisplay?: number;
  showSlider?: boolean;
}

const categoryColors: Record<TourCategory, string> = {
  all: '',
  cultural: styles.cultural,
  adventure: styles.adventure,
  food: styles.food,
  nature: styles.nature,
};

export default function DayToursSection({
  tours,
  showFilters = true,
  maxDisplay = 3,
  showSlider = true,
}: DayToursSectionProps) {
  const t = useTranslations('dayTours');
  const tTours = useTranslations('tours');
  const [activeCategory, setActiveCategory] = useState<TourCategory>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const { addItem } = useCartStore();
  const isMobile = useIsMobile();
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  const filteredTours = tours.filter(
    (tour) => activeCategory === 'all' || tour.category === activeCategory
  );

  // Mobile navigation handlers
  const handleMobilePrev = useCallback(() => {
    setMobileIndex((prev) => (prev === 0 ? filteredTours.length - 1 : prev - 1));
  }, [filteredTours.length]);

  const handleMobileNext = useCallback(() => {
    setMobileIndex((prev) => (prev === filteredTours.length - 1 ? 0 : prev + 1));
  }, [filteredTours.length]);

  // Swipe handlers for mobile
  const swipeHandlers = useSwipe(handleMobileNext, handleMobilePrev);

  // Calculate visible items and navigation
  const totalItems = filteredTours.length;
  const canShowSlider = showSlider && totalItems > maxDisplay;
  const maxIndex = Math.max(0, totalItems - maxDisplay);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  // Reset index when category changes
  const handleCategoryChange = (category: TourCategory) => {
    setActiveCategory(category);
    setCurrentIndex(0);
    setMobileIndex(0);
  };

  // Get visible tours (show only 3, reserve 4th slot for View All on desktop)
  const displayLimit = !isMobile && maxDisplay >= 4 ? 3 : maxDisplay;
  const visibleTours = canShowSlider
    ? filteredTours.slice(currentIndex, currentIndex + displayLimit)
    : filteredTours.slice(0, displayLimit);

  // Total tours count for View All card
  const totalToursCount = tours.length;

  // Promotional badge renderer
  const renderPromoBadge = (tour: DayTour) => {
    if (!tour.promoBadge) return null;

    const badgeConfig = {
      popular: { icon: TrendingUp, label: t('badges.popular'), className: styles.badgePopular },
      discount: { icon: Percent, label: `${tour.discountPercent || 0}% OFF`, className: styles.badgeDiscount },
      featured: { icon: Sparkles, label: t('badges.featured'), className: styles.badgeFeatured },
      limitedTime: { icon: Clock, label: t('badges.limitedTime'), className: styles.badgeLimitedTime },
    };

    const config = badgeConfig[tour.promoBadge];
    const Icon = config.icon;

    return (
      <span className={`${styles.promoBadge} ${config.className}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  // View All promotional card
  const renderViewAllCard = (index: number = 0) => (
    <Link
      key="view-all"
      href="/tours?type=day-tours"
      className={`${styles.viewAllCard} ${isInView ? styles.visible : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className={styles.viewAllIcon}>
        <Grid3X3 />
      </div>
      <span className={styles.viewAllCount}>{totalToursCount}+</span>
      <span className={styles.viewAllText}>{t('viewAllTitle')}</span>
      <span className={styles.viewAllSubtext}>{t('viewAllSubtext')}</span>
      <span className={styles.viewAllArrow}>
        {t('exploreAll')}
        <ArrowRight />
      </span>
    </Link>
  );

  const handleAddToCart = (tour: DayTour) => {
    addItem({
      id: tour.id,
      type: 'day-tour',
      name: tour.name,
      image: tour.image,
      duration: tour.duration,
      location: tour.location,
      basePrice: priceStringToCents(tour.pricePerPerson),
      quantity: 1,
      date: '',
      travelers: { adults: 1, children: 0 },
      childDiscountPercent: 50,
    });
  };

  const categories: TourCategory[] = ['all', 'cultural', 'adventure', 'food', 'nature'];

  // Render a tour card (reusable)
  const renderTourCard = (tour: DayTour, index: number = 0) => (
    <article
      key={tour.id}
      className={`${styles.card} ${isInView ? styles.visible : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={tour.image}
          alt={tour.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        />
        <span className={`${styles.categoryBadge} ${categoryColors[tour.category]}`}>
          {tTours(`filters.${tour.category}`)}
        </span>
        <span className={styles.durationBadge}>
          <Clock size={12} />
          {tour.duration}
        </span>
        {renderPromoBadge(tour)}
      </div>

      <div className={styles.content}>
        <div className={styles.location}>
          <MapPin size={12} />
          {tour.departsFrom}
        </div>

        <h3 className={styles.name}>{tour.name}</h3>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Users size={14} />
            {tour.groupSize.min}-{tour.groupSize.max} {t('people')}
          </span>
          <span className={styles.rating}>
            <Star size={14} fill="currentColor" />
            {tour.rating}
          </span>
        </div>

        {/* Highlights list */}
        {tour.highlights && tour.highlights.length > 0 && (
          <ul className={styles.highlights}>
            {tour.highlights.slice(0, 3).map((highlight, idx) => (
              <li key={idx}>{highlight}</li>
            ))}
          </ul>
        )}

        <div className={styles.footer}>
          <div className={styles.pricing}>
            <div>
              {tour.originalPrice && (
                <span className={styles.originalPrice}>{tour.originalPrice}</span>
              )}
              <span className={styles.price}>{tour.pricePerPerson}</span>
            </div>
            <span className={styles.perPerson}>{t('perPerson')}</span>
          </div>

          <div className={styles.actions}>
            <Link href={`/tours/${tour.id}`} className={styles.viewBtn}>
              {t('view')}
            </Link>
            <button
              className={styles.cartBtn}
              onClick={() => handleAddToCart(tour)}
              aria-label={t('addToCart')}
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.header} ${isInView ? styles.visible : ''}`}>
          <span className={styles.badge}>
            <Clock size={16} />
            {t('sectionLabel')}
          </span>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>
            {t('subtitle')}
          </p>
        </div>

        {showFilters && (
          <div className={`${styles.filtersWrapper} ${isInView ? styles.visible : ''}`}>
            <div className={styles.filters}>
              <Filter size={16} className={styles.filterIcon} />
              {categories.map((category) => (
                <button
                  key={category}
                  className={`${styles.filterBtn} ${activeCategory === category ? styles.active : ''}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {tTours(`filters.${category}`)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile: Single card carousel with swipe */}
        {isMobile && filteredTours.length > 0 && (
          <>
            <div className={styles.mobileCarousel} {...swipeHandlers}>
              <button
                className={`${styles.mobileArrow} ${styles.mobilePrev}`}
                onClick={handleMobilePrev}
                aria-label="Previous tour"
              >
                <ChevronLeft size={20} />
              </button>

              <div className={styles.mobileCard}>
                {renderTourCard(filteredTours[mobileIndex])}
              </div>

              <button
                className={`${styles.mobileArrow} ${styles.mobileNext}`}
                onClick={handleMobileNext}
                aria-label="Next tour"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Mobile dots */}
            <div className={styles.mobileDots}>
              {filteredTours.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.mobileDot} ${i === mobileIndex ? styles.activeDot : ''}`}
                  onClick={() => setMobileIndex(i)}
                  aria-label={`Go to tour ${i + 1}`}
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
                  aria-label="Previous tours"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              <div
                className={`${styles.grid} ${canShowSlider ? styles.sliderGrid : ''}`}
                style={
                  canShowSlider
                    ? {
                        '--visible-items': maxDisplay,
                      } as React.CSSProperties
                    : undefined
                }
              >
                {visibleTours.map((tour, index) => renderTourCard(tour, index))}
                {maxDisplay >= 4 && renderViewAllCard(visibleTours.length)}
              </div>

              {canShowSlider && (
                <button
                  className={`${styles.navButton} ${styles.nextButton}`}
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex}
                  aria-label="Next tours"
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

      </div>
    </section>
  );
}
