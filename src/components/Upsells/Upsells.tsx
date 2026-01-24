'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Plus } from 'lucide-react';
import { siteData } from '@/data/siteData';
import styles from './Upsells.module.scss';

interface UpsellsProps {
  currentTourId: string;
  maxItems?: number;
}

export default function Upsells({ currentTourId, maxItems = 3 }: UpsellsProps) {
  // Filter out current tour and get suggestions
  const suggestions = siteData.destinations
    .filter((d) => d.id !== currentTourId)
    .slice(0, maxItems);

  if (suggestions.length === 0) return null;

  return (
    <div className={styles.upsells}>
      <h3 className={styles.title}>You Might Also Like</h3>
      <div className={styles.grid}>
        {suggestions.map((tour) => (
          <div key={tour.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src={tour.image}
                alt={tour.name}
                width={200}
                height={120}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles.content}>
              <span className={styles.location}>{tour.location}</span>
              <h4 className={styles.name}>{tour.name}</h4>
              <div className={styles.meta}>
                <span className={styles.rating}>
                  <Star size={14} />
                  {tour.rating}
                </span>
                <span className={styles.duration}>
                  <Clock size={14} />
                  {tour.duration}
                </span>
              </div>
              <div className={styles.footer}>
                <span className={styles.price}>{tour.price}</span>
                <Link
                  href={`/checkout?tour=${tour.id}`}
                  className={styles.addBtn}
                >
                  <Plus size={16} />
                  Add
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
