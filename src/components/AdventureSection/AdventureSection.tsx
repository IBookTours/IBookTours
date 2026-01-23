'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { AdventureContent } from '@/types';
import styles from './AdventureSection.module.scss';

interface AdventureSectionProps {
  content: AdventureContent;
}

export default function AdventureSection({ content }: AdventureSectionProps) {
  return (
    <section className={styles.section} id="tours">
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.header}>
            <span className={styles.sectionLabel}>{content.sectionLabel}</span>
            <h2 className={styles.title}>{content.title}</h2>

            <div className={styles.ratingCard}>
              <div className={styles.ratingHeader}>
                <Star />
                <span className={styles.ratingValue}>{content.rating.value}</span>
              </div>
              <p className={styles.ratingLabel}>{content.rating.label}</p>
            </div>
          </div>

          <div className={styles.categories}>
            {content.categories.map((category, index) => (
              <div
                key={category.id}
                className={`${styles.category} ${index === 0 ? styles.categoryFeatured : ''}`}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className={styles.categoryOverlay} />

                {category.count && (
                  <span className={styles.categoryBadge}>
                    {category.count} tours
                  </span>
                )}

                <div className={styles.categoryContent}>
                  <h3 className={styles.categoryName}>{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
