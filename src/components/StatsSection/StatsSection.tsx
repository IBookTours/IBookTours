'use client';

import { useTranslations } from 'next-intl';
import { Stat } from '@/types';
import { useInView, useCountUp } from '@/hooks';
import { ANIMATION } from '@/lib/constants';
import styles from './StatsSection.module.scss';

interface StatsSectionProps {
  stats: Stat[];
}

// Animated stat component
function AnimatedStat({ stat, isInView, translatedLabel }: { stat: Stat; isInView: boolean; translatedLabel: string }) {
  // Parse the numeric value from the stat
  const numericValue = parseInt(stat.value.replace(/[^0-9]/g, ''), 10) || 0;
  const animatedValue = useCountUp(numericValue, 2000, isInView);

  // Format the value (add commas for thousands)
  const formattedValue = animatedValue.toLocaleString();

  return (
    <div className={`${styles.stat} ${isInView ? styles.visible : ''}`}>
      <div className={styles.value}>
        {formattedValue}
        {stat.suffix && <span className={styles.suffix}>{stat.suffix}</span>}
      </div>
      <p className={styles.label}>{translatedLabel}</p>
    </div>
  );
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const t = useTranslations('stats');
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: ANIMATION.THRESHOLD_HEAVY,
    triggerOnce: true,
  });

  // Map stat IDs to translation keys
  const statTranslationKeys: Record<string, string> = {
    'travelers': 'travelers',
    'destinations': 'destinations',
    'rating': 'rating',
    'satisfaction': 'satisfaction',
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {stats.map((stat) => {
            const translationKey = statTranslationKeys[stat.id] || stat.id;
            return (
              <AnimatedStat
                key={stat.id}
                stat={stat}
                isInView={isInView}
                translatedLabel={t(translationKey)}
              />
            );
          })}
        </div>

        {/* Decorative curved lines connecting stats */}
        <svg
          className={styles.curvedLines}
          data-animate={isInView}
          viewBox="0 0 1000 100"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* First curve: from stat 1 (16.67%) to stat 2 (50%) */}
          <path
            className={styles.curvePath}
            pathLength="1"
            d="M 167 50 Q 333 10, 500 50"
          />
          <circle className={styles.curveDot} cx="167" cy="50" r="6" />
          <circle className={styles.curveDot} cx="500" cy="50" r="6" />

          {/* Second curve: from stat 2 (50%) to stat 3 (83.33%) */}
          <path
            className={styles.curvePath}
            pathLength="1"
            d="M 500 50 Q 667 90, 833 50"
          />
          <circle className={styles.curveDot} cx="833" cy="50" r="6" />
        </svg>
      </div>
    </section>
  );
}
