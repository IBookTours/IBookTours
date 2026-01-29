/**
 * Content Service Interface
 *
 * Abstract interface for content providers.
 * Implementations: MockContentProvider, SanityProvider, StrapiProvider, etc.
 */

import {
  ContentQueryOptions,
  ContentResult,
  PaginatedContent,
  SiteContent,
  VacationPackage,
  DayTour,
  Event,
  BlogPost,
  Testimonial,
  Destination,
} from './types';

/**
 * Content provider interface
 */
export interface IContentProvider {
  /**
   * Get the provider name
   */
  getProviderName(): string;

  /**
   * Check if provider is ready
   */
  isReady(): boolean;

  // ============================================
  // SITE CONTENT
  // ============================================

  /**
   * Get complete site content (for SSG)
   */
  getSiteContent(options?: ContentQueryOptions): Promise<ContentResult<SiteContent>>;

  // ============================================
  // VACATION PACKAGES
  // ============================================

  /**
   * Get all vacation packages
   */
  getVacationPackages(options?: ContentQueryOptions): Promise<ContentResult<VacationPackage[]>>;

  /**
   * Get a single vacation package by slug
   */
  getVacationPackageBySlug(slug: string, options?: ContentQueryOptions): Promise<ContentResult<VacationPackage>>;

  /**
   * Get featured vacation packages
   */
  getFeaturedPackages(limit?: number): Promise<ContentResult<VacationPackage[]>>;

  // ============================================
  // DAY TOURS
  // ============================================

  /**
   * Get all day tours
   */
  getDayTours(options?: ContentQueryOptions): Promise<ContentResult<DayTour[]>>;

  /**
   * Get a single day tour by slug
   */
  getDayTourBySlug(slug: string, options?: ContentQueryOptions): Promise<ContentResult<DayTour>>;

  /**
   * Get day tours by category
   */
  getDayToursByCategory(category: string, options?: ContentQueryOptions): Promise<ContentResult<DayTour[]>>;

  // ============================================
  // EVENTS
  // ============================================

  /**
   * Get all events
   */
  getEvents(options?: ContentQueryOptions): Promise<ContentResult<Event[]>>;

  /**
   * Get upcoming events
   */
  getUpcomingEvents(limit?: number): Promise<ContentResult<Event[]>>;

  // ============================================
  // BLOG
  // ============================================

  /**
   * Get all blog posts
   */
  getBlogPosts(options?: ContentQueryOptions): Promise<PaginatedContent<BlogPost>>;

  /**
   * Get a single blog post by slug
   */
  getBlogPostBySlug(slug: string, options?: ContentQueryOptions): Promise<ContentResult<BlogPost>>;

  // ============================================
  // TESTIMONIALS
  // ============================================

  /**
   * Get testimonials
   */
  getTestimonials(limit?: number): Promise<ContentResult<Testimonial[]>>;

  // ============================================
  // DESTINATIONS
  // ============================================

  /**
   * Get featured destinations
   */
  getFeaturedDestinations(limit?: number): Promise<ContentResult<Destination[]>>;
}

/**
 * Abstract base class for content providers
 */
export abstract class BaseContentProvider implements IContentProvider {
  protected readonly providerName: string;

  constructor(providerName: string) {
    this.providerName = providerName;
  }

  getProviderName(): string {
    return this.providerName;
  }

  abstract isReady(): boolean;
  abstract getSiteContent(options?: ContentQueryOptions): Promise<ContentResult<SiteContent>>;
  abstract getVacationPackages(options?: ContentQueryOptions): Promise<ContentResult<VacationPackage[]>>;
  abstract getVacationPackageBySlug(slug: string, options?: ContentQueryOptions): Promise<ContentResult<VacationPackage>>;
  abstract getFeaturedPackages(limit?: number): Promise<ContentResult<VacationPackage[]>>;
  abstract getDayTours(options?: ContentQueryOptions): Promise<ContentResult<DayTour[]>>;
  abstract getDayTourBySlug(slug: string, options?: ContentQueryOptions): Promise<ContentResult<DayTour>>;
  abstract getDayToursByCategory(category: string, options?: ContentQueryOptions): Promise<ContentResult<DayTour[]>>;
  abstract getEvents(options?: ContentQueryOptions): Promise<ContentResult<Event[]>>;
  abstract getUpcomingEvents(limit?: number): Promise<ContentResult<Event[]>>;
  abstract getBlogPosts(options?: ContentQueryOptions): Promise<PaginatedContent<BlogPost>>;
  abstract getBlogPostBySlug(slug: string, options?: ContentQueryOptions): Promise<ContentResult<BlogPost>>;
  abstract getTestimonials(limit?: number): Promise<ContentResult<Testimonial[]>>;
  abstract getFeaturedDestinations(limit?: number): Promise<ContentResult<Destination[]>>;

  /**
   * Helper to create success result
   */
  protected success<T>(data: T): ContentResult<T> {
    return { data };
  }

  /**
   * Helper to create error result
   */
  protected error<T>(message: string): ContentResult<T> {
    return { data: null, error: message };
  }
}
