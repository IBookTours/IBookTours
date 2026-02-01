'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { hotels, getHotelCities } from '@/data/hotelsData';
import { HotelCategory, HOTEL_CATEGORIES } from '@/types/hotel';
import HotelCard from './HotelCard';
import { useInView } from '@/hooks';
import { ANIMATION } from '@/lib/constants';
import styles from './HotelsSection.module.scss';

export default function HotelsSection() {
  const t = useTranslations('hotels');
  const [selectedCategory, setSelectedCategory] = useState<HotelCategory | 'all'>('all');
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: ANIMATION.THRESHOLD_LIGHT,
    triggerOnce: true,
  });

  const filteredHotels = selectedCategory === 'all'
    ? hotels
    : hotels.filter(h => h.category === selectedCategory);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.header} ${isInView ? styles.visible : ''}`}>
          <span className={styles.sectionLabel}>{t('sectionLabel')}</span>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.description}>{t('subtitle')}</p>
        </div>

        {/* Category Filter */}
        <div className={`${styles.filters} ${isInView ? styles.visible : ''}`}>
          {HOTEL_CATEGORIES.map(cat => (
            <button
              key={cat.value}
              className={`${styles.filterBtn} ${selectedCategory === cat.value ? styles.active : ''}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {t(`categories.${cat.value}`)}
            </button>
          ))}
        </div>

        {/* Hotels Grid */}
        <div className={`${styles.grid} ${isInView ? styles.visible : ''}`}>
          {filteredHotels.slice(0, 4).map((hotel, index) => (
            <div key={hotel.id} style={{ animationDelay: `${index * 100}ms` }}>
              <HotelCard hotel={hotel} />
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className={`${styles.cta} ${isInView ? styles.visible : ''}`}>
          <Link href="/hotels" className={styles.ctaBtn}>
            {t('viewAll')}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
