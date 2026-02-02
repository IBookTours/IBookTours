'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to detect media query matches
 * @param query - CSS media query string (e.g., '(max-width: 767px)')
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create listener for changes
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Add event listener
    media.addEventListener('change', listener);

    // Cleanup
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Convenience hooks for common breakpoints
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsPhone = () => useMediaQuery('(max-width: 639px)');

/**
 * Detect if the device is a touch device
 * Uses multiple detection methods for accuracy:
 * - Touch events support (ontouchstart)
 * - Touch points capability (maxTouchPoints)
 * - Coarse pointer media query (touch/stylus vs mouse)
 * - No hover capability (touch screens don't hover)
 *
 * This distinguishes actual touch devices from desktop browsers
 * at narrow viewport widths.
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkTouch = () => {
      // Check for touch capability
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Check for coarse pointer (touch/stylus vs mouse)
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

      // Check for no hover capability (touch screens)
      const hasNoHover = window.matchMedia('(hover: none)').matches;

      // Device is touch if it has touch capability AND (coarse pointer OR no hover)
      setIsTouch(hasTouch && (hasCoarsePointer || hasNoHover));
    };

    checkTouch();

    // Listen for pointer type changes (e.g., docking/undocking tablet)
    const pointerQuery = window.matchMedia('(pointer: coarse)');
    const hoverQuery = window.matchMedia('(hover: none)');

    const handleChange = () => checkTouch();

    pointerQuery.addEventListener('change', handleChange);
    hoverQuery.addEventListener('change', handleChange);

    return () => {
      pointerQuery.removeEventListener('change', handleChange);
      hoverQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isTouch;
}
