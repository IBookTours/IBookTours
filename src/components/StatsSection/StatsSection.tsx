'use client';

import { Stat } from '@/types';
import styles from './StatsSection.module.scss';

interface StatsSectionProps {
  stats: Stat[];
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {stats.map((stat) => (
            <div key={stat.id} className={styles.stat}>
              <div className={styles.value}>
                {stat.value}
                {stat.suffix && <span className={styles.suffix}>{stat.suffix}</span>}
              </div>
              <p className={styles.label}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Decorative curved lines */}
        <svg className={styles.curvedLines} viewBox="0 0 1200 100" preserveAspectRatio="none">
          {/* First curve (between first and second stat) */}
          <path
            className={styles.curvePath}
            d="M 200 50 Q 300 10 400 50"
          />
          <circle className={styles.curveDot} cx="200" cy="50" r="4" />
          <circle className={styles.curveDot} cx="400" cy="50" r="4" />

          {/* Second curve (between second and third stat) */}
          <path
            className={styles.curvePath}
            d="M 800 50 Q 900 90 1000 50"
          />
          <circle className={styles.curveDot} cx="800" cy="50" r="4" />
          <circle className={styles.curveDot} cx="1000" cy="50" r="4" />
        </svg>
      </div>
    </section>
  );
}
