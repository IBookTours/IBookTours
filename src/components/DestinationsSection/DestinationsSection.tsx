'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Destination } from '@/types';
import DestinationCard from '@/components/DestinationCard';
import { useInView } from '@/hooks';
import styles from './DestinationsSection.module.scss';

interface DestinationsSectionProps {
  destinations: Destination[];
}

export default function DestinationsSection({ destinations }: DestinationsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: 0.2,
    triggerOnce: true,
  });

  // Paginate destinations (show featured + 2 others per page)
  const paginatedDestinations = useMemo(() => {
    const itemsPerPage = 3;
    const pages: Destination[][] = [];
    for (let i = 0; i < destinations.length; i += itemsPerPage) {
      pages.push(destinations.slice(i, i + itemsPerPage));
    }
    return pages;
  }, [destinations]);

  const currentDestinations = paginatedDestinations[currentPage] || destinations.slice(0, 3);
  const featuredDestination = currentDestinations[0];
  const otherDestinations = currentDestinations.slice(1, 3);

  const handlePrev = () => {
    setCurrentPage((prev) =>
      prev === 0 ? paginatedDestinations.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentPage((prev) =>
      prev === paginatedDestinations.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isInView ? styles.visible : ''}`}
      id="destinations"
    >
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
            <button
              className={styles.navBtn}
              aria-label="Previous"
              onClick={handlePrev}
              disabled={paginatedDestinations.length <= 1}
            >
              <ChevronLeft />
            </button>
            <button
              className={styles.navBtn}
              aria-label="Next"
              onClick={handleNext}
              disabled={paginatedDestinations.length <= 1}
            >
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

        {/* Pagination dots */}
        {paginatedDestinations.length > 1 && (
          <div className={styles.pagination}>
            {paginatedDestinations.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentPage ? styles.active : ''}`}
                onClick={() => setCurrentPage(index)}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
