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
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { priceStringToCents } from '@/store/bookingStore';
import { useIsMobile, useSwipe } from '@/hooks';
import styles from './DayToursSection.module.scss';

export type TourCategory = 'all' | 'cultural' | 'adventure' | 'food' | 'nature';

export interface DayTour {
  id: string;
  name: string;
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
}

interface DayToursSectionProps {
  tours: DayTour[];
  showFilters?: boolean;
  maxDisplay?: number;
  showSlider?: boolean;
}

const categoryLabels: Record<TourCategory, string> = {
  all: 'All Tours',
  cultural: 'Cultural',
  adventure: 'Adventure',
  food: 'Food & Wine',
  nature: 'Nature',
};

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
  const [activeCategory, setActiveCategory] = useState<TourCategory>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const { addItem } = useCartStore();
  const isMobile = useIsMobile();

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

  // Get visible tours
  const visibleTours = canShowSlider
    ? filteredTours.slice(currentIndex, currentIndex + maxDisplay)
    : filteredTours.slice(0, maxDisplay);

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
  const renderTourCard = (tour: DayTour) => (
    <article key={tour.id} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={tour.image}
          alt={tour.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        />
        <span className={`${styles.categoryBadge} ${categoryColors[tour.category]}`}>
          {categoryLabels[tour.category]}
        </span>
        <span className={styles.durationBadge}>
          <Clock size={12} />
          {tour.duration}
        </span>
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
            {tour.groupSize.min}-{tour.groupSize.max} people
          </span>
          <span className={styles.rating}>
            <Star size={14} fill="currentColor" />
            {tour.rating}
          </span>
        </div>

        <div className={styles.footer}>
          <div className={styles.pricing}>
            <span className={styles.price}>{tour.pricePerPerson}</span>
            <span className={styles.perPerson}>/ person</span>
          </div>

          <div className={styles.actions}>
            <Link href={`/tours/${tour.id}`} className={styles.viewBtn}>
              View
            </Link>
            <button
              className={styles.cartBtn}
              onClick={() => handleAddToCart(tour)}
              aria-label="Add to cart"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.badge}>
              <Clock size={16} />
              Day Tours & Excursions
            </span>
            <h2 className={styles.title}>Explore Albania in a Day</h2>
            <p className={styles.subtitle}>
              Join our guided day trips and group tours. Perfect for travelers who want to see more in less time.
            </p>
          </div>

          {showFilters && (
            <div className={styles.filters}>
              <Filter size={16} className={styles.filterIcon} />
              {categories.map((category) => (
                <button
                  key={category}
                  className={`${styles.filterBtn} ${activeCategory === category ? styles.active : ''}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>
          )}
        </div>

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
                {visibleTours.map((tour) => renderTourCard(tour))}
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

        <div className={styles.cta}>
          <Link href="/tours" className={styles.ctaButton}>
            View All Day Tours
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
