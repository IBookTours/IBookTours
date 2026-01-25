'use client';

import Image from 'next/image';
import { Shield } from 'lucide-react';
import { useInView } from '@/hooks';
import styles from './PartnersSection.module.scss';

export interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
}

interface PartnersSectionProps {
  partners: Partner[];
}

export default function PartnersSection({ partners }: PartnersSectionProps) {
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.header} ${isInView ? styles.visible : ''}`}>
          <span className={styles.badge}>
            <Shield size={16} />
            Our Partners
          </span>
          <h2 className={styles.title}>Trusted by Leading Travel Technology Providers</h2>
          <p className={styles.subtitle}>
            We partner with the world&apos;s best travel technology companies to bring you seamless booking experiences and the best prices.
          </p>
        </div>

        <div className={styles.grid}>
          {partners.map((partner, index) => (
            <div
              key={partner.id}
              className={`${styles.partnerCard} ${isInView ? styles.visible : ''}`}
              style={{ transitionDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className={styles.logoWrapper}>
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={160}
                  height={60}
                  className={styles.logo}
                />
              </div>
              <h3 className={styles.partnerName}>{partner.name}</h3>
              <p className={styles.partnerDescription}>{partner.description}</p>
            </div>
          ))}
        </div>

        <div className={`${styles.trust} ${isInView ? styles.visible : ''}`}>
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>1M+</span>
            <span className={styles.trustLabel}>Bookings Processed</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>500+</span>
            <span className={styles.trustLabel}>Hotels Worldwide</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>100+</span>
            <span className={styles.trustLabel}>Airlines Connected</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>24/7</span>
            <span className={styles.trustLabel}>Customer Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
