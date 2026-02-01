import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ibooktours.al';

  // Determine if this is a production deployment
  // Block crawlers on staging, preview, and Vercel preview deployments
  const isProduction =
    process.env.NODE_ENV === 'production' &&
    !baseUrl.includes('staging') &&
    !baseUrl.includes('preview') &&
    !baseUrl.includes('vercel.app');

  if (!isProduction) {
    // Staging/Preview: Block all crawlers to prevent indexing
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
    };
  }

  // Production: Comprehensive crawler rules
  return {
    rules: [
      // General crawlers (Google, Bing, etc.)
      {
        userAgent: '*',
        allow: [
          '/',
          '/tours/',
          '/hotels/',
          '/car-rental/',
          '/blog/',
          '/about',
          '/contact',
          '/help',
          '/terms',
          '/privacy',
          '/cancellation',
          '/cookies',
        ],
        disallow: [
          '/api/',
          '/checkout/',
          '/admin/',
          '/_next/',
          '/profile/',
          '/auth/',
          '/forbidden',
          '/*.json$',
        ],
      },
      // Googlebot - allow everything public
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/admin/', '/profile/', '/auth/'],
      },
      // Googlebot-Image - allow images
      {
        userAgent: 'Googlebot-Image',
        allow: ['/media/', '/images/'],
        disallow: ['/api/', '/admin/'],
      },
      // AI Crawlers - Allow with restrictions
      {
        userAgent: 'GPTBot',
        allow: ['/', '/tours/', '/hotels/', '/blog/', '/about'],
        disallow: ['/api/', '/admin/', '/checkout/', '/profile/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/tours/', '/hotels/', '/blog/', '/about'],
        disallow: ['/api/', '/admin/', '/checkout/', '/profile/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: ['/', '/tours/', '/hotels/', '/blog/', '/about'],
        disallow: ['/api/', '/admin/', '/checkout/', '/profile/'],
      },
      {
        userAgent: 'Anthropic-AI',
        allow: ['/', '/tours/', '/hotels/', '/blog/', '/about'],
        disallow: ['/api/', '/admin/', '/checkout/', '/profile/'],
      },
      // Bing AI
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/checkout/', '/profile/'],
      },
      // Facebook/Meta crawlers
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      // Twitter/X crawler
      {
        userAgent: 'Twitterbot',
        allow: '/',
      },
      // LinkedIn crawler
      {
        userAgent: 'LinkedInBot',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
