// ============================================
// SANITY SAFE FETCH WRAPPER
// ============================================
// Provides a safe fetch wrapper with caching, revalidation,
// and graceful fallback to mock data when CMS is unavailable

import { sanityClient, queries, isSanityConfigured } from './sanity.client';
import { siteData } from '@/data/siteData';
import type { Destination, Stat, Testimonial } from '@/types';

// Revalidation intervals (in seconds)
const REVALIDATE_INTERVAL = 60; // 1 minute for development
const PRODUCTION_REVALIDATE = 3600; // 1 hour for production

const getRevalidateTime = () =>
  process.env.NODE_ENV === 'production' ? PRODUCTION_REVALIDATE : REVALIDATE_INTERVAL;

/**
 * Generic safe fetch wrapper for Sanity queries
 * Returns null if fetch fails, allowing caller to use fallback data
 */
async function safeFetch<T>(
  query: string,
  params?: Record<string, unknown>,
  tags?: string[]
): Promise<T | null> {
  // Skip if Sanity is not configured
  if (!isSanityConfigured) {
    console.info('[Sanity] Not configured, using mock data');
    return null;
  }

  try {
    const result = await sanityClient.fetch<T>(query, params ?? {}, {
      next: {
        revalidate: getRevalidateTime(),
        tags: tags || ['sanity'],
      },
    });
    return result;
  } catch (error) {
    console.error('[Sanity] Fetch error:', error);
    return null;
  }
}

// ============================================
// TYPED FETCH FUNCTIONS WITH FALLBACKS
// ============================================

/**
 * Fetch tour packages from Sanity with fallback to mock data
 */
export async function fetchTourPackagesWithFallback(): Promise<Destination[]> {
  const data = await safeFetch<SanityTourPackage[]>(queries.tourPackages, undefined, [
    'tourPackages',
  ]);

  if (data && data.length > 0) {
    // Transform Sanity data to match our Destination interface
    return data.map(transformTourPackageToDestination);
  }

  // Fallback to mock data
  console.info('[Sanity] Using mock destinations data');
  return siteData.destinations;
}

/**
 * Fetch testimonials from Sanity with fallback to mock data
 */
export async function fetchTestimonialsWithFallback(): Promise<Testimonial[]> {
  const data = await safeFetch<SanityTestimonial[]>(queries.testimonials, undefined, [
    'testimonials',
  ]);

  if (data && data.length > 0) {
    // Transform Sanity data to match our Testimonial interface
    return data.map(transformSanityTestimonial);
  }

  // Fallback to mock data
  console.info('[Sanity] Using mock testimonials data');
  return siteData.testimonials.testimonials;
}

/**
 * Fetch homepage stats from Sanity with fallback to mock data
 */
export async function fetchStatsWithFallback(): Promise<Stat[]> {
  const data = await safeFetch<SanityHomepageStats>(queries.homepageStats, undefined, [
    'homepageStats',
  ]);

  if (data) {
    // Transform Sanity stats to match our Stat[] interface
    return transformSanityStats(data);
  }

  // Fallback to mock data
  console.info('[Sanity] Using mock stats data');
  return siteData.stats;
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
      : 'https://picsum.photos/seed/fallback/800/600',
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
        : `https://i.pravatar.cc/150?u=${testimonial._id}`,
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

  // Return mock data if no stats were found
  if (result.length === 0) {
    return siteData.stats;
  }

  return result;
}

// ============================================
// CACHE INVALIDATION HELPERS
// ============================================

/**
 * Invalidate all Sanity caches
 * Call this after content updates in Sanity Studio
 */
export async function revalidateSanityCache() {
  // This would be called from an API route or webhook
  // For now, it's a placeholder for future implementation
  console.info('[Sanity] Cache invalidation requested');
}
