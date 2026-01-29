/**
 * CMS Module Exports
 *
 * Factory for content providers.
 * Change the provider here to switch CMS backends.
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
 * Get the configured content provider
 *
 * To switch providers, modify this function:
 * - For Sanity: return new SanityProvider(config)
 * - For Strapi: return new StrapiProvider(config)
 */
export function getContentProvider(): IContentProvider {
  if (!contentProvider) {
    // Use mock provider by default
    // TODO: Check env vars and instantiate real CMS provider
    contentProvider = new MockContentProvider();
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
