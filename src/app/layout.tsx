import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import AccessibilityWidget from '@/components/AccessibilityWidget';
import WhatsAppButton from '@/components/WhatsAppButton';
import CookieConsent from '@/components/CookieConsent';
import StructuredData from '@/components/StructuredData';
import ColorBlindFilters from '@/components/ColorBlindFilters';
import { CartDrawer } from '@/components/Cart';
import { siteData } from '@/data/siteData';
import '@/styles/globals.scss';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://itravel.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteData.siteName} - ${siteData.siteDescription}`,
    template: `%s | ${siteData.siteName}`,
  },
  description: siteData.siteDescription,
  keywords: [
    'travel',
    'adventure',
    'tours',
    'vacations',
    'destinations',
    'travel agency',
    'holiday packages',
    'world travel',
    'guided tours',
    'travel booking',
  ],
  authors: [{ name: siteData.siteName }],
  creator: siteData.siteName,
  publisher: siteData.siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: siteData.siteName,
    title: siteData.siteName,
    description: siteData.siteDescription,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${siteData.siteName} - Discover Unforgettable Adventures`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteData.siteName,
    description: siteData.siteDescription,
    images: ['/og-image.jpg'],
    creator: '@itravel',
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Prevent Flash of Unstyled Content - apply theme before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme-preference');
                  var resolved = theme;
                  if (!theme || theme === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', resolved);
                } catch (e) {}
              })();
            `,
          }}
        />
        <StructuredData />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider defaultTheme="system">
            <ColorBlindFilters />
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <Navbar navigation={siteData.navigation} siteName={siteData.siteName} />
            <main id="main-content">{children}</main>
            <CartDrawer />
            <WhatsAppButton />
            <AccessibilityWidget />
            <CookieConsent />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
