'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ArrowRight, MapPin, Route, Smile } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { AdventureContent } from '@/types';
import { useInView } from '@/hooks';
import { ANIMATION } from '@/lib/constants';
import styles from './AdventureSection.module.scss';

const statIcons: Record<string, React.ReactNode> = {
  'tours': <Route size={20} />,
  'destinations': <MapPin size={20} />,
  'satisfaction': <Smile size={20} />,
};

interface AdventureSectionProps {
  content: AdventureContent;
}

export default function AdventureSection({ content }: AdventureSectionProps) {
  const t = useTranslations('adventure');
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: ANIMATION.THRESHOLD_STANDARD,
    triggerOnce: true,
  });

  const categories = content.categories;

  // Render a compact category card
  const renderCategoryCard = (category: typeof categories[0], index: number) => (
    <Link
      key={category.id}
      href={`/tours?category=${category.id}`}
      className={`${styles.categoryCard} ${isInView ? styles.visible : ''}`}
      style={{ transitionDelay: `${index * 0.05}s` }}
    >
      <div className={styles.categoryImage}>
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 15vw"
        />
        <div className={styles.categoryOverlay} />
      </div>
      <span className={styles.categoryName}>{category.name}</span>
      {category.count && (
        <span className={styles.categoryCount}>{category.count} tours</span>
      )}
    </Link>
  );

  return (
    <section ref={sectionRef} className={styles.section} id="tours">
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left side: Header content */}
          <div className={`${styles.header} ${isInView ? styles.visible : ''}`}>
            <span className={styles.sectionLabel}>{t('sectionLabel')}</span>
            <h2 className={styles.title}>{t('title')}</h2>
            <p className={styles.description}>{t('description')}</p>

            {content.stats && content.stats.length > 0 && (
              <div className={styles.stats}>
                {content.stats.map((stat, index) => {
                  const labelToKey: Record<string, string> = {
                    'Unique Tours': 'tours',
                    'Destinations': 'destinations',
                    'Happy Travelers': 'satisfaction',
                  };
                  const statKey = labelToKey[stat.label] || 'tours';
                  return (
                    <div key={index} className={styles.statItem}>
                      <span className={styles.statIcon}>
                        {statIcons[statKey] || <MapPin size={20} />}
                      </span>
                      <span className={styles.statValue}>{stat.value}</span>
                      <span className={styles.statLabel}>{t(`stats.${statKey}`)}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className={styles.ratingCard}>
              <div className={styles.ratingHeader}>
                <Star />
                <span className={styles.ratingValue}>{content.rating.value}</span>
              </div>
              <p className={styles.ratingLabel}>{t('ratingLabel')}</p>
            </div>

            {content.ctaLink && (
              <Link href={content.ctaLink} className={styles.ctaButton}>
                {t('cta')}
                <ArrowRight size={18} />
              </Link>
            )}
          </div>

          {/* Right side: Compact 2x4 grid of categories */}
          <div className={`${styles.categoriesGrid} ${isInView ? styles.visible : ''}`}>
            {categories.slice(0, 8).map((category, index) => renderCategoryCard(category, index))}
          </div>
        </div>
      </div>
    </section>
  );
}
