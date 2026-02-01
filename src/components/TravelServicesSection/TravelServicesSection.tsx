'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Calendar, Car, Users, ArrowRight } from 'lucide-react';
import { isFeatureEnabled } from '@/lib/config/features';
import { useInView } from '@/hooks';
import { ANIMATION } from '@/lib/constants';
import styles from './TravelServicesSection.module.scss';

interface TravelService {
  id: string;
  featureKey: 'events' | 'airportTransfers' | 'localGuides';
  icon: React.ElementType;
  href: string;
}

const services: TravelService[] = [
  {
    id: 'events',
    featureKey: 'events',
    icon: Calendar,
    href: '/tours?category=events',
  },
  {
    id: 'airportTransfers',
    featureKey: 'airportTransfers',
    icon: Car,
    href: '/contact?service=transfers',
  },
  {
    id: 'localGuides',
    featureKey: 'localGuides',
    icon: Users,
    href: '/contact?service=guides',
  },
];

export default function TravelServicesSection() {
  const t = useTranslations('travelServices');
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: ANIMATION.THRESHOLD_LIGHT,
    triggerOnce: true,
  });

  // Use state to avoid hydration mismatch with feature flags
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always show all services on server, filter on client after mount
  const enabledServices = mounted
    ? services.filter((service) => isFeatureEnabled(service.featureKey))
    : services;

  // Check travelServices flag only after mount to avoid hydration mismatch
  const showSection = mounted ? isFeatureEnabled('travelServices') : true;

  if (!showSection || enabledServices.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.header} ${isInView ? styles.visible : ''}`}>
          <span className={styles.sectionLabel}>{t('sectionLabel')}</span>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        <div className={`${styles.grid} ${isInView ? styles.visible : ''}`}>
          {enabledServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.id}
                href={service.href}
                className={styles.card}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={styles.iconWrapper}>
                  <Icon className={styles.icon} />
                </div>
                <h3 className={styles.cardTitle}>{t(`services.${service.id}.title`)}</h3>
                <p className={styles.cardDescription}>
                  {t(`services.${service.id}.description`)}
                </p>
                <span className={styles.cardLink}>
                  {t('learnMore')}
                  <ArrowRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
