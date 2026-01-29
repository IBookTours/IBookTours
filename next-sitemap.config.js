/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ibooktours.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/studio/*', '/api/*', '/auth/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/', '/auth/'],
      },
    ],
    additionalSitemaps: [],
  },
  transform: async (config, path) => {
    // Custom priority for specific pages
    const priorities = {
      '/': 1.0,
      '/tours': 0.9,
      '/about': 0.8,
      '/blog': 0.8,
      '/contact': 0.7,
    };

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priorities[path] || config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
