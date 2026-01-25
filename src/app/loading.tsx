import Image from 'next/image';
import styles from './error.module.scss';

export default function Loading() {
  return (
    <div className={styles.loadingPage}>
      <Image
        src="/logo.svg"
        alt="ITravel Tours"
        width={180}
        height={56}
        className={styles.loadingLogo}
        priority
      />
      <div className={styles.loadingSpinner}>
        <span className={styles.loadingDot} />
        <span className={styles.loadingDot} />
        <span className={styles.loadingDot} />
      </div>
      <span className={styles.loadingText}>Loading your adventure...</span>
    </div>
  );
}
