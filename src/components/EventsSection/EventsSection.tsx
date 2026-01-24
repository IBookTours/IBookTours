'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { EventsContent } from '@/types';
import { useInView } from '@/hooks';
import styles from './EventsSection.module.scss';

interface EventsSectionProps {
  content: EventsContent;
}

export default function EventsSection({ content }: EventsSectionProps) {
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: 0.15,
    triggerOnce: true,
  });

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

        <div className={styles.events}>
          {content.events.map((event, index) => (
            <article
              key={event.id}
              className={`${styles.eventCard} ${isInView ? styles.visible : ''}`}
              style={{ transitionDelay: `${0.1 + index * 0.15}s` }}
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
          ))}
        </div>

        <div className={`${styles.partners} ${isInView ? styles.visible : ''}`}>
          <p className={styles.partnersTitle}>Trusted by leading travel brands</p>
          <div className={styles.partnersGrid}>
            {content.partners.map((partner) => (
              <div key={partner.id} className={styles.partner}>
                <span className={styles.partnerName}>{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
