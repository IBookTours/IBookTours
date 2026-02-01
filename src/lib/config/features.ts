/**
 * Feature Flags Configuration
 *
 * Environment-based feature toggles for enabling/disabling site features.
 * When a feature is disabled:
 * - Navigation links are hidden
 * - Pages redirect gracefully (no 404/403)
 * - Homepage sections are hidden
 *
 * Usage:
 * ```tsx
 * import { isFeatureEnabled } from '@/lib/config/features';
 *
 * if (isFeatureEnabled('carRental')) {
 *   // Show car rental content
 * }
 * ```
 */

export type FeatureKey =
  | 'carRental'
  | 'hotels'
  | 'vacationPackages'
  | 'dayTours'
  | 'events'
  | 'blog';

/**
 * Feature configuration with route and nav mappings
 */
export const FEATURE_CONFIG: Record<FeatureKey, {
  envVar: string;
  routes: string[];
  navIds: string[];
  defaultEnabled: boolean;
}> = {
  carRental: {
    envVar: 'NEXT_PUBLIC_FEATURE_CAR_RENTAL',
    routes: ['/car-rental'],
    navIds: ['carRental'],
    defaultEnabled: true,
  },
  hotels: {
    envVar: 'NEXT_PUBLIC_FEATURE_HOTELS',
    routes: ['/hotels'],
    navIds: ['hotels'],
    defaultEnabled: false, // Not yet implemented
  },
  vacationPackages: {
    envVar: 'NEXT_PUBLIC_FEATURE_VACATION_PACKAGES',
    routes: [],
    navIds: [],
    defaultEnabled: true,
  },
  dayTours: {
    envVar: 'NEXT_PUBLIC_FEATURE_DAY_TOURS',
    routes: [],
    navIds: [],
    defaultEnabled: true,
  },
  events: {
    envVar: 'NEXT_PUBLIC_FEATURE_EVENTS',
    routes: ['/events'],
    navIds: ['events'],
    defaultEnabled: true,
  },
  blog: {
    envVar: 'NEXT_PUBLIC_FEATURE_BLOG',
    routes: ['/blog'],
    navIds: ['blog'],
    defaultEnabled: true,
  },
};

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: FeatureKey): boolean {
  const config = FEATURE_CONFIG[feature];
  const envValue = process.env[config.envVar];

  // If env var is not set, use default
  if (envValue === undefined || envValue === '') {
    return config.defaultEnabled;
  }

  // Parse boolean from string
  return envValue.toLowerCase() === 'true';
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): FeatureKey[] {
  return (Object.keys(FEATURE_CONFIG) as FeatureKey[]).filter(isFeatureEnabled);
}

/**
 * Get all disabled features
 */
export function getDisabledFeatures(): FeatureKey[] {
  return (Object.keys(FEATURE_CONFIG) as FeatureKey[]).filter(f => !isFeatureEnabled(f));
}

/**
 * Check if a route should be accessible
 * Returns true if the route is not associated with a disabled feature
 */
export function isRouteEnabled(pathname: string): boolean {
  for (const [feature, config] of Object.entries(FEATURE_CONFIG)) {
    for (const route of config.routes) {
      if (pathname.startsWith(route) && !isFeatureEnabled(feature as FeatureKey)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Check if a navigation item should be shown
 */
export function isNavItemEnabled(navId: string): boolean {
  for (const [feature, config] of Object.entries(FEATURE_CONFIG)) {
    if (config.navIds.includes(navId) && !isFeatureEnabled(feature as FeatureKey)) {
      return false;
    }
  }
  return true;
}

/**
 * Get the redirect path for a disabled feature
 */
export function getDisabledFeatureRedirect(): string {
  return '/tours';
}
