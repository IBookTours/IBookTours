'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useInView } from '@/hooks';
import { ANIMATION } from '@/lib/constants';
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
  const t = useTranslations('partners');
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: ANIMATION.THRESHOLD_LIGHT,
    triggerOnce: true,
  });

  // Duplicate partners for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <h2 className={`${styles.title} ${isInView ? styles.visible : ''}`}>
          {t('title')}
        </h2>

        {/* Auto-scrolling marquee of partner logos */}
        <div className={styles.marqueeWrapper}>
          <div className={`${styles.marquee} ${isInView ? styles.animate : ''}`}>
            <div className={styles.marqueeTrack}>
              {duplicatedPartners.map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className={styles.partnerLogo}
                >
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    width={120}
                    height={48}
                    className={styles.logo}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
