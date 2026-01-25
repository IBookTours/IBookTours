'use client';

import Link from 'next/link';
import { Home, ArrowLeft, ShieldOff } from 'lucide-react';
import styles from '../error.module.scss';

export default function ForbiddenPage() {
  return (
    <div className={styles.errorPage}>
      <div className={styles.content}>
        <div className={styles.forbiddenIcon}>
          <ShieldOff />
        </div>

        <h1 className={styles.errorCode}>403</h1>

        <h2 className={styles.title}>Access Forbidden</h2>

        <p className={styles.message}>
          Sorry, you don&apos;t have permission to access this page.
          This might be because you need to log in or you don&apos;t have the required permissions.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            <Home size={18} />
            Back to Home
          </Link>

          <Link href="/auth/signin" className={styles.secondaryBtn}>
            Sign In
          </Link>
        </div>

        <button
          onClick={() => typeof window !== 'undefined' && window.history.back()}
          className={styles.backLink}
        >
          <ArrowLeft size={14} />
          Go back to previous page
        </button>

        <p className={styles.supportLink}>
          Think this is a mistake?{' '}
          <Link href="/contact">Contact our support team</Link>
        </p>
      </div>
    </div>
  );
}
