// ============================================
// DISPLAY LIMITS CONFIGURATION
// ============================================
// Centralized configuration for how many items to display
// in various sections across different screen sizes.
// This provides a single source of truth for display limits.

/**
 * Responsive display limits for different viewport sizes
 */
export interface ResponsiveLimit {
  /** Mobile viewport (< 768px) */
  mobile: number;
  /** Tablet viewport (768px - 1023px) */
  tablet: number;
  /** Desktop viewport (>= 1024px) */
  desktop: number;
}

/**
 * Section-specific display configurations
 */
export const DISPLAY_LIMITS = {
  /**
   * Vacation Packages Section
   * - Mobile: 2 cards per carousel slide
   * - Tablet: 2 cards per slide
   * - Desktop: Grid of 3 cards
   */
  vacationPackages: {
    mobile: 2,
    tablet: 2,
    desktop: 3,
  } as ResponsiveLimit,

  /**
   * Day Tours Section
   * - Mobile: 1 card carousel
   * - Tablet: 3 cards in row
   * - Desktop: 3 cards grid
   */
  dayTours: {
    mobile: 1,
    tablet: 3,
    desktop: 3,
  } as ResponsiveLimit,

  /**
   * Testimonials Section
   * - Mobile: 1 testimonial carousel
   * - Tablet: 2 testimonials
   * - Desktop: 3 testimonials
   */
  testimonials: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  } as ResponsiveLimit,

  /**
   * Destinations Section
   * - Mobile: 1 destination carousel
   * - Tablet: 2 destinations
   * - Desktop: 3 destinations
   */
  destinations: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  } as ResponsiveLimit,

  /**
   * Events Section
   * - Mobile: 2 events carousel
   * - Tablet: 2 events
   * - Desktop: 3 events
   */
  events: {
    mobile: 2,
    tablet: 2,
    desktop: 3,
  } as ResponsiveLimit,

  /**
   * Blog Section
   * - Mobile: 1 blog card carousel
   * - Tablet: 2 blog cards
   * - Desktop: Grid with featured + regular
   */
  blog: {
    mobile: 1,
    tablet: 2,
    desktop: 5, // 1 featured + 4 regular
  } as ResponsiveLimit,

  /**
   * Adventure Categories
   * - Mobile: 1 category carousel
   * - Tablet: 2 categories with featured
   * - Desktop: 5 in bento layout
   */
  adventureCategories: {
    mobile: 1,
    tablet: 4,
    desktop: 5,
  } as ResponsiveLimit,

  /**
   * About Page Reviews/Testimonials
   * - Mobile: 1 review carousel
   * - Tablet: 2 reviews
   * - Desktop: 3-6 reviews grid
   */
  aboutReviews: {
    mobile: 1,
    tablet: 2,
    desktop: 6,
  } as ResponsiveLimit,

  /**
   * Partners Section - Number of logos
   */
  partners: {
    mobile: 4,
    tablet: 6,
    desktop: 8,
  } as ResponsiveLimit,
} as const;

/**
 * Content limits (not screen-size dependent)
 */
export const CONTENT_LIMITS = {
  /** Maximum highlights to show on cards */
  highlights: 3,

  /** Maximum upsell items to show */
  upsells: 3,

  /** Maximum similar tours to show */
  similarTours: 4,

  /** Maximum FAQ items to show in summary */
  faqSummary: 5,

  /** Maximum team members to show */
  teamMembers: 8,

  /** Maximum gallery images per tour */
  galleryImages: 12,

  /** Maximum itinerary days to expand by default */
  itineraryExpanded: 3,
} as const;

/**
 * Pagination settings
 */
export const PAGINATION = {
  /** Items per page on tours listing */
  toursPerPage: 12,

  /** Items per page on blog listing */
  blogPerPage: 9,

  /** Items per page on destination listing */
  destinationsPerPage: 12,
} as const;

/**
 * Helper function to get responsive limit based on screen size
 */
export function getResponsiveLimit(
  limits: ResponsiveLimit,
  screenType: 'mobile' | 'tablet' | 'desktop'
): number {
  return limits[screenType];
}

/**
 * Helper to get display limit from config
 * Usage: const limit = getDisplayLimit('vacationPackages', 'mobile');
 */
export function getDisplayLimit(
  section: keyof typeof DISPLAY_LIMITS,
  screenType: 'mobile' | 'tablet' | 'desktop'
): number {
  return DISPLAY_LIMITS[section][screenType];
}

export default DISPLAY_LIMITS;
