import { MetadataRoute } from 'next';
import { siteData } from '@/data/siteData';
import { hotels } from '@/data/hotelsData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ibooktours.al';

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/tours',
    '/hotels',
    '/car-rental',
    '/blog',
    '/contact',
    '/help',
    '/safety',
    '/cancellation',
    '/terms',
    '/privacy',
    '/cookies',
    '/careers',
    '/press',
  ];

  // Tour/destination pages
  const destinations = siteData.destinations.map((dest) => ({
    url: `${baseUrl}/tours/${dest.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Hotel pages
  const hotelPages = hotels.map((hotel) => ({
    url: `${baseUrl}/hotels/${hotel.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Blog post pages
  const blogPosts = siteData.blog.posts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    // Static pages
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: page === '' ? 1 : 0.7,
    })),
    // Dynamic pages
    ...destinations,
    ...hotelPages,
    ...blogPosts,
  ];
}
