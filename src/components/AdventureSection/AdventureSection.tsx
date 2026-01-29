'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ChevronLeft, ChevronRight, ArrowRight, MapPin, Route, Smile } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { AdventureContent } from '@/types';
import { useInView, useIsMobile, useIsTablet, useSwipe } from '@/hooks';
import { ANIMATION } from '@/lib/constants';
import styles from './AdventureSection.module.scss';

const statIcons: Record<string, React.ReactNode> = {
  'tours': <Route size={20} />,
  'destinations': <MapPin size={20} />,
  'satisfaction': <Smile size={20} />,
};

interface AdventureSectionProps {
  content: AdventureContent;
}

export default function AdventureSection({ content }: AdventureSectionProps) {
  const t = useTranslations('adventure');
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: ANIMATION.THRESHOLD_STANDARD,
    triggerOnce: true,
  });
  const [mobileIndex, setMobileIndex] = useState(0);
  const [tabletIndex, setTabletIndex] = useState(0);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const categories = content.categories;
  const otherCategories = categories.slice(1); // Cards 2-5 for tablet carousel

  // Mobile navigation handlers
  const handleMobilePrev = useCallback(() => {
    setMobileIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  }, [categories.length]);

  const handleMobileNext = useCallback(() => {
    setMobileIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
  }, [categories.length]);

  // Tablet carousel handlers (show 2 cards at a time)
  const tabletCardsPerView = 2;
  const tabletMaxIndex = Math.max(0, otherCategories.length - tabletCardsPerView);

  const handleTabletPrev = useCallback(() => {
    setTabletIndex((prev) => (prev === 0 ? tabletMaxIndex : prev - 1));
  }, [tabletMaxIndex]);

  const handleTabletNext = useCallback(() => {
    setTabletIndex((prev) => (prev >= tabletMaxIndex ? 0 : prev + 1));
  }, [tabletMaxIndex]);

  // Swipe handlers for mobile
  const swipeHandlers = useSwipe(handleMobileNext, handleMobilePrev);
  const tabletSwipeHandlers = useSwipe(handleTabletNext, handleTabletPrev);

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
          {category.count} {t('tours')}
        </span>
      )}

      <div className={styles.categoryContent}>
        <h3 className={styles.categoryName}>{category.name}</h3>
        {category.description && (
          <p className={styles.categoryDescription}>{category.description}</p>
        )}
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className={styles.section} id="tours">
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={`${styles.header} ${isInView ? styles.visible : ''}`}>
            <span className={styles.sectionLabel}>{t('sectionLabel')}</span>
            <h2 className={styles.title}>{t('title')}</h2>

            <p className={styles.description}>{t('description')}</p>

            {content.stats && content.stats.length > 0 && (
              <div className={styles.stats}>
                {content.stats.map((stat, index) => {
                  // Map stat labels to translation keys
                  const labelToKey: Record<string, string> = {
                    'Unique Tours': 'tours',
                    'Destinations': 'destinations',
                    'Happy Travelers': 'satisfaction',
                  };
                  const statKey = labelToKey[stat.label] || 'tours';
                  return (
                    <div key={index} className={styles.statItem}>
                      <span className={styles.statIcon}>
                        {statIcons[statKey] || <MapPin size={20} />}
                      </span>
                      <span className={styles.statValue}>{stat.value}</span>
                      <span className={styles.statLabel}>{t(`stats.${statKey}`)}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className={styles.ratingCard}>
              <div className={styles.ratingHeader}>
                <Star />
                <span className={styles.ratingValue}>{content.rating.value}</span>
              </div>
              <p className={styles.ratingLabel}>{t('ratingLabel')}</p>
            </div>

            {content.ctaLink && (
              <Link href={content.ctaLink} className={styles.ctaButton}>
                {t('cta')}
                <ArrowRight size={18} />
              </Link>
            )}
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

          {/* Tablet: Featured + Carousel Row */}
          {isTablet && !isMobile && categories.length > 0 && (
            <div className={styles.tabletWrapper}>
              {/* Featured card (full width, shorter) */}
              <div className={styles.tabletFeatured}>
                {renderCategoryCard(categories[0], 0, true)}
              </div>

              {/* Carousel row for other cards */}
              {otherCategories.length > 0 && (
                <div className={styles.tabletCarouselWrapper}>
                  <button
                    className={`${styles.tabletArrow} ${styles.tabletPrev}`}
                    onClick={handleTabletPrev}
                    disabled={tabletIndex === 0}
                    aria-label="Previous categories"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className={styles.tabletCarousel} {...tabletSwipeHandlers}>
                    {otherCategories.slice(tabletIndex, tabletIndex + tabletCardsPerView).map((category, idx) => (
                      <div key={category.id} className={styles.tabletCard}>
                        {renderCategoryCard(category, idx + 1, false)}
                      </div>
                    ))}
                  </div>

                  <button
                    className={`${styles.tabletArrow} ${styles.tabletNext}`}
                    onClick={handleTabletNext}
                    disabled={tabletIndex >= tabletMaxIndex}
                    aria-label="Next categories"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}

              {/* Tablet dots */}
              {otherCategories.length > tabletCardsPerView && (
                <div className={styles.tabletDots}>
                  {Array.from({ length: tabletMaxIndex + 1 }).map((_, i) => (
                    <button
                      key={i}
                      className={`${styles.tabletDot} ${i === tabletIndex ? styles.activeDot : ''}`}
                      onClick={() => setTabletIndex(i)}
                      aria-label={`Go to page ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Desktop: Grid layout */}
          {!isMobile && !isTablet && (
            <div className={styles.categories}>
              {categories.map((category, index) => renderCategoryCard(category, index, index === 0))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
