'use client';

import Image from 'next/image';
import { Map, Building, Star, Download, Play, CheckCircle, Globe } from 'lucide-react';
import { BookingContent } from '@/types';
import styles from './BookingSection.module.scss';

interface BookingSectionProps {
  content: BookingContent;
}

const iconMap: Record<string, React.ReactNode> = {
  map: <Map />,
  building: <Building />,
  star: <Star />,
};

export default function BookingSection({ content }: BookingSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.bgDecoration} />
      <div className={styles.bgDecoration} />

      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.content}>
            <span className={styles.sectionLabel}>{content.sectionLabel}</span>
            <h2 className={styles.title}>{content.title}</h2>
            <p className={styles.description}>{content.description}</p>

            <div className={styles.features}>
              {content.features.map((feature) => (
                <div key={feature.id} className={styles.feature}>
                  <div className={styles.featureIcon}>
                    {iconMap[feature.icon]}
                  </div>
                  <span className={styles.featureValue}>{feature.value}</span>
                  <span className={styles.featureLabel}>{feature.label}</span>
                </div>
              ))}
            </div>

            <div className={styles.ctaWrapper}>
              <button className={styles.ctaPrimary}>
                <Download />
                {content.ctaText}
              </button>
              <button className={styles.ctaSecondary}>
                <Play />
                Watch Demo
              </button>
            </div>
          </div>

          <div className={styles.visual}>
            <div className={styles.phoneWrapper}>
              <div className={styles.phone}>
                <div className={styles.phoneScreen}>
                  <Image
                    src={content.appPreview}
                    alt="ITravel App Preview"
                    fill
                    sizes="320px"
                  />
                </div>
              </div>

              {/* Floating cards */}
              <div className={styles.floatingCard}>
                <div className={styles.cardIcon}>
                  <CheckCircle />
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.value}>Booking Confirmed</span>
                  <span className={styles.label}>Your trip is ready!</span>
                </div>
              </div>

              <div className={styles.floatingCard}>
                <div className={styles.cardIcon}>
                  <Globe />
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.value}>72 Destinations</span>
                  <span className={styles.label}>Worldwide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
