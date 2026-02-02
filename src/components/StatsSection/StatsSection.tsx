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

// SVG curved path connecting the stats
function ConnectingPath({ isInView }: { isInView: boolean }) {
  // SVG viewBox: 0 0 100 20 - keeping it responsive
  // Path goes from left stat (16.67%) through center (50%) to right stat (83.33%)
  // With a gentle wave curve
  const pathD = 'M 0,10 Q 25,-5 50,10 T 100,10';

  return (
    <svg
      className={`${styles.connectingSvg} ${isInView ? styles.animate : ''}`}
      viewBox="0 0 100 20"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Background dotted path (static) */}
      <path
        d={pathD}
        className={styles.pathBg}
        fill="none"
        strokeWidth="0.5"
        strokeDasharray="2 2"
      />

      {/* Animated drawing path */}
      <path
        d={pathD}
        className={styles.pathDraw}
        fill="none"
        strokeWidth="0.8"
        strokeLinecap="round"
      />

      {/* Connection dots at stat positions */}
      <circle cx="0" cy="10" r="1.5" className={`${styles.connectionDot} ${styles.dot1}`} />
      <circle cx="50" cy="10" r="1.5" className={`${styles.connectionDot} ${styles.dot2}`} />
      <circle cx="100" cy="10" r="1.5" className={`${styles.connectionDot} ${styles.dot3}`} />

      {/* Animated traveling dot along the path */}
      <circle r="1" className={styles.travelDot}>
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          begin={isInView ? '1.5s' : 'indefinite'}
          path={pathD}
        />
      </circle>
    </svg>
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

        {/* Decorative curved SVG path connecting stats */}
        <ConnectingPath isInView={isInView} />
      </div>
    </section>
  );
}
