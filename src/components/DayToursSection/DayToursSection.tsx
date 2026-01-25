'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock,
  Users,
  MapPin,
  Star,
  ArrowRight,
  ShoppingCart,
  Filter,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { priceStringToCents } from '@/store/bookingStore';
import styles from './DayToursSection.module.scss';

export type TourCategory = 'all' | 'cultural' | 'adventure' | 'food' | 'nature';

export interface DayTour {
  id: string;
  name: string;
  duration: string;
  location: string;
  departsFrom: string;
  groupSize: { min: number; max: number };
  pricePerPerson: string;
  category: TourCategory;
  image: string;
  rating: number;
  reviewCount: number;
  highlights: string[];
}

interface DayToursSectionProps {
  tours: DayTour[];
  showFilters?: boolean;
  maxDisplay?: number;
}

const categoryLabels: Record<TourCategory, string> = {
  all: 'All Tours',
  cultural: 'Cultural',
  adventure: 'Adventure',
  food: 'Food & Wine',
  nature: 'Nature',
};

const categoryColors: Record<TourCategory, string> = {
  all: '',
  cultural: styles.cultural,
  adventure: styles.adventure,
  food: styles.food,
  nature: styles.nature,
};

export default function DayToursSection({
  tours,
  showFilters = true,
  maxDisplay,
}: DayToursSectionProps) {
  const [activeCategory, setActiveCategory] = useState<TourCategory>('all');
  const { addItem } = useCartStore();

  const filteredTours = tours.filter(
    (tour) => activeCategory === 'all' || tour.category === activeCategory
  );

  const displayTours = maxDisplay ? filteredTours.slice(0, maxDisplay) : filteredTours;

  const handleAddToCart = (tour: DayTour) => {
    addItem({
      id: tour.id,
      type: 'day-tour',
      name: tour.name,
      image: tour.image,
      duration: tour.duration,
      location: tour.location,
      basePrice: priceStringToCents(tour.pricePerPerson),
      quantity: 1,
      date: '',
      travelers: { adults: 1, children: 0 },
      childDiscountPercent: 50,
    });
  };

  const categories: TourCategory[] = ['all', 'cultural', 'adventure', 'food', 'nature'];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.badge}>
              <Clock size={16} />
              Day Tours & Excursions
            </span>
            <h2 className={styles.title}>Explore Albania in a Day</h2>
            <p className={styles.subtitle}>
              Join our guided day trips and group tours. Perfect for travelers who want to see more in less time.
            </p>
          </div>

          {showFilters && (
            <div className={styles.filters}>
              <Filter size={16} className={styles.filterIcon} />
              {categories.map((category) => (
                <button
                  key={category}
                  className={`${styles.filterBtn} ${activeCategory === category ? styles.active : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.grid}>
          {displayTours.map((tour) => (
            <article key={tour.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={tour.image}
                  alt={tour.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                />
                <span className={`${styles.categoryBadge} ${categoryColors[tour.category]}`}>
                  {categoryLabels[tour.category]}
                </span>
                <span className={styles.durationBadge}>
                  <Clock size={12} />
                  {tour.duration}
                </span>
              </div>

              <div className={styles.content}>
                <div className={styles.location}>
                  <MapPin size={12} />
                  {tour.departsFrom}
                </div>

                <h3 className={styles.name}>{tour.name}</h3>

                <div className={styles.meta}>
                  <span className={styles.metaItem}>
                    <Users size={14} />
                    {tour.groupSize.min}-{tour.groupSize.max} people
                  </span>
                  <span className={styles.rating}>
                    <Star size={14} fill="currentColor" />
                    {tour.rating}
                  </span>
                </div>

                <div className={styles.footer}>
                  <div className={styles.pricing}>
                    <span className={styles.price}>{tour.pricePerPerson}</span>
                    <span className={styles.perPerson}>/ person</span>
                  </div>

                  <div className={styles.actions}>
                    <Link href={`/tours/${tour.id}`} className={styles.viewBtn}>
                      View
                    </Link>
                    <button
                      className={styles.cartBtn}
                      onClick={() => handleAddToCart(tour)}
                      aria-label="Add to cart"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.cta}>
          <Link href="/tours" className={styles.ctaButton}>
            View All Day Tours
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
