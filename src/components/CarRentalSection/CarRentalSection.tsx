'use client';

import { useState, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Car, Users, Fuel, Settings, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { carRentalVehicles } from '@/data/carRentalData';
import { CarRentalVehicle, VehicleCategory, VEHICLE_CATEGORIES } from '@/types/carRental';
import { useInView } from '@/hooks';
import { ANIMATION } from '@/lib/constants';
import styles from './CarRentalSection.module.scss';

export default function CarRentalSection() {
  const t = useTranslations('carRental');
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory | 'all'>('all');
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: ANIMATION.THRESHOLD_LIGHT,
    triggerOnce: true,
  });

  const filteredVehicles = selectedCategory === 'all'
    ? carRentalVehicles
    : carRentalVehicles.filter(v => v.category === selectedCategory);

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
          <button
            className={`${styles.filterBtn} ${selectedCategory === 'all' ? styles.active : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            {t('filters.all')}
          </button>
          {VEHICLE_CATEGORIES.map(cat => (
            <button
              key={cat.value}
              className={`${styles.filterBtn} ${selectedCategory === cat.value ? styles.active : ''}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {t(`categories.${cat.value}`)}
            </button>
          ))}
        </div>

        {/* Vehicle Grid */}
        <div className={`${styles.grid} ${isInView ? styles.visible : ''}`}>
          {filteredVehicles.slice(0, 4).map((vehicle, index) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} t={t} />
          ))}
        </div>

        {/* View All CTA */}
        <div className={`${styles.cta} ${isInView ? styles.visible : ''}`}>
          <Link href="/car-rental" className={styles.ctaBtn}>
            {t('viewAll')}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

interface VehicleCardProps {
  vehicle: CarRentalVehicle;
  index: number;
  t: ReturnType<typeof useTranslations<'carRental'>>;
}

// Memoized to prevent re-renders when filter changes don't affect this card
const VehicleCard = memo(function VehicleCard({ vehicle, index, t }: VehicleCardProps) {
  return (
    <div className={styles.card} style={{ animationDelay: `${index * 100}ms` }}>
      <div className={styles.cardImage}>
        {vehicle.image ? (
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            style={{ objectFit: 'cover' }}
            unoptimized={vehicle.image.includes('unsplash.com')}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <Car size={48} />
          </div>
        )}
        <span className={styles.category}>{t(`categories.${vehicle.category}`)}</span>
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.vehicleName}>{vehicle.name}</h3>

        <div className={styles.specs}>
          <div className={styles.spec}>
            <Users size={16} />
            <span>{vehicle.seats} {t('seats')}</span>
          </div>
          <div className={styles.spec}>
            <Settings size={16} />
            <span>{t(vehicle.transmission)}</span>
          </div>
          <div className={styles.spec}>
            <Fuel size={16} />
            <span>{t(vehicle.fuelType)}</span>
          </div>
        </div>

        <div className={styles.features}>
          {vehicle.features.slice(0, 3).map((feature, i) => (
            <span key={i} className={styles.feature}>{feature}</span>
          ))}
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.price}>
            <span className={styles.priceAmount}>€{vehicle.pricePerDay}</span>
            <span className={styles.priceUnit}>/{t('perDay')}</span>
          </div>
          <Link href={`/car-rental/${vehicle.id}`} className={styles.bookBtn}>
            {t('bookNow')}
          </Link>
        </div>
      </div>
    </div>
  );
});
