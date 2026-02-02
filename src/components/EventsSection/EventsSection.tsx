'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Calendar,
  Grid3X3,
  Ticket,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { EventsContent, Event } from '@/types';
import { useInView, useIsMobile, useIsTablet, useIsTouchDevice, useSwipe } from '@/hooks';
import { ANIMATION } from '@/lib/constants';
import styles from './EventsSection.module.scss';

interface EventsSectionProps {
  content: EventsContent;
}

export default function EventsSection({ content }: EventsSectionProps) {
  const t = useTranslations('events');
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: ANIMATION.THRESHOLD_MEDIUM,
    triggerOnce: true,
  });

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isTouchDevice = useIsTouchDevice();
  const [mobileIndex, setMobileIndex] = useState(0);
  const [tabletIndex, setTabletIndex] = useState(0);
  const [desktopIndex, setDesktopIndex] = useState(0);

  const events = content.events;
  const totalEventsCount = events.length;

  // Touch devices get native scroll, mouse devices get carousel with arrows
  const showNativeScroll = isTouchDevice && (isMobile || isTablet);
  const showSmallScreenCarousel = !isTouchDevice && (isMobile || isTablet);

  // Desktop carousel settings - show 3 events + View All
  const desktopItemsPerView = 3;
  const desktopMaxIndex = Math.max(0, events.length - desktopItemsPerView);

  // Mobile navigation handlers
  const handleMobilePrev = useCallback(() => {
    setMobileIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  }, [events.length]);

  const handleMobileNext = useCallback(() => {
    setMobileIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  }, [events.length]);

  // Tablet navigation handlers - 2 cards per page
  const tabletMaxIndex = Math.max(0, Math.ceil(events.length / 2) - 1);
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

  // Get visible events for desktop slider
  const visibleDesktopEvents = events.slice(desktopIndex, desktopIndex + desktopItemsPerView);

  // View All promotional card
  const renderViewAllCard = (index: number = 0) => (
    <Link
      key="view-all"
      href="/tours?type=events"
      className={`${styles.viewAllCard} ${isInView ? styles.visible : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className={styles.viewAllIcon}>
        <Grid3X3 />
      </div>
      <span className={styles.viewAllCount}>{totalEventsCount}+</span>
      <span className={styles.viewAllText}>{t('viewAll')}</span>
      <span className={styles.viewAllSubtext}>{t('learnMore')}</span>
      <span className={styles.viewAllArrow}>
        {t('viewAll')}
        <ArrowRight />
      </span>
    </Link>
  );

  // Render event card
  const renderEventCard = (event: Event, index: number = 0) => (
    <article
      key={event.id}
      className={`${styles.card} ${isInView ? styles.visible : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        />
        <span className={styles.categoryBadge}>
          {t('sectionLabel')}
        </span>
        {event.date && (
          <span className={styles.dateBadge}>
            <Calendar size={12} />
            {event.date}
          </span>
        )}
      </div>

      <div className={styles.content}>
        {event.location && (
          <div className={styles.location}>
            <MapPin size={12} />
            {event.location}
          </div>
        )}

        <h3 className={styles.name}>{event.title}</h3>

        <p className={styles.description}>{event.description}</p>

        <div className={styles.footer}>
          <div className={styles.actions}>
            <Link href={event.href || '/tours'} className={styles.viewBtn}>
              {t('learnMore')}
            </Link>
            <Link href={event.href || '/tours'} className={styles.ticketBtn}>
              <Ticket size={16} />
              {t('getTickets')}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.header} ${isInView ? styles.visible : ''}`}>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        {/* Touch devices (mobile/tablet): Native horizontal scroll */}
        {showNativeScroll && events.length > 0 && (
          <div className={styles.nativeScrollContainer}>
            {events.map((event, index) => (
              <div key={event.id} className={styles.nativeScrollCard}>
                {renderEventCard(event, index)}
              </div>
            ))}
            {/* View All card at the end */}
            <div className={styles.nativeScrollViewAll}>
              {renderViewAllCard(events.length)}
            </div>
          </div>
        )}

        {/* Mouse devices on mobile: Single card carousel */}
        {showSmallScreenCarousel && isMobile && events.length > 0 && (
          <div className={styles.carouselWrapper}>
            <button
              className={`${styles.carouselArrow} ${styles.prevArrow}`}
              onClick={handleMobilePrev}
              aria-label="Previous event"
            >
              <ChevronLeft size={24} />
            </button>

            <div className={styles.carouselTrack} {...mobileSwipeHandlers}>
              <div
                className={styles.carouselSlides}
                style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
              >
                {events.map((event, index) => (
                  <div key={event.id} className={styles.carouselSlide}>
                    {renderEventCard(event, index)}
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`${styles.carouselArrow} ${styles.nextArrow}`}
              onClick={handleMobileNext}
              aria-label="Next event"
            >
              <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className={styles.carouselDots}>
              {events.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === mobileIndex ? styles.activeDot : ''}`}
                  onClick={() => setMobileIndex(i)}
                  aria-label={`Go to event ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mouse devices on tablet: 2-card carousel */}
        {showSmallScreenCarousel && isTablet && events.length > 0 && (
          <div className={styles.carouselWrapper}>
            <button
              className={`${styles.carouselArrow} ${styles.prevArrow}`}
              onClick={handleTabletPrev}
              aria-label="Previous events"
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
                      {events.slice(slideIndex * 2, slideIndex * 2 + 2).map((event, idx) => (
                        <div key={event.id} className={styles.tabletCard}>
                          {renderEventCard(event, idx)}
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
              aria-label="Next events"
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

        {/* Desktop: Grid with slider navigation (4 columns: 3 events + View All) */}
        {!isMobile && !isTablet && (
          <div className={styles.sliderWrapper}>
            {events.length > desktopItemsPerView && (
              <button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={handleDesktopPrev}
                disabled={desktopIndex === 0}
                aria-label="Previous events"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div className={`${styles.grid} ${isInView ? styles.visible : ''}`}>
              {visibleDesktopEvents.map((event, index) => renderEventCard(event, index))}
              {renderViewAllCard(visibleDesktopEvents.length)}
            </div>

            {events.length > desktopItemsPerView && (
              <button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={handleDesktopNext}
                disabled={desktopIndex >= desktopMaxIndex}
                aria-label="Next events"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        )}

        {/* Desktop slider indicators */}
        {!isMobile && !isTablet && events.length > desktopItemsPerView && (
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
