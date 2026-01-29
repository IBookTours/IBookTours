/**
 * Mock Content Provider
 *
 * Wraps the existing hardcoded siteData for development.
 * Replace with SanityProvider or StrapiProvider for production CMS.
 */

import { siteData } from '@/data/siteData';
import { BaseContentProvider } from './ContentService';
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

export class MockContentProvider extends BaseContentProvider {
  constructor() {
    super('mock');
  }

  isReady(): boolean {
    return true;
  }

  // ============================================
  // SITE CONTENT
  // ============================================

  async getSiteContent(_options?: ContentQueryOptions): Promise<ContentResult<SiteContent>> {
    return this.success(siteData);
  }

  // ============================================
  // VACATION PACKAGES
  // ============================================

  async getVacationPackages(options?: ContentQueryOptions): Promise<ContentResult<VacationPackage[]>> {
    let packages = [...siteData.vacationPackages];

    if (options?.limit) {
      packages = packages.slice(options.offset ?? 0, (options.offset ?? 0) + options.limit);
    }

    return this.success(packages);
  }

  async getVacationPackageBySlug(slug: string, _options?: ContentQueryOptions): Promise<ContentResult<VacationPackage>> {
    // Mock data uses `id` as identifier; real CMS providers would use actual slugs
    const pkg = siteData.vacationPackages.find(p => p.id === slug);
    if (!pkg) {
      return this.error(`Package not found: ${slug}`);
    }
    return this.success(pkg);
  }

  async getFeaturedPackages(limit: number = 4): Promise<ContentResult<VacationPackage[]>> {
    const featured = siteData.vacationPackages
      .filter(p => p.promoBadge === 'featured')
      .slice(0, limit);
    // If no featured packages found, return first N packages
    if (featured.length === 0) {
      return this.success(siteData.vacationPackages.slice(0, limit));
    }
    return this.success(featured);
  }

  // ============================================
  // DAY TOURS
  // ============================================

  async getDayTours(options?: ContentQueryOptions): Promise<ContentResult<DayTour[]>> {
    let tours = [...siteData.dayTours];

    if (options?.filter?.category) {
      tours = tours.filter(t => t.category === options.filter?.category);
    }

    if (options?.limit) {
      tours = tours.slice(options.offset ?? 0, (options.offset ?? 0) + options.limit);
    }

    return this.success(tours);
  }

  async getDayTourBySlug(slug: string, _options?: ContentQueryOptions): Promise<ContentResult<DayTour>> {
    // Mock data uses `id` as identifier; real CMS providers would use actual slugs
    const tour = siteData.dayTours.find(t => t.id === slug);
    if (!tour) {
      return this.error(`Tour not found: ${slug}`);
    }
    return this.success(tour);
  }

  async getDayToursByCategory(category: string, options?: ContentQueryOptions): Promise<ContentResult<DayTour[]>> {
    let tours = siteData.dayTours.filter(t => t.category === category);

    if (options?.limit) {
      tours = tours.slice(options.offset ?? 0, (options.offset ?? 0) + options.limit);
    }

    return this.success(tours);
  }

  // ============================================
  // EVENTS
  // ============================================

  async getEvents(_options?: ContentQueryOptions): Promise<ContentResult<Event[]>> {
    return this.success(siteData.events.events);
  }

  async getUpcomingEvents(limit: number = 6): Promise<ContentResult<Event[]>> {
    const now = new Date();
    const upcoming = siteData.events.events
      .filter((e): e is Event & { date: string } => !!e.date && new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit);
    return this.success(upcoming);
  }

  // ============================================
  // BLOG
  // ============================================

  async getBlogPosts(options?: ContentQueryOptions): Promise<PaginatedContent<BlogPost>> {
    const posts = siteData.blog.posts;
    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? 10;

    const items = posts.slice(offset, offset + limit);

    return {
      items,
      total: posts.length,
      hasMore: offset + limit < posts.length,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
    };
  }

  async getBlogPostBySlug(slug: string, _options?: ContentQueryOptions): Promise<ContentResult<BlogPost>> {
    // Mock data uses `id` as identifier; real CMS providers would use actual slugs
    const post = siteData.blog.posts.find(p => p.id === slug);
    if (!post) {
      return this.error(`Blog post not found: ${slug}`);
    }
    return this.success(post);
  }

  // ============================================
  // TESTIMONIALS
  // ============================================

  async getTestimonials(limit: number = 10): Promise<ContentResult<Testimonial[]>> {
    const testimonials = siteData.testimonials.testimonials.slice(0, limit);
    return this.success(testimonials);
  }

  // ============================================
  // DESTINATIONS
  // ============================================

  async getFeaturedDestinations(limit: number = 8): Promise<ContentResult<Destination[]>> {
    const destinations = siteData.destinations
      .filter(d => d.featured)
      .slice(0, limit);
    return this.success(destinations);
  }
}
