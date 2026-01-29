/**
 * CMS Module Exports
 *
 * Factory for content providers.
 * Set CMS_PROVIDER env variable to switch CMS backends:
 * - 'mock' (default) - Uses static data from data files
 * - 'payload' - Payload CMS (requires PAYLOAD_API_URL)
 * - 'sanity' - Sanity CMS (requires SANITY_PROJECT_ID)
 */

import { IContentProvider } from './ContentService';
import { MockContentProvider } from './MockContentProvider';

// Export types
export * from './types';
export type { IContentProvider } from './ContentService';
export { BaseContentProvider } from './ContentService';
export { MockContentProvider } from './MockContentProvider';

/**
 * Content provider singleton
 */
let contentProvider: IContentProvider | null = null;

/**
 * Supported CMS provider types
 */
export type CMSProviderType = 'mock' | 'payload' | 'sanity';

/**
 * Get the configured content provider based on CMS_PROVIDER env variable
 *
 * Supported providers:
 * - 'mock' (default): Uses MockContentProvider with static data
 * - 'payload': Payload CMS (implement PayloadProvider when ready)
 * - 'sanity': Sanity CMS (implement SanityProvider when ready)
 */
export function getContentProvider(): IContentProvider {
  if (!contentProvider) {
    const providerType = (process.env.CMS_PROVIDER || 'mock') as CMSProviderType;

    switch (providerType) {
      case 'payload':
        // Placeholder for Payload CMS integration
        // When ready: import PayloadProvider and instantiate with PAYLOAD_API_URL
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '[CMS] Payload provider not yet implemented, falling back to mock'
          );
        }
        contentProvider = new MockContentProvider();
        break;

      case 'sanity':
        // Placeholder for Sanity CMS integration
        // When ready: import SanityProvider and instantiate with SANITY_PROJECT_ID
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '[CMS] Sanity provider not yet implemented, falling back to mock'
          );
        }
        contentProvider = new MockContentProvider();
        break;

      case 'mock':
      default:
        contentProvider = new MockContentProvider();
        break;
    }
  }
  return contentProvider;
}

/**
 * Reset provider (useful for testing)
 */
export function resetContentProvider(): void {
  contentProvider = null;
}

/**
 * Convenience exports for common operations
 */
export const cms = {
  getSiteContent: () => getContentProvider().getSiteContent(),
  getVacationPackages: (options?: Parameters<IContentProvider['getVacationPackages']>[0]) =>
    getContentProvider().getVacationPackages(options),
  getVacationPackageBySlug: (slug: string) => getContentProvider().getVacationPackageBySlug(slug),
  getDayTours: (options?: Parameters<IContentProvider['getDayTours']>[0]) =>
    getContentProvider().getDayTours(options),
  getDayTourBySlug: (slug: string) => getContentProvider().getDayTourBySlug(slug),
  getEvents: () => getContentProvider().getEvents(),
  getBlogPosts: (options?: Parameters<IContentProvider['getBlogPosts']>[0]) =>
    getContentProvider().getBlogPosts(options),
  getBlogPostBySlug: (slug: string) => getContentProvider().getBlogPostBySlug(slug),
  getTestimonials: (limit?: number) => getContentProvider().getTestimonials(limit),
  getFeaturedDestinations: (limit?: number) => getContentProvider().getFeaturedDestinations(limit),
};
