'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
  Sparkles,
  Percent,
  Clock,
  TrendingUp,
  Grid3X3,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/store/cartStore';
import { priceStringToCents } from '@/store/bookingStore';
import { useIsMobile, useIsTablet, useSwipe, useInView } from '@/hooks';
import styles from './VacationPackagesSection.module.scss';

type PromoBadgeType = 'limitedTime' | 'discount' | 'featured' | 'popular';

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
  promoBadge?: PromoBadgeType;
  discountPercent?: number;
  originalPrice?: string;
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
  // Medium screen carousel index (for 2-column carousel on md-lg screens)
  const [mediumIndex, setMediumIndex] = useState(0);
  // Check if we're on a medium-sized screen (between md and xl breakpoints)
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  // Check for medium screen (between 1024px and 1280px) - uses 2-column carousel
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMediumScreen(width >= 1024 && width < 1280);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  // Mobile navigation handlers - single card per slide (matching Day Tours)
  const handleMobilePrev = useCallback(() => {
    setMobileIndex((prev) => (prev === 0 ? packages.length - 1 : prev - 1));
  }, [packages.length]);

  const handleMobileNext = useCallback(() => {
    setMobileIndex((prev) => (prev === packages.length - 1 ? 0 : prev + 1));
  }, [packages.length]);

  // Tablet navigation handlers - single card per slide
  const handleTabletPrev = useCallback(() => {
    setTabletIndex((prev) => (prev === 0 ? packages.length - 1 : prev - 1));
  }, [packages.length]);

  const handleTabletNext = useCallback(() => {
    setTabletIndex((prev) => (prev === packages.length - 1 ? 0 : prev + 1));
  }, [packages.length]);

  // Medium screen navigation handlers - shows 2 cards at a time
  const mediumMaxIndex = Math.max(0, Math.ceil(packages.length / 2) - 1);
  const handleMediumPrev = useCallback(() => {
    setMediumIndex((prev) => (prev === 0 ? mediumMaxIndex : prev - 1));
  }, [mediumMaxIndex]);

  const handleMediumNext = useCallback(() => {
    setMediumIndex((prev) => (prev >= mediumMaxIndex ? 0 : prev + 1));
  }, [mediumMaxIndex]);

  // Swipe handlers for mobile
  const swipeHandlers = useSwipe(handleMobileNext, handleMobilePrev);

  // Swipe handlers for tablet
  const tabletSwipeHandlers = useSwipe(handleTabletNext, handleTabletPrev);

  // Swipe handlers for medium screens
  const mediumSwipeHandlers = useSwipe(handleMediumNext, handleMediumPrev);

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

  // Get visible packages (show only 3, reserve 4th slot for View All)
  const displayLimit = maxDisplay > 3 ? 3 : maxDisplay;
  const visiblePackages = canShowSlider
    ? packages.slice(currentIndex, currentIndex + displayLimit)
    : packages.slice(0, displayLimit);

  // Total packages count for View All card
  const totalPackagesCount = packages.length;

  // Promotional badge renderer
  const renderPromoBadge = (pkg: VacationPackage) => {
    if (!pkg.promoBadge) return null;

    const badgeConfig = {
      popular: { icon: TrendingUp, label: t('badges.popular'), className: styles.badgePopular },
      discount: { icon: Percent, label: `${pkg.discountPercent || 0}% OFF`, className: styles.badgeDiscount },
      featured: { icon: Sparkles, label: t('badges.featured'), className: styles.badgeFeatured },
      limitedTime: { icon: Clock, label: t('badges.limitedTime'), className: styles.badgeLimitedTime },
    };

    const config = badgeConfig[pkg.promoBadge];
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
      href="/tours?type=package"
      className={`${styles.viewAllCard} ${isInView ? styles.visible : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className={styles.viewAllIcon}>
        <Grid3X3 />
      </div>
      <span className={styles.viewAllCount}>{totalPackagesCount}+</span>
      <span className={styles.viewAllText}>{t('viewAllTitle')}</span>
      <span className={styles.viewAllSubtext}>{t('viewAllSubtext')}</span>
      <span className={styles.viewAllArrow}>
        {t('exploreAll')}
        <ArrowRight />
      </span>
    </Link>
  );

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
        {renderPromoBadge(pkg)}
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
            <div>
              {pkg.originalPrice && (
                <span className={styles.originalPrice}>{pkg.originalPrice}</span>
              )}
              <span className={styles.price}>{pkg.pricePerPerson}</span>
            </div>
            <span className={styles.perPerson}>{t('perPerson')}</span>
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
            aria-label={t('addToCart')}
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

        {/* Mobile: Single card carousel with swipe (matching Day Tours) */}
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

        {/* Medium screens: 2-column carousel (1024-1280px) */}
        {!isMobile && !isTablet && isMediumScreen && packages.length > 0 && (
          <div className={styles.mediumCarouselWrapper}>
            <button
              className={`${styles.tabletArrow} ${styles.tabletPrev}`}
              onClick={handleMediumPrev}
              aria-label="Previous packages"
            >
              <ChevronLeft size={24} />
            </button>

            <div className={styles.mediumCarousel} {...mediumSwipeHandlers}>
              <div
                className={styles.mediumTrack}
                style={{ transform: `translateX(-${mediumIndex * 100}%)` }}
              >
                {/* Group packages in pairs for 2-column display */}
                {Array.from({ length: Math.ceil(packages.length / 2) }).map((_, slideIndex) => (
                  <div key={slideIndex} className={styles.mediumSlide}>
                    {packages.slice(slideIndex * 2, slideIndex * 2 + 2).map((pkg, idx) => (
                      <div key={pkg.id} className={styles.mediumCard}>
                        {renderPackageCard(pkg, idx)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`${styles.tabletArrow} ${styles.tabletNext}`}
              onClick={handleMediumNext}
              aria-label="Next packages"
            >
              <ChevronRight size={24} />
            </button>

            {/* Medium carousel dots */}
            <div className={styles.tabletDots}>
              {Array.from({ length: Math.ceil(packages.length / 2) }).map((_, i) => (
                <button
                  key={i}
                  className={`${styles.tabletDot} ${i === mediumIndex ? styles.activeDot : ''}`}
                  onClick={() => setMediumIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Desktop: Grid with slider (1280px+) */}
        {!isMobile && !isTablet && !isMediumScreen && (
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
                {maxDisplay >= 4 && renderViewAllCard(visiblePackages.length)}
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

      </div>
    </section>
  );
}
