/**
 * CMS Content Types
 *
 * CMS-agnostic types for content management.
 * These types can be used with any CMS provider (Sanity, Strapi, Contentful, etc.)
 */

// Re-export existing types for convenience
export type {
  NavItem,
  HeroContent,
  Destination,
  Stat,
  AboutFeature,
  AboutContent,
  BookingFeature,
  BookingContent,
  AdventureCategory,
  AdventureContent,
  VacationPackage,
  DayTour,
  Event,
  BlogPost,
  Testimonial,
  SiteContent,
} from '@/types';

/**
 * CMS Document metadata
 */
export interface CMSDocument {
  _id: string;
  _type: string;
  _createdAt?: string;
  _updatedAt?: string;
  _locale?: 'en' | 'he';
}

/**
 * CMS Image with responsive variants
 */
export interface CMSImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  blurDataUrl?: string;
}

/**
 * CMS Rich Text content
 */
export interface CMSRichText {
  raw: unknown;
  html: string;
  text: string;
}

/**
 * Query options for content fetching
 */
export interface ContentQueryOptions {
  locale?: 'en' | 'he';
  preview?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: string;
  filter?: Record<string, unknown>;
}

/**
 * Paginated response
 */
export interface PaginatedContent<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  page: number;
  pageSize: number;
}

/**
 * Content fetch result
 */
export interface ContentResult<T> {
  data: T | null;
  error?: string;
  cached?: boolean;
}
