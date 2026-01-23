'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Destination } from '@/types';
import DestinationCard from '@/components/DestinationCard';
import styles from './DestinationsSection.module.scss';

interface DestinationsSectionProps {
  destinations: Destination[];
}

export default function DestinationsSection({ destinations }: DestinationsSectionProps) {
  const featuredDestination = destinations.find((d) => d.featured) || destinations[0];
  const otherDestinations = destinations.filter((d) => d.id !== featuredDestination.id).slice(0, 2);

  return (
    <section className={styles.section} id="destinations">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <span className={styles.sectionLabel}>We make your trip</span>
            <h2 className={styles.title}>
              Discover Unforgettable Adventures with Us!
            </h2>
            <p className={styles.subtitle}>
              Explore breathtaking destinations handpicked by our travel experts.
              From serene beaches to majestic mountains, your perfect adventure awaits.
            </p>
          </div>

          <div className={styles.nav}>
            <button className={styles.navBtn} aria-label="Previous">
              <ChevronLeft />
            </button>
            <button className={styles.navBtn} aria-label="Next">
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.featuredCard}>
            <DestinationCard destination={featuredDestination} variant="featured" showCta />
          </div>

          <div className={styles.cardList}>
            {otherDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                variant="horizontal"
                showCta
              />
            ))}
          </div>
        </div>
      </div>

      {/* Decorative curved line */}
      <svg className={styles.decorativeLine} viewBox="0 0 400 400">
        <path
          className={styles.curvedPath}
          d="M 50 200 Q 150 50 250 200 Q 350 350 450 200"
        />
      </svg>
    </section>
  );
}
