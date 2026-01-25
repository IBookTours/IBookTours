'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, Search, ArrowLeft } from 'lucide-react';
import styles from './error.module.scss';

export default function NotFound() {
  return (
    <div className={styles.errorPage}>
      <div className={styles.content}>
        <Image
          src="/logo.svg"
          alt="ITravel Tours"
          width={160}
          height={48}
          className={styles.logo}
          priority
        />
        <h1 className={styles.errorCode}>404</h1>

        <h2 className={styles.title}>Page Not Found</h2>

        <p className={styles.message}>
          Oops! The page you&apos;re looking for seems to have wandered off on its own adventure.
          Let&apos;s get you back on track.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            <Home size={18} />
            Back to Home
          </Link>

          <Link href="/tours" className={styles.secondaryBtn}>
            <Search size={18} />
            Explore Tours
          </Link>
        </div>

        <button
          onClick={() => typeof window !== 'undefined' && window.history.back()}
          className={styles.backLink}
        >
          <ArrowLeft size={14} />
          Go back to previous page
        </button>
      </div>
    </div>
  );
}
