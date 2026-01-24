// ============================================
// SANITY CLIENT CONFIGURATION
// ============================================
// This file configures the Sanity client for fetching data.
// Environment variables must be set in .env.local

import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Check if a valid project ID is configured
// Note: projectId must match /^[a-z0-9-]+$/ or Sanity SDK will crash
// TEMPORARILY DISABLED: Sanity contains incorrect test data (Nike sneakers)
// Re-enable when Sanity CMS has correct Albanian destination images
const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const isConfigured = false; // Disabled to use mock data with correct images
/* Original check - re-enable when Sanity data is fixed:
const isConfigured = Boolean(
  rawProjectId &&
    rawProjectId !== '' &&
    rawProjectId !== 'your_project_id_here' &&
    /^[a-z0-9-]+$/.test(rawProjectId)
);
*/

// Sanity configuration object
// Uses 'not-configured' as placeholder (valid format) when not properly configured
export const sanityConfig = {
  projectId: isConfigured ? rawProjectId : 'not-configured',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
};

// Export whether Sanity is properly configured
export const isSanityConfigured = isConfigured;

// Create the Sanity client
export const sanityClient = createClient({
  ...sanityConfig,
  // Set perspective to 'published' for production, 'previewDrafts' for preview mode
  perspective: 'published',
});

// Create a preview client (for draft content)
export const previewClient = createClient({
  ...sanityConfig,
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_READ_TOKEN,
});

// Helper function to get the appropriate client
export const getClient = (preview = false) => (preview ? previewClient : sanityClient);

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

/**
 * Generate optimized image URLs from Sanity image references
 * @param source - Sanity image reference object
 * @returns Image URL builder instance
 *
 * @example
 * // Basic usage
 * urlFor(post.mainImage).width(800).url()
 *
 * // With specific dimensions and format
 * urlFor(destination.image).width(600).height(400).format('webp').url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ============================================
// GROQ QUERIES
// ============================================
// Centralized GROQ queries for fetching data from Sanity

export const queries = {
  // Fetch all tour packages
  tourPackages: `*[_type == "tourPackage"] | order(featured desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    price,
    duration,
    rating,
    difficulty,
    description,
    featured,
    location,
    highlights
  }`,

  // Fetch a single tour package by slug
  tourPackageBySlug: `*[_type == "tourPackage" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    gallery,
    price,
    duration,
    rating,
    difficulty,
    description,
    longDescription,
    featured,
    location,
    highlights,
    includes,
    excludes,
    itinerary
  }`,

  // Fetch homepage stats
  homepageStats: `*[_type == "homepageStats"][0] {
    happyTravelersCount,
    destinationsCount,
    positiveFeedbackPercent,
    yearsExperience,
    tripsBooked,
    partnerHotels,
    userRating
  }`,

  // Fetch all testimonials
  testimonials: `*[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    authorName,
    authorTitle,
    authorAvatar,
    authorLocation,
    content,
    rating,
    date
  }`,

  // Fetch blog posts
  blogPosts: `*[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    excerpt,
    category,
    publishedAt,
    readTime,
    featured,
    author->{
      name,
      avatar
    }
  }`,

  // Fetch site settings
  siteSettings: `*[_type == "siteSettings"][0] {
    siteName,
    siteDescription,
    logo,
    socialLinks,
    contactEmail,
    contactPhone
  }`,
};

// ============================================
// FETCH HELPERS
// ============================================
// Type-safe fetch functions

export async function fetchTourPackages() {
  return sanityClient.fetch(queries.tourPackages);
}

export async function fetchTourPackageBySlug(slug: string) {
  return sanityClient.fetch(queries.tourPackageBySlug, { slug });
}

export async function fetchHomepageStats() {
  return sanityClient.fetch(queries.homepageStats);
}

export async function fetchTestimonials() {
  return sanityClient.fetch(queries.testimonials);
}

export async function fetchBlogPosts() {
  return sanityClient.fetch(queries.blogPosts);
}

export async function fetchSiteSettings() {
  return sanityClient.fetch(queries.siteSettings);
}
