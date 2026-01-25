'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdventureContent } from '@/types';
import { useInView, useIsMobile, useSwipe } from '@/hooks';
import styles from './AdventureSection.module.scss';

interface AdventureSectionProps {
  content: AdventureContent;
}

export default function AdventureSection({ content }: AdventureSectionProps) {
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [mobileIndex, setMobileIndex] = useState(0);
  const isMobile = useIsMobile();

  const categories = content.categories;

  // Mobile navigation handlers
  const handleMobilePrev = useCallback(() => {
    setMobileIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  }, [categories.length]);

  const handleMobileNext = useCallback(() => {
    setMobileIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
  }, [categories.length]);

  // Swipe handlers for mobile
  const swipeHandlers = useSwipe(handleMobileNext, handleMobilePrev);

  // Render a category card
  const renderCategoryCard = (category: typeof categories[0], index: number, isFeatured: boolean = false) => (
    <div
      key={category.id}
      className={`${styles.category} ${isFeatured && !isMobile ? styles.categoryFeatured : ''} ${isInView ? styles.visible : ''}`}
      style={{ transitionDelay: isMobile ? '0s' : `${index * 0.1}s` }}
    >
      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes={isMobile ? '100vw' : '(max-width: 1024px) 50vw, 33vw'}
      />
      <div className={styles.categoryOverlay} />

      {category.count && (
        <span className={styles.categoryBadge}>
          {category.count} tours
        </span>
      )}

      <div className={styles.categoryContent}>
        <h3 className={styles.categoryName}>{category.name}</h3>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className={styles.section} id="tours">
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={`${styles.header} ${isInView ? styles.visible : ''}`}>
            <span className={styles.sectionLabel}>{content.sectionLabel}</span>
            <h2 className={styles.title}>{content.title}</h2>

            <div className={styles.ratingCard}>
              <div className={styles.ratingHeader}>
                <Star />
                <span className={styles.ratingValue}>{content.rating.value}</span>
              </div>
              <p className={styles.ratingLabel}>{content.rating.label}</p>
            </div>
          </div>

          {/* Mobile: Single card carousel with swipe */}
          {isMobile && categories.length > 0 && (
            <div className={styles.mobileWrapper}>
              <div className={styles.mobileCarousel} {...swipeHandlers}>
                <button
                  className={`${styles.mobileArrow} ${styles.mobilePrev}`}
                  onClick={handleMobilePrev}
                  aria-label="Previous category"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className={styles.mobileCard}>
                  {renderCategoryCard(categories[mobileIndex], mobileIndex, false)}
                </div>

                <button
                  className={`${styles.mobileArrow} ${styles.mobileNext}`}
                  onClick={handleMobileNext}
                  aria-label="Next category"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Mobile dots */}
              <div className={styles.mobileDots}>
                {categories.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.mobileDot} ${i === mobileIndex ? styles.activeDot : ''}`}
                    onClick={() => setMobileIndex(i)}
                    aria-label={`Go to category ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Desktop: Grid layout */}
          {!isMobile && (
            <div className={styles.categories}>
              {categories.map((category, index) => renderCategoryCard(category, index, index === 0))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
