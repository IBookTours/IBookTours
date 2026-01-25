'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { EventsContent } from '@/types';
import { useInView, useIsDesktop, useSwipe } from '@/hooks';
import styles from './EventsSection.module.scss';

interface EventsSectionProps {
  content: EventsContent;
}

export default function EventsSection({ content }: EventsSectionProps) {
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: 0.15,
    triggerOnce: true,
  });

  const isDesktop = useIsDesktop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const events = content.events;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Swipe handlers for mobile
  const swipeHandlers = useSwipe(goToNext, goToPrevious);

  // Render event card (reusable for both layouts)
  const renderEventCard = (event: typeof events[0], index: number, showAnimation = true) => (
    <article
      key={event.id}
      className={`${styles.eventCard} ${showAnimation && isInView ? styles.visible : ''}`}
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
    </article>
  );

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.header} ${isInView ? styles.visible : ''}`}>
          <div className={styles.titleWrapper}>
            <span className={styles.year}>{content.year}</span>
            <h2 className={styles.title}>{content.title}</h2>
          </div>

          <Link href="/tours" className={styles.viewAll}>
            View All Events
            <ArrowRight />
          </Link>
        </div>

        {/* Desktop: Grid layout */}
        {isDesktop && (
          <div className={styles.events}>
            {events.map((event, index) => renderEventCard(event, index))}
          </div>
        )}

        {/* Mobile/Tablet: Carousel layout */}
        {!isDesktop && (
          <div className={`${styles.carouselContainer} ${isInView ? styles.visible : ''}`}>
            <div className={styles.carouselTrack} {...swipeHandlers}>
              {renderEventCard(events[currentIndex], currentIndex, false)}
            </div>

            {/* Navigation arrows */}
            <button
              className={`${styles.carouselArrow} ${styles.prevArrow}`}
              onClick={goToPrevious}
              aria-label="Previous event"
            >
              <ChevronLeft />
            </button>
            <button
              className={`${styles.carouselArrow} ${styles.nextArrow}`}
              onClick={goToNext}
              aria-label="Next event"
            >
              <ChevronRight />
            </button>

            {/* Dot indicators */}
            <div className={styles.carouselDots}>
              {events.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to event ${index + 1}`}
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
