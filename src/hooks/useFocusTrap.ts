'use client';

import { useEffect, useRef, useCallback } from 'react';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

interface UseFocusTrapOptions {
  /** Whether the focus trap is currently active */
  isActive: boolean;
  /** Callback when Escape key is pressed */
  onEscape?: () => void;
  /** Whether to restore focus to the trigger element when trap is deactivated */
  restoreFocus?: boolean;
  /** Initial element to focus when trap is activated (defaults to first focusable) */
  initialFocus?: React.RefObject<HTMLElement>;
}

/**
 * Custom hook that traps keyboard focus within a container element.
 * Essential for WCAG 2.1 AA compliance in modal dialogs and overlays.
 *
 * Features:
 * - Traps Tab and Shift+Tab within container
 * - Handles Escape key to close
 * - Restores focus to trigger element when closed
 * - Auto-focuses first focusable element
 *
 * @param options Configuration options
 * @returns Ref to attach to the container element
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  options: UseFocusTrapOptions
): React.RefObject<T> {
  const { isActive, onEscape, restoreFocus = true, initialFocus } = options;
  const containerRef = useRef<T>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Get all focusable elements within the container
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    ).filter((el) => {
      // Exclude hidden elements
      return el.offsetParent !== null && !el.hasAttribute('aria-hidden');
    });
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Store the currently focused element to restore later
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the initial element or first focusable
    const focusableElements = getFocusableElements();
    if (initialFocus?.current) {
      initialFocus.current.focus();
    } else if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Escape key
      if (event.key === 'Escape' && onEscape) {
        event.preventDefault();
        onEscape();
        return;
      }

      // Handle Tab key for focus trapping
      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      // Shift + Tab on first element -> go to last
      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      // Tab on last element -> go to first
      else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus when trap is deactivated
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive, onEscape, restoreFocus, initialFocus, getFocusableElements]);

  return containerRef;
}

/**
 * Hook for announcing content changes to screen readers
 * Uses aria-live regions for dynamic content updates
 */
export function useAriaLive() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    // Create or get the announcer element
    let announcer = document.getElementById('aria-live-announcer');

    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'aria-live-announcer';
      announcer.setAttribute('aria-live', priority);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'visually-hidden';
      document.body.appendChild(announcer);
    } else {
      announcer.setAttribute('aria-live', priority);
    }

    // Clear and set message (needed for repeated announcements)
    announcer.textContent = '';
    requestAnimationFrame(() => {
      if (announcer) {
        announcer.textContent = message;
      }
    });
  }, []);

  return { announce };
}

export default useFocusTrap;
