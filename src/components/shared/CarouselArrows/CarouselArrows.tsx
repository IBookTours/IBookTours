'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CarouselArrows.module.scss';

export interface CarouselArrowsProps {
  onPrev: () => void;
  onNext: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'glass' | 'solid';
  className?: string;
  prevLabel?: string;
  nextLabel?: string;
}

const sizeMap = {
  sm: 18,
  md: 20,
  lg: 24,
};

export default function CarouselArrows({
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  size = 'md',
  variant = 'glass',
  className = '',
  prevLabel = 'Previous',
  nextLabel = 'Next',
}: CarouselArrowsProps) {
  const iconSize = sizeMap[size];

  return (
    <>
      <button
        className={`${styles.arrow} ${styles.prev} ${styles[size]} ${styles[variant]} ${className}`}
        onClick={onPrev}
        disabled={prevDisabled}
        aria-label={prevLabel}
        type="button"
      >
        <ChevronLeft size={iconSize} />
      </button>
      <button
        className={`${styles.arrow} ${styles.next} ${styles[size]} ${styles[variant]} ${className}`}
        onClick={onNext}
        disabled={nextDisabled}
        aria-label={nextLabel}
        type="button"
      >
        <ChevronRight size={iconSize} />
      </button>
    </>
  );
}
