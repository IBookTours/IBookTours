import { useState, useCallback, useRef, useEffect } from 'react';

interface UseCarouselOptions {
  /** Total number of items in the carousel */
  totalItems: number;
  /** Number of visible items at once */
  visibleItems?: number;
  /** Enable infinite loop */
  loop?: boolean;
  /** Auto-play interval in ms (0 = disabled) */
  autoPlay?: number;
  /** Initial index */
  initialIndex?: number;
}

interface UseCarouselReturn {
  /** Current index */
  index: number;
  /** Set index directly */
  setIndex: (index: number) => void;
  /** Go to next slide */
  goNext: () => void;
  /** Go to previous slide */
  goPrev: () => void;
  /** Go to specific slide */
  goTo: (index: number) => void;
  /** Whether we can go to previous */
  canGoPrev: boolean;
  /** Whether we can go to next */
  canGoNext: boolean;
  /** Maximum valid index */
  maxIndex: number;
  /** Total number of slides (for pagination) */
  totalSlides: number;
  /** Ref to attach to container for detecting swipes */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Touch handlers for swipe support */
  touchHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
}

export function useCarousel({
  totalItems,
  visibleItems = 1,
  loop = false,
  autoPlay = 0,
  initialIndex = 0,
}: UseCarouselOptions): UseCarouselReturn {
  const [index, setIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate max index
  const maxIndex = Math.max(0, totalItems - visibleItems);
  const totalSlides = Math.ceil(totalItems / visibleItems);

  // Navigation
  const goTo = useCallback(
    (newIndex: number) => {
      if (loop) {
        // Wrap around for loop mode
        if (newIndex < 0) {
          setIndex(maxIndex);
        } else if (newIndex > maxIndex) {
          setIndex(0);
        } else {
          setIndex(newIndex);
        }
      } else {
        // Clamp for non-loop mode
        setIndex(Math.max(0, Math.min(maxIndex, newIndex)));
      }
    },
    [loop, maxIndex]
  );

  const goNext = useCallback(() => {
    goTo(index + 1);
  }, [goTo, index]);

  const goPrev = useCallback(() => {
    goTo(index - 1);
  }, [goTo, index]);

  // Touch/swipe handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchCurrentX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchCurrentX.current;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  }, [goNext, goPrev]);

  // Auto-play
  useEffect(() => {
    if (autoPlay > 0) {
      autoPlayRef.current = setInterval(() => {
        goNext();
      }, autoPlay);

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }
  }, [autoPlay, goNext]);

  // Calculate navigation states
  const canGoPrev = loop || index > 0;
  const canGoNext = loop || index < maxIndex;

  return {
    index,
    setIndex,
    goNext,
    goPrev,
    goTo,
    canGoPrev,
    canGoNext,
    maxIndex,
    totalSlides,
    containerRef,
    touchHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}
