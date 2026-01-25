'use client';

import { useState, useCallback, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Slider.module.scss';

// ============================================
// SHARED SLIDER COMPONENT
// ============================================
// Reusable slider/carousel with navigation and indicators
// Extracts common slider logic from VacationPackagesSection
// and DayToursSection to eliminate code duplication

export interface SliderProps<T> {
  /** Array of items to display in the slider */
  items: T[];
  /** Maximum number of visible items at once */
  maxVisible?: number;
  /** Render function for each item */
  renderItem: (item: T, index: number) => ReactNode;
  /** Show navigation arrows */
  showNavigation?: boolean;
  /** Show indicator dots */
  showIndicators?: boolean;
  /** Additional class for the grid container */
  gridClassName?: string;
  /** Label for accessibility (screen readers) */
  ariaLabel?: string;
  /** Enable slider behavior (vs static grid) */
  enableSlider?: boolean;
}

export default function Slider<T>({
  items,
  maxVisible = 3,
  renderItem,
  showNavigation = true,
  showIndicators = true,
  gridClassName = '',
  ariaLabel = 'Slider',
  enableSlider = true,
}: SliderProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate navigation limits
  const totalItems = items.length;
  const canShowSlider = enableSlider && totalItems > maxVisible;
  const maxIndex = Math.max(0, totalItems - maxVisible);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  const handleIndicatorClick = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Get visible items based on current index
  const visibleItems = canShowSlider
    ? items.slice(currentIndex, currentIndex + maxVisible)
    : items.slice(0, maxVisible);

  // Calculate number of indicator dots
  const indicatorCount = maxIndex + 1;

  return (
    <div className={styles.slider} aria-label={ariaLabel}>
      <div className={styles.sliderWrapper}>
        {/* Previous Button */}
        {canShowSlider && showNavigation && (
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous items"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Items Grid */}
        <div
          className={`${styles.grid} ${canShowSlider ? styles.sliderGrid : ''} ${gridClassName}`}
          style={
            canShowSlider
              ? {
                  '--visible-items': maxVisible,
                } as React.CSSProperties
              : undefined
          }
        >
          {visibleItems.map((item, index) => (
            <div key={currentIndex + index} className={styles.gridItem}>
              {renderItem(item, currentIndex + index)}
            </div>
          ))}
        </div>

        {/* Next Button */}
        {canShowSlider && showNavigation && (
          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Next items"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Indicator Dots */}
      {canShowSlider && showIndicators && (
        <div className={styles.indicators} role="tablist" aria-label="Slider pages">
          {Array.from({ length: indicatorCount }).map((_, i) => (
            <button
              key={i}
              className={`${styles.indicator} ${i === currentIndex ? styles.activeIndicator : ''}`}
              onClick={() => handleIndicatorClick(i)}
              aria-label={`Go to page ${i + 1}`}
              aria-selected={i === currentIndex}
              role="tab"
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// HOOK FOR SLIDER STATE
// ============================================
// Use this hook when you need more control over slider behavior
// or need to integrate with external state

export interface UseSliderOptions {
  totalItems: number;
  maxVisible: number;
  enabled?: boolean;
}

export interface UseSliderReturn {
  currentIndex: number;
  maxIndex: number;
  canShowSlider: boolean;
  handlePrev: () => void;
  handleNext: () => void;
  setIndex: (index: number) => void;
  getVisibleRange: () => { start: number; end: number };
}

export function useSlider({
  totalItems,
  maxVisible,
  enabled = true,
}: UseSliderOptions): UseSliderReturn {
  const [currentIndex, setCurrentIndex] = useState(0);

  const canShowSlider = enabled && totalItems > maxVisible;
  const maxIndex = Math.max(0, totalItems - maxVisible);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  const setIndex = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  }, [maxIndex]);

  const getVisibleRange = useCallback(() => {
    if (!canShowSlider) {
      return { start: 0, end: Math.min(maxVisible, totalItems) };
    }
    return { start: currentIndex, end: currentIndex + maxVisible };
  }, [currentIndex, maxVisible, totalItems, canShowSlider]);

  return {
    currentIndex,
    maxIndex,
    canShowSlider,
    handlePrev,
    handleNext,
    setIndex,
    getVisibleRange,
  };
}
