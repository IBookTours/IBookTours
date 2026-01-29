/**
 * Payload CMS Content Provider
 *
 * Connects to Payload CMS REST API to fetch content.
 *
 * Required Environment Variables:
 * - PAYLOAD_API_URL: Base URL of your Payload CMS instance (e.g., https://cms.ibooktours.com/api)
 * - PAYLOAD_API_KEY: Optional API key for authentication (if your Payload instance requires it)
 *
 * Usage:
 * Set CMS_PROVIDER=payload in your .env file to use this provider.
 *
 * Payload CMS Setup:
 * 1. Create collections: vacation-packages, day-tours, events, blog-posts, testimonials, destinations
 * 2. Configure fields to match the types expected by IContentProvider
 * 3. Enable REST API in your Payload config
 * 4. Set up CORS if the CMS is on a different domain
 *
 * @see https://payloadcms.com/docs/rest-api/overview
 */

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
import { cmsLogger } from '@/lib/logger';

/**
 * Payload CMS collection names (customize to match your Payload config)
 */
const COLLECTIONS = {
  vacationPackages: 'vacation-packages',
  dayTours: 'day-tours',
  events: 'events',
  blogPosts: 'blog-posts',
  testimonials: 'testimonials',
  destinations: 'destinations',
  siteConfig: 'site-config',
} as const;

/**
 * Cache configuration
 */
const CACHE_TTL = {
  default: 5 * 60 * 1000, // 5 minutes
  siteContent: 10 * 60 * 1000, // 10 minutes
  blogPosts: 2 * 60 * 1000, // 2 minutes
} as const;

/**
 * Simple in-memory cache
 * TODO: Consider Redis for production with multiple instances
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T, ttl: number = CACHE_TTL.default): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

/**
 * Payload CMS Provider Implementation
 */
export class PayloadProvider extends BaseContentProvider {
  private readonly apiUrl: string;
  private readonly apiKey: string | null;
  private readonly cache: SimpleCache;
  private ready: boolean = false;

  constructor(apiUrl?: string, apiKey?: string) {
    super('Payload CMS');

    this.apiUrl = apiUrl || process.env.PAYLOAD_API_URL || '';
    this.apiKey = apiKey || process.env.PAYLOAD_API_KEY || null;
    this.cache = new SimpleCache();

    // Validate configuration
    if (!this.apiUrl) {
      cmsLogger.warn('Payload CMS: PAYLOAD_API_URL not configured');
    } else {
      this.ready = true;
      cmsLogger.info('Payload CMS: Provider initialized', { apiUrl: this.apiUrl });
    }
  }

  /**
   * Check if provider is properly configured
   */
  isReady(): boolean {
    return this.ready;
  }

  /**
   * Make authenticated request to Payload API
   */
  private async fetchFromPayload<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST';
      body?: unknown;
      cache?: boolean;
      cacheTtl?: number;
    } = {}
  ): Promise<T | null> {
    const { method = 'GET', body, cache: useCache = true, cacheTtl = CACHE_TTL.default } = options;

    // Check cache first
    const cacheKey = `${method}:${endpoint}:${JSON.stringify(body || {})}`;
    if (useCache && method === 'GET') {
      const cached = this.cache.get<T>(cacheKey);
      if (cached) {
        cmsLogger.debug('Payload CMS: Cache hit', { endpoint });
        return cached;
      }
    }

    const url = `${this.apiUrl}/${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add API key authentication if configured
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        next: { revalidate: Math.floor(cacheTtl / 1000) }, // Next.js cache
      });

      if (!response.ok) {
        cmsLogger.error('Payload CMS: Request failed', {
          endpoint,
          status: response.status,
          statusText: response.statusText,
        });
        return null;
      }

      const data = (await response.json()) as T;

      // Cache the result
      if (useCache && method === 'GET') {
        this.cache.set(cacheKey, data, cacheTtl);
      }

      return data;
    } catch (error) {
      cmsLogger.error('Payload CMS: Fetch error', {
        endpoint,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  /**
   * Build query string for Payload REST API
   */
  private buildQueryString(options?: ContentQueryOptions): string {
    const params = new URLSearchParams();

    if (options?.limit) {
      params.set('limit', String(options.limit));
    }
    if (options?.offset) {
      params.set('page', String(Math.floor((options.offset || 0) / (options.limit || 10)) + 1));
    }
    if (options?.locale) {
      params.set('locale', options.locale);
    }
    if (options?.orderBy) {
      params.set('sort', options.orderBy);
    }
    if (options?.preview) {
      params.set('draft', 'true');
    }

    // Handle filters
    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(`where[${key}][equals]`, String(value));
        }
      });
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  }

  // ============================================
  // SITE CONTENT
  // ============================================

  async getSiteContent(options?: ContentQueryOptions): Promise<ContentResult<SiteContent>> {
    if (!this.isReady()) {
      return this.error('Payload CMS not configured');
    }

    try {
      // Fetch site configuration from a global/singleton collection
      const config = await this.fetchFromPayload<{
        docs: Array<{
          siteName: string;
          hero: unknown;
          about: unknown;
          // ... other fields
        }>;
      }>(`globals/${COLLECTIONS.siteConfig}${this.buildQueryString(options)}`, {
        cacheTtl: CACHE_TTL.siteContent,
      });

      if (!config) {
        return this.error('Failed to fetch site content');
      }

      // Transform Payload response to SiteContent type
      // TODO: Implement transformation based on your Payload schema
      const siteContent = this.transformToSiteContent(config);

      return this.success(siteContent);
    } catch (error) {
      cmsLogger.error('Payload CMS: getSiteContent failed', { error });
      return this.error('Failed to fetch site content');
    }
  }

  // ============================================
  // VACATION PACKAGES
  // ============================================

  async getVacationPackages(options?: ContentQueryOptions): Promise<ContentResult<VacationPackage[]>> {
    if (!this.isReady()) {
      return this.error('Payload CMS not configured');
    }

    try {
      const response = await this.fetchFromPayload<{
        docs: Array<unknown>;
        totalDocs: number;
      }>(`${COLLECTIONS.vacationPackages}${this.buildQueryString(options)}`);

      if (!response) {
        return this.error('Failed to fetch vacation packages');
      }

      const packages = response.docs.map((doc) => this.transformToVacationPackage(doc));
      return this.success(packages);
    } catch (error) {
      cmsLogger.error('Payload CMS: getVacationPackages failed', { error });
      return this.error('Failed to fetch vacation packages');
    }
  }

  async getVacationPackageBySlug(
    slug: string,
    options?: ContentQueryOptions
  ): Promise<ContentResult<VacationPackage>> {
    if (!this.isReady()) {
      return this.error('Payload CMS not configured');
    }

    try {
      const response = await this.fetchFromPayload<{
        docs: Array<unknown>;
      }>(`${COLLECTIONS.vacationPackages}?where[slug][equals]=${slug}${this.buildQueryString(options).replace('?', '&')}`);

      if (!response || response.docs.length === 0) {
        return this.error(`Vacation package not found: ${slug}`);
      }

      const pkg = this.transformToVacationPackage(response.docs[0]);
      return this.success(pkg);
    } catch (error) {
      cmsLogger.error('Payload CMS: getVacationPackageBySlug failed', { slug, error });
      return this.error('Failed to fetch vacation package');
    }
  }

  async getFeaturedPackages(limit: number = 4): Promise<ContentResult<VacationPackage[]>> {
    return this.getVacationPackages({
      limit,
      filter: { featured: true },
      orderBy: '-createdAt',
    });
  }

  // ============================================
  // DAY TOURS
  // ============================================

  async getDayTours(options?: ContentQueryOptions): Promise<ContentResult<DayTour[]>> {
    if (!this.isReady()) {
      return this.error('Payload CMS not configured');
    }

    try {
      const response = await this.fetchFromPayload<{
        docs: Array<unknown>;
      }>(`${COLLECTIONS.dayTours}${this.buildQueryString(options)}`);

      if (!response) {
        return this.error('Failed to fetch day tours');
      }

      const tours = response.docs.map((doc) => this.transformToDayTour(doc));
      return this.success(tours);
    } catch (error) {
      cmsLogger.error('Payload CMS: getDayTours failed', { error });
      return this.error('Failed to fetch day tours');
    }
  }

  async getDayTourBySlug(slug: string, options?: ContentQueryOptions): Promise<ContentResult<DayTour>> {
    if (!this.isReady()) {
      return this.error('Payload CMS not configured');
    }

    try {
      const response = await this.fetchFromPayload<{
        docs: Array<unknown>;
      }>(`${COLLECTIONS.dayTours}?where[slug][equals]=${slug}${this.buildQueryString(options).replace('?', '&')}`);

      if (!response || response.docs.length === 0) {
        return this.error(`Day tour not found: ${slug}`);
      }

      const tour = this.transformToDayTour(response.docs[0]);
      return this.success(tour);
    } catch (error) {
      cmsLogger.error('Payload CMS: getDayTourBySlug failed', { slug, error });
      return this.error('Failed to fetch day tour');
    }
  }

  async getDayToursByCategory(
    category: string,
    options?: ContentQueryOptions
  ): Promise<ContentResult<DayTour[]>> {
    return this.getDayTours({
      ...options,
      filter: { ...options?.filter, category },
    });
  }

  // ============================================
  // EVENTS
  // ============================================

  async getEvents(options?: ContentQueryOptions): Promise<ContentResult<Event[]>> {
    if (!this.isReady()) {
      return this.error('Payload CMS not configured');
    }

    try {
      const response = await this.fetchFromPayload<{
        docs: Array<unknown>;
      }>(`${COLLECTIONS.events}${this.buildQueryString(options)}`);

      if (!response) {
        return this.error('Failed to fetch events');
      }

      const events = response.docs.map((doc) => this.transformToEvent(doc));
      return this.success(events);
    } catch (error) {
      cmsLogger.error('Payload CMS: getEvents failed', { error });
      return this.error('Failed to fetch events');
    }
  }

  async getUpcomingEvents(limit: number = 4): Promise<ContentResult<Event[]>> {
    const now = new Date().toISOString();
    return this.getEvents({
      limit,
      filter: { 'date[greater_than]': now },
      orderBy: 'date',
    });
  }

  // ============================================
  // BLOG
  // ============================================

  async getBlogPosts(options?: ContentQueryOptions): Promise<PaginatedContent<BlogPost>> {
    if (!this.isReady()) {
      return {
        items: [],
        total: 0,
        hasMore: false,
        page: 1,
        pageSize: options?.limit || 10,
      };
    }

    try {
      const response = await this.fetchFromPayload<{
        docs: Array<unknown>;
        totalDocs: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
      }>(`${COLLECTIONS.blogPosts}${this.buildQueryString(options)}`, {
        cacheTtl: CACHE_TTL.blogPosts,
      });

      if (!response) {
        return {
          items: [],
          total: 0,
          hasMore: false,
          page: 1,
          pageSize: options?.limit || 10,
        };
      }

      const posts = response.docs.map((doc) => this.transformToBlogPost(doc));

      return {
        items: posts,
        total: response.totalDocs,
        hasMore: response.hasNextPage,
        page: response.page,
        pageSize: response.limit,
      };
    } catch (error) {
      cmsLogger.error('Payload CMS: getBlogPosts failed', { error });
      return {
        items: [],
        total: 0,
        hasMore: false,
        page: 1,
        pageSize: options?.limit || 10,
      };
    }
  }

  async getBlogPostBySlug(slug: string, options?: ContentQueryOptions): Promise<ContentResult<BlogPost>> {
    if (!this.isReady()) {
      return this.error('Payload CMS not configured');
    }

    try {
      const response = await this.fetchFromPayload<{
        docs: Array<unknown>;
      }>(`${COLLECTIONS.blogPosts}?where[slug][equals]=${slug}${this.buildQueryString(options).replace('?', '&')}`);

      if (!response || response.docs.length === 0) {
        return this.error(`Blog post not found: ${slug}`);
      }

      const post = this.transformToBlogPost(response.docs[0]);
      return this.success(post);
    } catch (error) {
      cmsLogger.error('Payload CMS: getBlogPostBySlug failed', { slug, error });
      return this.error('Failed to fetch blog post');
    }
  }

  // ============================================
  // TESTIMONIALS
  // ============================================

  async getTestimonials(limit: number = 6): Promise<ContentResult<Testimonial[]>> {
    if (!this.isReady()) {
      return this.error('Payload CMS not configured');
    }

    try {
      const response = await this.fetchFromPayload<{
        docs: Array<unknown>;
      }>(`${COLLECTIONS.testimonials}${this.buildQueryString({ limit })}`);

      if (!response) {
        return this.error('Failed to fetch testimonials');
      }

      const testimonials = response.docs.map((doc) => this.transformToTestimonial(doc));
      return this.success(testimonials);
    } catch (error) {
      cmsLogger.error('Payload CMS: getTestimonials failed', { error });
      return this.error('Failed to fetch testimonials');
    }
  }

  // ============================================
  // DESTINATIONS
  // ============================================

  async getFeaturedDestinations(limit: number = 6): Promise<ContentResult<Destination[]>> {
    if (!this.isReady()) {
      return this.error('Payload CMS not configured');
    }

    try {
      const response = await this.fetchFromPayload<{
        docs: Array<unknown>;
      }>(`${COLLECTIONS.destinations}${this.buildQueryString({ limit, filter: { featured: true } })}`);

      if (!response) {
        return this.error('Failed to fetch destinations');
      }

      const destinations = response.docs.map((doc) => this.transformToDestination(doc));
      return this.success(destinations);
    } catch (error) {
      cmsLogger.error('Payload CMS: getFeaturedDestinations failed', { error });
      return this.error('Failed to fetch destinations');
    }
  }

  // ============================================
  // DATA TRANSFORMERS
  // ============================================
  // These methods transform Payload CMS data to match your app's types.
  // Customize these based on your Payload collection schemas.

  /**
   * Transform Payload response to SiteContent
   * TODO: Implement based on your Payload site-config global schema
   */
  private transformToSiteContent(data: unknown): SiteContent {
    // Placeholder implementation - customize based on your Payload schema
    // This should map Payload fields to your SiteContent type
    const payload = data as Record<string, unknown>;
    return payload as unknown as SiteContent;
  }

  /**
   * Transform Payload document to VacationPackage
   * TODO: Implement based on your vacation-packages collection schema
   */
  private transformToVacationPackage(doc: unknown): VacationPackage {
    const data = doc as Record<string, unknown>;

    // Example transformation - customize based on your Payload schema
    return {
      id: String(data.id || data._id || ''),
      slug: String(data.slug || ''),
      name: String(data.name || data.title || ''),
      destination: String(data.destination || ''),
      description: String(data.description || ''),
      duration: String(data.duration || ''),
      price: String(data.price || '0'),
      originalPrice: data.originalPrice ? String(data.originalPrice) : undefined,
      image: String(data.image || (data.featuredImage as Record<string, unknown>)?.url || ''),
      rating: Number(data.rating || 0),
      reviews: Number(data.reviews || 0),
      highlights: Array.isArray(data.highlights) ? data.highlights.map(String) : [],
      included: Array.isArray(data.included) ? data.included.map(String) : [],
      itinerary: Array.isArray(data.itinerary)
        ? data.itinerary.map((item: unknown) => {
            const i = item as Record<string, unknown>;
            return {
              day: Number(i.day || 0),
              title: String(i.title || ''),
              description: String(i.description || ''),
            };
          })
        : [],
      featured: Boolean(data.featured),
      popular: Boolean(data.popular),
      discount: data.discount ? Number(data.discount) : undefined,
      badge: data.badge ? String(data.badge) : undefined,
    };
  }

  /**
   * Transform Payload document to DayTour
   * TODO: Implement based on your day-tours collection schema
   */
  private transformToDayTour(doc: unknown): DayTour {
    const data = doc as Record<string, unknown>;

    return {
      id: String(data.id || data._id || ''),
      slug: String(data.slug || ''),
      name: String(data.name || data.title || ''),
      location: String(data.location || ''),
      description: String(data.description || ''),
      duration: String(data.duration || ''),
      price: String(data.price || '0'),
      image: String(data.image || (data.featuredImage as Record<string, unknown>)?.url || ''),
      rating: Number(data.rating || 0),
      reviews: Number(data.reviews || 0),
      category: String(data.category || 'adventure'),
      groupSize: Number(data.groupSize || 10),
      highlights: Array.isArray(data.highlights) ? data.highlights.map(String) : [],
      included: Array.isArray(data.included) ? data.included.map(String) : [],
      startTime: String(data.startTime || ''),
      featured: Boolean(data.featured),
      popular: Boolean(data.popular),
    };
  }

  /**
   * Transform Payload document to Event
   * TODO: Implement based on your events collection schema
   */
  private transformToEvent(doc: unknown): Event {
    const data = doc as Record<string, unknown>;

    return {
      id: String(data.id || data._id || ''),
      title: String(data.title || data.name || ''),
      description: String(data.description || ''),
      date: String(data.date || ''),
      location: String(data.location || ''),
      image: String(data.image || (data.featuredImage as Record<string, unknown>)?.url || ''),
      category: String(data.category || ''),
      price: data.price ? String(data.price) : undefined,
      ticketUrl: data.ticketUrl ? String(data.ticketUrl) : undefined,
    };
  }

  /**
   * Transform Payload document to BlogPost
   * TODO: Implement based on your blog-posts collection schema
   */
  private transformToBlogPost(doc: unknown): BlogPost {
    const data = doc as Record<string, unknown>;

    return {
      id: String(data.id || data._id || ''),
      slug: String(data.slug || ''),
      title: String(data.title || ''),
      excerpt: String(data.excerpt || data.description || ''),
      content: String(data.content || ''),
      image: String(data.image || (data.featuredImage as Record<string, unknown>)?.url || ''),
      author: String(data.author || 'IBookTours Team'),
      date: String(data.date || data.publishedAt || data.createdAt || ''),
      category: String(data.category || ''),
      readTime: Number(data.readTime || 5),
    };
  }

  /**
   * Transform Payload document to Testimonial
   * TODO: Implement based on your testimonials collection schema
   */
  private transformToTestimonial(doc: unknown): Testimonial {
    const data = doc as Record<string, unknown>;

    return {
      id: String(data.id || data._id || ''),
      name: String(data.name || data.author || ''),
      location: String(data.location || ''),
      rating: Number(data.rating || 5),
      text: String(data.text || data.content || data.review || ''),
      image: String(data.image || (data.avatar as Record<string, unknown>)?.url || ''),
      tourName: String(data.tourName || data.tour || ''),
    };
  }

  /**
   * Transform Payload document to Destination
   * TODO: Implement based on your destinations collection schema
   */
  private transformToDestination(doc: unknown): Destination {
    const data = doc as Record<string, unknown>;

    return {
      id: String(data.id || data._id || ''),
      name: String(data.name || data.title || ''),
      description: String(data.description || ''),
      image: String(data.image || (data.featuredImage as Record<string, unknown>)?.url || ''),
      tours: Number(data.tours || data.tourCount || 0),
      slug: String(data.slug || ''),
    };
  }

  /**
   * Clear internal cache
   */
  clearCache(): void {
    this.cache.clear();
    cmsLogger.info('Payload CMS: Cache cleared');
  }
}
