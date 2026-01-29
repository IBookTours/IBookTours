/**
 * Timing Constants
 *
 * Centralized timing values for animations, delays, and timeouts.
 * Prevents magic numbers scattered throughout the codebase.
 */

export const TIMING = {
  // UI Feedback
  BANNER_SHOW_DELAY: 1000,
  COPY_FEEDBACK_DURATION: 2000,
  TOAST_DURATION: 3000,
  TOOLTIP_DELAY: 300,

  // Loading states
  LOADING_MIN_DURATION: 500, // Minimum loading time to prevent flash
  VIDEO_LOAD_TIMEOUT: 8000,

  // Payment
  PAYMENT_SIMULATION_DELAY: 1500,

  // Debounce/Throttle
  SEARCH_DEBOUNCE: 300,
  RESIZE_DEBOUNCE: 150,
  SCROLL_THROTTLE: 100,

  // Transitions
  TRANSITION_FAST: 150,
  TRANSITION_NORMAL: 300,
  TRANSITION_SLOW: 500,

  // Auto-hide
  ALERT_AUTO_HIDE: 5000,
  SUCCESS_MESSAGE_DURATION: 3000,
  ERROR_MESSAGE_DURATION: 5000,
} as const;

/**
 * Animation constants
 */
export const ANIMATION = {
  // Intersection Observer thresholds
  THRESHOLD_LIGHT: 0.1,    // VideoBackground, VacationPackages, Partners, Footer, DayTours
  THRESHOLD_MEDIUM: 0.15,  // BlogSection, EventsSection
  THRESHOLD_STANDARD: 0.2, // BookingSection, Adventure, About, Destinations, Testimonials
  THRESHOLD_HEAVY: 0.3,    // StatsSection, CTASection

  // Stagger delays for lists
  STAGGER_DELAY: 100,
  STAGGER_DELAY_FAST: 50,

  // Easing functions (for reference - use CSS)
  EASE_OUT: 'cubic-bezier(0.16, 1, 0.3, 1)',
  EASE_IN_OUT: 'cubic-bezier(0.65, 0, 0.35, 1)',
} as const;

export type TimingConfig = typeof TIMING;
export type AnimationConfig = typeof ANIMATION;
