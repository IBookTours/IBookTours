'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CTAContent } from '@/types';
import { useInView } from '@/hooks';
import styles from './CTASection.module.scss';

interface CTASectionProps {
  content: CTAContent;
}

export default function CTASection({ content }: CTASectionProps) {
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: 0.3,
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
          <h2 className={styles.title}>{content.title}</h2>
          <p className={styles.subtitle}>{content.subtitle}</p>
          <Link href={content.ctaLink} className={styles.cta}>
            {content.ctaText}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
