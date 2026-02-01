'use client';

import Link from 'next/link';
import { Construction, ArrowLeft } from 'lucide-react';
import styles from './ComingSoon.module.scss';

interface ComingSoonProps {
  feature?: string;
  title?: string;
  message?: string;
  backLink?: string;
  backLabel?: string;
}

export default function ComingSoon({
  feature = 'This feature',
  title = 'Coming Soon',
  message = "We're working on something amazing. Check back soon!",
  backLink = '/tours',
  backLabel = 'Browse Tours',
}: ComingSoonProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Construction className={styles.icon} size={64} strokeWidth={1.5} />
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.message}>{message}</p>
        <p className={styles.feature}>{feature} is currently being prepared.</p>
        <Link href={backLink} className={styles.backLink}>
          <ArrowLeft size={18} />
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
