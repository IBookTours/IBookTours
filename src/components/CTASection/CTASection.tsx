'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CTAContent } from '@/types';
import { useInView } from '@/hooks';
import { ANIMATION } from '@/lib/constants';
import styles from './CTASection.module.scss';

interface CTASectionProps {
  content: CTAContent;
}

export default function CTASection({ content }: CTASectionProps) {
  const t = useTranslations('cta');
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: ANIMATION.THRESHOLD_HEAVY,
    triggerOnce: true,
  });

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.background}>
        <Image
          src={content.backgroundImage}
          alt="Adventure background"
          fill
          quality={80}
          sizes="100vw"
        />
      </div>

      <div className={`${styles.decoration} ${isInView ? styles.visible : ''}`} />
      <div className={`${styles.decoration} ${isInView ? styles.visible : ''}`} />
      <div className={`${styles.decoration} ${isInView ? styles.visible : ''}`} />

      <div className={styles.container}>
        <div className={`${styles.content} ${isInView ? styles.visible : ''}`}>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{t('subtitle')}</p>
          <Link href={content.ctaLink} className={styles.cta}>
            {t('button')}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
