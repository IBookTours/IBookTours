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
   *
   * Expected Payload 'site-config' global schema:
   * ```typescript
   * const SiteConfig: GlobalConfig = {
   *   slug: 'site-config',
   *   fields: [
   *     { name: 'siteName', type: 'text', required: true },
   *     { name: 'siteDescription', type: 'textarea' },
   *     { name: 'logo', type: 'upload', relationTo: 'media' },
   *     { name: 'favicon', type: 'upload', relationTo: 'media' },
   *     { name: 'heroSection', type: 'group', fields: [...] },
   *     { name: 'aboutSection', type: 'group', fields: [...] },
   *     { name: 'socialLinks', type: 'array', fields: [...] },
   *   ]
   * };
   * ```
   */
  private transformToSiteContent(data: unknown): SiteContent {
    // Placeholder implementation - customize based on your Payload schema
    // This should map Payload fields to your SiteContent type
    const payload = data as Record<string, unknown>;
    return payload as unknown as SiteContent;
  }

  /**
   * Transform Payload document to VacationPackage
   *
   * Expected Payload 'vacation-packages' collection schema:
   * ```typescript
   * const VacationPackages: CollectionConfig = {
   *   slug: 'vacation-packages',
   *   fields: [
   *     { name: 'destination', type: 'text', required: true },
   *     { name: 'location', type: 'text', required: true },
   *     { name: 'slug', type: 'text', unique: true },
   *     { name: 'departureCities', type: 'array', fields: [{ name: 'city', type: 'text' }] },
   *     { name: 'hotel', type: 'group', fields: [
   *       { name: 'name', type: 'text' },
   *       { name: 'rating', type: 'number', min: 1, max: 5 }
   *     ]},
   *     { name: 'duration', type: 'text' }, // e.g., "7 days / 6 nights"
   *     { name: 'nights', type: 'number' },
   *     { name: 'pricePerPerson', type: 'text' }, // e.g., "€1,299"
   *     { name: 'featuredImage', type: 'upload', relationTo: 'media' },
   *     { name: 'highlights', type: 'array', fields: [{ name: 'item', type: 'text' }] },
   *     { name: 'includes', type: 'group', fields: [
   *       { name: 'flights', type: 'checkbox' },
   *       { name: 'hotel', type: 'checkbox' }
   *     ]},
   *     { name: 'rating', type: 'number' },
   *     { name: 'reviewCount', type: 'number' },
   *     { name: 'featured', type: 'checkbox' },
   *     { name: 'promoBadge', type: 'select', options: ['bestSeller', 'newArrival', 'lastMinute', 'exclusive'] },
   *     { name: 'discountPercent', type: 'number' },
   *     { name: 'originalPrice', type: 'text' }
   *   ]
   * };
   * ```
   */
  private transformToVacationPackage(doc: unknown): VacationPackage {
    const data = doc as Record<string, unknown>;

    // Transform to match VacationPackage interface from types/index.ts
    return {
      id: String(data.id || data._id || ''),
      destination: String(data.destination || ''),
      location: String(data.location || ''),
      departureCities: Array.isArray(data.departureCities) ? data.departureCities.map(String) : [],
      hotelName: String(data.hotelName || (data.hotel as Record<string, unknown>)?.name || ''),
      hotelRating: Number(data.hotelRating || (data.hotel as Record<string, unknown>)?.rating || 0),
      duration: String(data.duration || ''),
      nights: Number(data.nights || 0),
      pricePerPerson: String(data.pricePerPerson || data.price || '0'),
      image: String(data.image || (data.featuredImage as Record<string, unknown>)?.url || ''),
      highlights: Array.isArray(data.highlights) ? data.highlights.map(String) : [],
      includesFlights: Boolean(data.includesFlights || (data.includes as Record<string, unknown>)?.flights),
      includesHotel: Boolean(data.includesHotel || (data.includes as Record<string, unknown>)?.hotel),
      rating: Number(data.rating || 0),
      reviewCount: Number(data.reviewCount || data.reviews || 0),
      promoBadge: data.promoBadge as VacationPackage['promoBadge'],
      discountPercent: data.discountPercent ? Number(data.discountPercent) : undefined,
      originalPrice: data.originalPrice ? String(data.originalPrice) : undefined,
    };
  }

  /**
   * Transform Payload document to DayTour
   *
   * Expected Payload 'day-tours' collection schema:
   * ```typescript
   * const DayTours: CollectionConfig = {
   *   slug: 'day-tours',
   *   fields: [
   *     { name: 'name', type: 'text', required: true },
   *     { name: 'slug', type: 'text', unique: true },
   *     { name: 'duration', type: 'text' }, // e.g., "8 hours"
   *     { name: 'location', type: 'text' },
   *     { name: 'departsFrom', type: 'text' },
   *     { name: 'groupSize', type: 'group', fields: [
   *       { name: 'min', type: 'number' },
   *       { name: 'max', type: 'number' }
   *     ]},
   *     { name: 'pricePerPerson', type: 'text' },
   *     { name: 'category', type: 'select', options: ['cultural', 'adventure', 'nature', 'culinary', 'beach', 'historical'] },
   *     { name: 'featuredImage', type: 'upload', relationTo: 'media' },
   *     { name: 'rating', type: 'number' },
   *     { name: 'reviewCount', type: 'number' },
   *     { name: 'highlights', type: 'array', fields: [{ name: 'item', type: 'text' }] },
   *     { name: 'promoBadge', type: 'select', options: ['bestSeller', 'new', 'popular'] },
   *     { name: 'discountPercent', type: 'number' },
   *     { name: 'originalPrice', type: 'text' }
   *   ]
   * };
   * ```
   */
  private transformToDayTour(doc: unknown): DayTour {
    const data = doc as Record<string, unknown>;
    const groupSizeData = data.groupSize as Record<string, unknown> | undefined;

    return {
      id: String(data.id || data._id || ''),
      name: String(data.name || data.title || ''),
      duration: String(data.duration || ''),
      location: String(data.location || ''),
      departsFrom: String(data.departsFrom || ''),
      groupSize: {
        min: Number(groupSizeData?.min || 1),
        max: Number(groupSizeData?.max || 10),
      },
      pricePerPerson: String(data.pricePerPerson || data.price || '0'),
      category: (data.category as DayTour['category']) || 'adventure',
      image: String(data.image || (data.featuredImage as Record<string, unknown>)?.url || ''),
      rating: Number(data.rating || 0),
      reviewCount: Number(data.reviewCount || data.reviews || 0),
      highlights: Array.isArray(data.highlights) ? data.highlights.map(String) : [],
      promoBadge: data.promoBadge as DayTour['promoBadge'],
      discountPercent: data.discountPercent ? Number(data.discountPercent) : undefined,
      originalPrice: data.originalPrice ? String(data.originalPrice) : undefined,
    };
  }

  /**
   * Transform Payload document to Event
   *
   * Expected Payload 'events' collection schema:
   * ```typescript
   * const Events: CollectionConfig = {
   *   slug: 'events',
   *   fields: [
   *     { name: 'title', type: 'text', required: true },
   *     { name: 'description', type: 'richText' },
   *     { name: 'featuredImage', type: 'upload', relationTo: 'media' },
   *     { name: 'date', type: 'date' },
   *     { name: 'location', type: 'text' },
   *     { name: 'ticketUrl', type: 'text' }
   *   ]
   * };
   * ```
   */
  private transformToEvent(doc: unknown): Event {
    const data = doc as Record<string, unknown>;

    return {
      id: String(data.id || data._id || ''),
      title: String(data.title || data.name || ''),
      description: String(data.description || ''),
      image: String(data.image || (data.featuredImage as Record<string, unknown>)?.url || ''),
      date: data.date ? String(data.date) : undefined,
      location: data.location ? String(data.location) : undefined,
      href: data.href || data.ticketUrl ? String(data.href || data.ticketUrl) : undefined,
    };
  }

  /**
   * Transform Payload document to BlogPost
   *
   * Expected Payload 'blog-posts' collection schema:
   * ```typescript
   * const BlogPosts: CollectionConfig = {
   *   slug: 'blog-posts',
   *   fields: [
   *     { name: 'title', type: 'text', required: true },
   *     { name: 'slug', type: 'text', unique: true },
   *     { name: 'excerpt', type: 'textarea' },
   *     { name: 'content', type: 'richText' },
   *     { name: 'featuredImage', type: 'upload', relationTo: 'media' },
   *     { name: 'category', type: 'relationship', relationTo: 'categories' },
   *     { name: 'author', type: 'relationship', relationTo: 'users' },
   *     { name: 'publishedAt', type: 'date' },
   *     { name: 'readTime', type: 'text' }, // e.g., "5 min read"
   *     { name: 'featured', type: 'checkbox' }
   *   ]
   * };
   * ```
   */
  private transformToBlogPost(doc: unknown): BlogPost {
    const data = doc as Record<string, unknown>;
    const authorData = data.author as Record<string, unknown> | string | undefined;

    return {
      id: String(data.id || data._id || ''),
      title: String(data.title || ''),
      excerpt: String(data.excerpt || data.description || ''),
      image: String(data.image || (data.featuredImage as Record<string, unknown>)?.url || ''),
      category: String(data.category || ''),
      author: typeof authorData === 'object' && authorData
        ? {
            name: String(authorData.name || 'IBookTours Team'),
            avatar: String(authorData.avatar || ''),
          }
        : undefined,
      date: String(data.date || data.publishedAt || data.createdAt || ''),
      readTime: data.readTime ? String(data.readTime) : undefined,
      featured: data.featured ? Boolean(data.featured) : undefined,
    };
  }

  /**
   * Transform Payload document to Testimonial
   *
   * Expected Payload 'testimonials' collection schema:
   * ```typescript
   * const Testimonials: CollectionConfig = {
   *   slug: 'testimonials',
   *   fields: [
   *     { name: 'author', type: 'group', fields: [
   *       { name: 'name', type: 'text', required: true },
   *       { name: 'title', type: 'text' }, // e.g., "Travel Enthusiast"
   *       { name: 'avatar', type: 'upload', relationTo: 'media' },
   *       { name: 'location', type: 'text' }
   *     ]},
   *     { name: 'content', type: 'textarea', required: true },
   *     { name: 'rating', type: 'number', min: 1, max: 5 },
   *     { name: 'date', type: 'date' }
   *   ]
   * };
   * ```
   */
  private transformToTestimonial(doc: unknown): Testimonial {
    const data = doc as Record<string, unknown>;
    const authorData = data.author as Record<string, unknown> | undefined;

    return {
      id: String(data.id || data._id || ''),
      author: {
        name: String(authorData?.name || data.name || ''),
        title: String(authorData?.title || data.title || ''),
        avatar: String(authorData?.avatar || data.avatar || data.image || ''),
        location: authorData?.location || data.location ? String(authorData?.location || data.location) : undefined,
      },
      content: String(data.content || data.text || data.review || ''),
      rating: Number(data.rating || 5),
      date: data.date ? String(data.date) : undefined,
    };
  }

  /**
   * Transform Payload document to Destination
   *
   * Expected Payload 'destinations' collection schema:
   * ```typescript
   * const Destinations: CollectionConfig = {
   *   slug: 'destinations',
   *   fields: [
   *     { name: 'name', type: 'text', required: true },
   *     { name: 'slug', type: 'text', unique: true },
   *     { name: 'location', type: 'text' },
   *     { name: 'description', type: 'richText' },
   *     { name: 'featuredImage', type: 'upload', relationTo: 'media' },
   *     { name: 'rating', type: 'number' },
   *     { name: 'reviewCount', type: 'number' },
   *     { name: 'price', type: 'text' }, // Starting price
   *     { name: 'duration', type: 'text' },
   *     { name: 'featured', type: 'checkbox' }
   *   ]
   * };
   * ```
   */
  private transformToDestination(doc: unknown): Destination {
    const data = doc as Record<string, unknown>;

    return {
      id: String(data.id || data._id || ''),
      name: String(data.name || data.title || ''),
      location: String(data.location || ''),
      description: String(data.description || ''),
      image: String(data.image || (data.featuredImage as Record<string, unknown>)?.url || ''),
      rating: data.rating ? Number(data.rating) : undefined,
      reviewCount: data.reviewCount ? Number(data.reviewCount) : undefined,
      price: data.price ? String(data.price) : undefined,
      duration: data.duration ? String(data.duration) : undefined,
      featured: data.featured ? Boolean(data.featured) : undefined,
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
