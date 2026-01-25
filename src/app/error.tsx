'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './error.module.scss';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    console.error('Application error:', error);
  }, [error]);

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
        <div className={styles.iconWrapper}>
          <AlertTriangle />
        </div>

        <h1 className={styles.title}>Something Went Wrong</h1>

        <p className={styles.message}>
          We apologize for the inconvenience. An unexpected error occurred while processing your request.
        </p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className={styles.errorDetails}>
            <code>{error.message}</code>
          </div>
        )}

        <div className={styles.actions}>
          <button onClick={reset} className={styles.primaryBtn}>
            <RefreshCw size={18} />
            Try Again
          </button>

          <Link href="/" className={styles.secondaryBtn}>
            <Home size={18} />
            Back to Home
          </Link>
        </div>

        <p className={styles.supportLink}>
          If this problem persists, please{' '}
          <Link href="/contact">contact our support team</Link>
        </p>
      </div>
    </div>
  );
}
