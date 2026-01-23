'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CTAContent } from '@/types';
import styles from './CTASection.module.scss';

interface CTASectionProps {
  content: CTAContent;
}

export default function CTASection({ content }: CTASectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.background}>
        <Image
          src={content.backgroundImage}
          alt="Adventure background"
          fill
          quality={80}
          sizes="100vw"
        />
      </div>

      <div className={styles.decoration} />
      <div className={styles.decoration} />
      <div className={styles.decoration} />

      <div className={styles.container}>
        <div className={styles.content}>
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
