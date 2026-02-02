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

        {/* Decorative dotted line connecting stats with animated traveling dots */}
        <div className={`${styles.connectingLine} ${isInView ? styles.animate : ''}`}>
          {/* Dotted line base */}
          <div className={styles.dottedLine} />

          {/* Static dots at connection points */}
          <div className={`${styles.staticDot} ${styles.dot1}`} />
          <div className={`${styles.staticDot} ${styles.dot2}`} />
          <div className={`${styles.staticDot} ${styles.dot3}`} />

          {/* Animated traveling dots */}
          <div className={`${styles.travelingDot} ${styles.travel1}`} />
          <div className={`${styles.travelingDot} ${styles.travel2}`} />
        </div>
      </div>
    </section>
  );
}
