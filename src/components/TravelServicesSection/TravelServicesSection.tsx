'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Calendar,
  Car,
  Users,
  ArrowRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
} from 'lucide-react';
import { isFeatureEnabled } from '@/lib/config/features';
import { useInView, useIsMobile, useIsTablet, useIsTouchDevice, useSwipe } from '@/hooks';
import { ANIMATION } from '@/lib/constants';
import styles from './TravelServicesSection.module.scss';

interface TravelService {
  id: string;
  featureKey: 'events' | 'airportTransfers' | 'localGuides';
  icon: React.ElementType;
  href: string;
  image: string;
}

const services: TravelService[] = [
  {
    id: 'events',
    featureKey: 'events',
    icon: Calendar,
    href: '/tours?category=events',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop&q=80',
  },
  {
    id: 'airportTransfers',
    featureKey: 'airportTransfers',
    icon: Car,
    href: '/contact?service=transfers',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop&q=80',
  },
  {
    id: 'localGuides',
    featureKey: 'localGuides',
    icon: Users,
    href: '/contact?service=guides',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&h=400&fit=crop&q=80',
  },
];

export default function TravelServicesSection() {
  const t = useTranslations('travelServices');
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: ANIMATION.THRESHOLD_LIGHT,
    triggerOnce: true,
  });

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isTouchDevice = useIsTouchDevice();
  const [mobileIndex, setMobileIndex] = useState(0);
  const [tabletIndex, setTabletIndex] = useState(0);
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always show all services on server, filter on client after mount
  const enabledServices = mounted
    ? services.filter((service) => isFeatureEnabled(service.featureKey))
    : services;

  // Check travelServices flag only after mount to avoid hydration mismatch
  const showSection = mounted ? isFeatureEnabled('travelServices') : true;

  // Touch devices get native scroll, mouse devices get carousel with arrows
  const showNativeScroll = isTouchDevice && (isMobile || isTablet);
  const showSmallScreenCarousel = !isTouchDevice && (isMobile || isTablet);

  // Total services count for View All card
  const totalServicesCount = enabledServices.length;

  // Desktop carousel settings - show 3 services + View All
  const desktopItemsPerView = 3;
  const desktopMaxIndex = Math.max(0, enabledServices.length - desktopItemsPerView);

  // Mobile navigation handlers
  const handleMobilePrev = useCallback(() => {
    setMobileIndex((prev) => (prev === 0 ? enabledServices.length - 1 : prev - 1));
  }, [enabledServices.length]);

  const handleMobileNext = useCallback(() => {
    setMobileIndex((prev) => (prev === enabledServices.length - 1 ? 0 : prev + 1));
  }, [enabledServices.length]);

  // Tablet navigation handlers - 2 cards per page
  const tabletMaxIndex = Math.max(0, Math.ceil(enabledServices.length / 2) - 1);
  const handleTabletPrev = useCallback(() => {
    setTabletIndex((prev) => (prev === 0 ? tabletMaxIndex : prev - 1));
  }, [tabletMaxIndex]);

  const handleTabletNext = useCallback(() => {
    setTabletIndex((prev) => (prev >= tabletMaxIndex ? 0 : prev + 1));
  }, [tabletMaxIndex]);

  // Desktop navigation handlers
  const handleDesktopPrev = useCallback(() => {
    setDesktopIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleDesktopNext = useCallback(() => {
    setDesktopIndex((prev) => Math.min(desktopMaxIndex, prev + 1));
  }, [desktopMaxIndex]);

  // Swipe handlers
  const mobileSwipeHandlers = useSwipe(handleMobileNext, handleMobilePrev);
  const tabletSwipeHandlers = useSwipe(handleTabletNext, handleTabletPrev);

  // Get visible services for desktop slider
  const visibleDesktopServices = enabledServices.slice(desktopIndex, desktopIndex + desktopItemsPerView);

  if (!showSection || enabledServices.length === 0) {
    return null;
  }

  // View All promotional card
  const renderViewAllCard = (index: number = 0) => (
    <Link
      key="view-all"
      href="/contact"
      className={`${styles.viewAllCard} ${isInView ? styles.visible : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className={styles.viewAllIcon}>
        <Grid3X3 />
      </div>
      <span className={styles.viewAllCount}>{totalServicesCount}+</span>
      <span className={styles.viewAllText}>{t('title')}</span>
      <span className={styles.viewAllSubtext}>{t('subtitle')}</span>
      <span className={styles.viewAllArrow}>
        {t('learnMore')}
        <ArrowRight />
      </span>
    </Link>
  );

  // Render service card
  const renderServiceCard = (service: TravelService, index: number = 0) => {
    const Icon = service.icon;
    return (
      <article
        key={service.id}
        className={`${styles.card} ${isInView ? styles.visible : ''}`}
        style={{ transitionDelay: `${index * 0.1}s` }}
      >
        <div className={styles.imageWrapper}>
          <Image
            src={service.image}
            alt={t(`services.${service.id}.title`)}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          />
          <span className={styles.categoryBadge}>
            {t('sectionLabel')}
          </span>
          <span className={styles.iconBadge}>
            <Icon size={16} />
          </span>
        </div>

        <div className={styles.content}>
          <div className={styles.serviceType}>
            <Icon size={12} />
            {t('sectionLabel')}
          </div>

          <h3 className={styles.name}>{t(`services.${service.id}.title`)}</h3>

          <p className={styles.description}>
            {t(`services.${service.id}.description`)}
          </p>

          <div className={styles.footer}>
            <div className={styles.actions}>
              <Link href={service.href} className={styles.viewBtn}>
                {t('learnMore')}
              </Link>
              <Link href={service.href} className={styles.contactBtn}>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.header} ${isInView ? styles.visible : ''}`}>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        {/* Touch devices (mobile/tablet): Native horizontal scroll */}
        {showNativeScroll && enabledServices.length > 0 && (
          <div className={styles.nativeScrollContainer}>
            {enabledServices.map((service, index) => (
              <div key={service.id} className={styles.nativeScrollCard}>
                {renderServiceCard(service, index)}
              </div>
            ))}
            {/* View All card at the end */}
            <div className={styles.nativeScrollViewAll}>
              {renderViewAllCard(enabledServices.length)}
            </div>
          </div>
        )}

        {/* Mouse devices on mobile: Single card carousel */}
        {showSmallScreenCarousel && isMobile && enabledServices.length > 0 && (
          <div className={styles.carouselWrapper}>
            <button
              className={`${styles.carouselArrow} ${styles.prevArrow}`}
              onClick={handleMobilePrev}
              aria-label="Previous service"
            >
              <ChevronLeft size={24} />
            </button>

            <div className={styles.carouselTrack} {...mobileSwipeHandlers}>
              <div
                className={styles.carouselSlides}
                style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
              >
                {enabledServices.map((service, index) => (
                  <div key={service.id} className={styles.carouselSlide}>
                    {renderServiceCard(service, index)}
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`${styles.carouselArrow} ${styles.nextArrow}`}
              onClick={handleMobileNext}
              aria-label="Next service"
            >
              <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className={styles.carouselDots}>
              {enabledServices.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === mobileIndex ? styles.activeDot : ''}`}
                  onClick={() => setMobileIndex(i)}
                  aria-label={`Go to service ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mouse devices on tablet: 2-card carousel */}
        {showSmallScreenCarousel && isTablet && enabledServices.length > 0 && (
          <div className={styles.carouselWrapper}>
            <button
              className={`${styles.carouselArrow} ${styles.prevArrow}`}
              onClick={handleTabletPrev}
              aria-label="Previous services"
            >
              <ChevronLeft size={24} />
            </button>

            <div className={styles.carouselTrack} {...tabletSwipeHandlers}>
              <div
                className={styles.carouselSlides}
                style={{ transform: `translateX(-${tabletIndex * 100}%)` }}
              >
                {Array.from({ length: tabletMaxIndex + 1 }).map((_, slideIndex) => (
                  <div key={slideIndex} className={styles.carouselSlide}>
                    <div className={styles.tabletGrid}>
                      {enabledServices.slice(slideIndex * 2, slideIndex * 2 + 2).map((service, idx) => (
                        <div key={service.id} className={styles.tabletCard}>
                          {renderServiceCard(service, idx)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`${styles.carouselArrow} ${styles.nextArrow}`}
              onClick={handleTabletNext}
              aria-label="Next services"
            >
              <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className={styles.carouselDots}>
              {Array.from({ length: tabletMaxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === tabletIndex ? styles.activeDot : ''}`}
                  onClick={() => setTabletIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Desktop: Grid with slider navigation (4 columns: 3 services + View All) */}
        {!isMobile && !isTablet && (
          <div className={styles.sliderWrapper}>
            {enabledServices.length > desktopItemsPerView && (
              <button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={handleDesktopPrev}
                disabled={desktopIndex === 0}
                aria-label="Previous services"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div className={`${styles.grid} ${isInView ? styles.visible : ''}`}>
              {visibleDesktopServices.map((service, index) => renderServiceCard(service, index))}
              {renderViewAllCard(visibleDesktopServices.length)}
            </div>

            {enabledServices.length > desktopItemsPerView && (
              <button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={handleDesktopNext}
                disabled={desktopIndex >= desktopMaxIndex}
                aria-label="Next services"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        )}

        {/* Desktop slider indicators */}
        {!isMobile && !isTablet && enabledServices.length > desktopItemsPerView && (
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
