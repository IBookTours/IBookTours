import Link from 'next/link';
import { Clock, ArrowLeft, Mail } from 'lucide-react';
import styles from './ComingSoon.module.scss';

interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.icon}>
          <Clock />
        </div>

        <h1 className={styles.title}>{title}</h1>

        <p className={styles.description}>
          {description ||
            "We're working hard to bring you this page. Check back soon for updates!"}
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            <ArrowLeft />
            Back to Home
          </Link>

          <Link href="/contact" className={styles.secondaryBtn}>
            <Mail />
            Contact Us
          </Link>
        </div>

        <div className={styles.decoration}>
          <div className={styles.circle1} />
          <div className={styles.circle2} />
          <div className={styles.circle3} />
        </div>
      </div>
    </div>
  );
}
