'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { EventsContent } from '@/types';
import { useInView, useIsDesktop, useSwipe } from '@/hooks';
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

  const isDesktop = useIsDesktop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const events = content.events;

  // Show 2 cards at a time on mobile/tablet
  const cardsPerView = 2;
  const maxIndex = Math.max(0, events.length - cardsPerView);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Get visible events for carousel (2 at a time)
  const getVisibleEvents = () => {
    const visible = [];
    for (let i = 0; i < cardsPerView; i++) {
      const idx = (currentIndex + i) % events.length;
      visible.push({ event: events[idx], originalIndex: idx });
    }
    return visible;
  };

  // Swipe handlers for mobile
  const swipeHandlers = useSwipe(goToNext, goToPrevious);

  // Render event card (reusable for both layouts)
  // When showAnimation is false (mobile carousel), card should always be visible
  const renderEventCard = (event: typeof events[0], index: number, showAnimation = true) => (
    <Link
      key={event.id}
      href={event.href || '/tours'}
      className={`${styles.eventCard} ${!showAnimation || isInView ? styles.visible : ''}`}
      style={showAnimation ? { transitionDelay: `${0.1 + index * 0.15}s` } : undefined}
    >
      <Image
        src={event.image}
        alt={event.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className={styles.eventOverlay} />

      <div className={styles.eventContent}>
        {event.date && (
          <span className={styles.eventDate}>{event.date}</span>
        )}
        <h3 className={styles.eventTitle}>{event.title}</h3>
        {event.location && (
          <span className={styles.eventLocation}>
            <MapPin />
            {event.location}
          </span>
        )}
      </div>
    </Link>
  );

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.header} ${isInView ? styles.visible : ''}`}>
          <div className={styles.titleWrapper}>
            <span className={styles.year}>{t('year')}</span>
            <h2 className={styles.title}>{t('title')}</h2>
          </div>

          <Link href="/tours" className={styles.viewAll}>
            {t('viewAll')}
            <ArrowRight />
          </Link>
        </div>

        {/* Desktop: Grid layout */}
        {isDesktop && (
          <div className={styles.events}>
            {events.map((event, index) => renderEventCard(event, index))}
          </div>
        )}

        {/* Mobile/Tablet: Carousel layout with 2 cards */}
        {!isDesktop && (
          <div className={`${styles.carouselContainer} ${isInView ? styles.visible : ''}`}>
            <div className={styles.carouselTrack} {...swipeHandlers}>
              {getVisibleEvents().map(({ event, originalIndex }) => (
                <div key={event.id} className={styles.carouselSlide}>
                  {renderEventCard(event, originalIndex, false)}
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            <button
              className={`${styles.carouselArrow} ${styles.prevArrow}`}
              onClick={goToPrevious}
              aria-label="Previous events"
            >
              <ChevronLeft />
            </button>
            <button
              className={`${styles.carouselArrow} ${styles.nextArrow}`}
              onClick={goToNext}
              aria-label="Next events"
            >
              <ChevronRight />
            </button>

            {/* Dot indicators - one per slide position */}
            <div className={styles.carouselDots}>
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentIndex ? 'true' : 'false'}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
