// ============================================
// SANITY SAFE FETCH WRAPPER
// ============================================
// Provides a safe fetch wrapper with caching, revalidation,
// and ZERO-LATENCY fallback to mock data when CMS is unavailable
//
// CRITICAL: All functions check isSanityConfigured SYNCHRONOUSLY
// at the start and return mock data IMMEDIATELY if not configured.
// This ensures zero network latency when Sanity keys are not set.

import { sanityClient, queries, isSanityConfigured } from './sanity.client';
import { siteData } from '@/data/siteData';
import type { Destination, Stat, Testimonial } from '@/types';

// Revalidation intervals (in seconds)
const REVALIDATE_INTERVAL = 60; // 1 minute for development
const PRODUCTION_REVALIDATE = 3600; // 1 hour for production

const getRevalidateTime = () =>
  process.env.NODE_ENV === 'production' ? PRODUCTION_REVALIDATE : REVALIDATE_INTERVAL;

// ============================================
// TYPED FETCH FUNCTIONS WITH ZERO-LATENCY FALLBACKS
// ============================================

/**
 * Fetch tour packages from Sanity with IMMEDIATE fallback to mock data
 *
 * ZERO-LATENCY: If Sanity is not configured, returns mock data synchronously
 * without any network requests or async operations.
 */
export async function fetchTourPackagesWithFallback(): Promise<Destination[]> {
  // SYNCHRONOUS CHECK - Return immediately if not configured
  if (!isSanityConfigured) {
    return siteData.destinations;
  }

  try {
    const data = await sanityClient.fetch<SanityTourPackage[]>(
      queries.tourPackages,
      {},
      {
        next: {
          revalidate: getRevalidateTime(),
          tags: ['tourPackages'],
        },
      }
    );

    if (data && data.length > 0) {
      return data.map(transformTourPackageToDestination);
    }

    // Empty result from Sanity - use mock data
    return siteData.destinations;
  } catch {
    // Silently fall back to mock data on error
    return siteData.destinations;
  }
}

/**
 * Fetch testimonials from Sanity with IMMEDIATE fallback to mock data
 *
 * ZERO-LATENCY: If Sanity is not configured, returns mock data synchronously
 * without any network requests or async operations.
 */
export async function fetchTestimonialsWithFallback(): Promise<Testimonial[]> {
  // SYNCHRONOUS CHECK - Return immediately if not configured
  if (!isSanityConfigured) {
    return siteData.testimonials.testimonials;
  }

  try {
    const data = await sanityClient.fetch<SanityTestimonial[]>(
      queries.testimonials,
      {},
      {
        next: {
          revalidate: getRevalidateTime(),
          tags: ['testimonials'],
        },
      }
    );

    if (data && data.length > 0) {
      return data.map(transformSanityTestimonial);
    }

    // Empty result from Sanity - use mock data
    return siteData.testimonials.testimonials;
  } catch {
    // Silently fall back to mock data on error
    return siteData.testimonials.testimonials;
  }
}

/**
 * Fetch homepage stats from Sanity with IMMEDIATE fallback to mock data
 *
 * ZERO-LATENCY: If Sanity is not configured, returns mock data synchronously
 * without any network requests or async operations.
 */
export async function fetchStatsWithFallback(): Promise<Stat[]> {
  // SYNCHRONOUS CHECK - Return immediately if not configured
  if (!isSanityConfigured) {
    return siteData.stats;
  }

  try {
    const data = await sanityClient.fetch<SanityHomepageStats>(
      queries.homepageStats,
      {},
      {
        next: {
          revalidate: getRevalidateTime(),
          tags: ['homepageStats'],
        },
      }
    );

    if (data) {
      const transformed = transformSanityStats(data);
      // If transformation yields empty array, use mock data
      return transformed.length > 0 ? transformed : siteData.stats;
    }

    // No data from Sanity - use mock data
    return siteData.stats;
  } catch {
    // Silently fall back to mock data on error
    return siteData.stats;
  }
}

// ============================================
// SANITY TYPE DEFINITIONS
// ============================================

interface SanityTourPackage {
  _id: string;
  title: string;
  slug: string;
  mainImage?: {
    asset: {
      _ref: string;
    };
  };
  price: string;
  duration: string;
  rating?: number;
  difficulty?: string;
  description?: string;
  featured?: boolean;
  location: string;
  highlights?: string[];
}

interface SanityTestimonial {
  _id: string;
  authorName: string;
  authorTitle?: string;
  authorAvatar?: {
    asset: {
      _ref: string;
    };
  };
  authorLocation?: string;
  content: string;
  rating: number;
  date?: string;
}

interface SanityHomepageStats {
  happyTravelersCount?: number;
  happyTravelersSuffix?: string;
  destinationsCount?: number;
  positiveFeedbackPercent?: number;
  yearsExperience?: number;
  tripsBooked?: string;
  partnerHotels?: string;
  userRating?: number;
  travelersLabel?: string;
  destinationsLabel?: string;
  feedbackLabel?: string;
}

// ============================================
// TRANSFORM FUNCTIONS
// ============================================

import { urlFor } from './sanity.client';

function transformTourPackageToDestination(pkg: SanityTourPackage): Destination {
  return {
    id: pkg._id,
    name: pkg.title,
    location: pkg.location,
    description: pkg.description || '',
    image: pkg.mainImage
      ? urlFor(pkg.mainImage).width(800).height(600).format('webp').url()
      : 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop&q=80',
    rating: pkg.rating,
    price: pkg.price,
    duration: pkg.duration,
    featured: pkg.featured,
  };
}

function transformSanityTestimonial(testimonial: SanityTestimonial): Testimonial {
  return {
    id: testimonial._id,
    author: {
      name: testimonial.authorName,
      title: testimonial.authorTitle || 'Traveler',
      avatar: testimonial.authorAvatar
        ? urlFor(testimonial.authorAvatar).width(150).height(150).url()
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80',
      location: testimonial.authorLocation,
    },
    content: testimonial.content,
    rating: testimonial.rating,
    date: testimonial.date,
  };
}

function transformSanityStats(stats: SanityHomepageStats): Stat[] {
  const result: Stat[] = [];

  if (stats.destinationsCount) {
    result.push({
      id: 'destinations',
      value: String(stats.destinationsCount),
      label: stats.destinationsLabel || 'World destinations',
    });
  }

  if (stats.positiveFeedbackPercent) {
    result.push({
      id: 'satisfaction',
      value: String(stats.positiveFeedbackPercent),
      label: stats.feedbackLabel || 'Positive feedback',
      suffix: '%',
    });
  }

  if (stats.happyTravelersCount) {
    result.push({
      id: 'travelers',
      value: String(stats.happyTravelersCount),
      label: stats.travelersLabel || 'Happy travelers',
      suffix: stats.happyTravelersSuffix || '+',
    });
  }

  return result;
}

// ============================================
// CACHE INVALIDATION HELPERS
// ============================================

/**
 * Invalidate all Sanity caches
 * Call this from a webhook or API route after content updates
 */
export async function revalidateSanityCache() {
  if (!isSanityConfigured) {
    return;
  }
  // Cache invalidation would be handled here when Sanity is re-enabled
}
