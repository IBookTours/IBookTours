/** @type {import('next').NextConfig} */

// Determine if we're in production mode
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  // Ignore Sanity Studio during build if not configured
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            // Production CSP: Remove unsafe-eval, keep unsafe-inline for Next.js styles
            // Development CSP: Allow unsafe-inline and unsafe-eval for hot reload
            value: [
              "default-src 'self'",
              // In production, no unsafe-eval; in development, allow for hot reload
              isProd
                ? "script-src 'self' 'unsafe-inline' https://js.stripe.com https://cdn.jsdelivr.net"
                : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdn.jsdelivr.net",
              // Styles need unsafe-inline due to Next.js style injection
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://images.unsplash.com https://cdn.sanity.io https://i.pravatar.cc",
              "font-src 'self'",
              "connect-src 'self' https://api.stripe.com https://api.brevo.com",
              "frame-src 'self' https://js.stripe.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              // Upgrade HTTP to HTTPS in production
              ...(isProd ? ["upgrade-insecure-requests"] : []),
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
