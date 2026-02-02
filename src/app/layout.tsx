import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/providers/AuthProvider';
import I18nProvider from '@/components/providers/I18nProvider';
import AnalyticsProvider from '@/components/providers/AnalyticsProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import AccessibilityWidget from '@/components/AccessibilityWidget';
import WhatsAppButton from '@/components/WhatsAppButton';
import CookieConsent from '@/components/CookieConsent';
import StructuredData from '@/components/StructuredData';
import ColorBlindFilters from '@/components/ColorBlindFilters';
import { CartDrawer } from '@/components/Cart';
// GeolocationPrompt moved to interactive-maps page for performance
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ibooktours.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteData.siteName} - ${siteData.siteDescription}`,
    template: `%s | ${siteData.siteName}`,
  },
  description: siteData.siteDescription,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  keywords: [
    'Albania travel',
    'Albania tours',
    'Albanian Riviera',
    'Tirana tours',
    'Berat UNESCO',
    'Gjirokaster',
    'Albanian Alps',
    'Balkans travel',
    'Albania vacation packages',
    'Albania day tours',
    'Albania hotels',
    'boutique hotels Albania',
    'Balkans tours',
    'travel agency Albania',
    'visit Albania',
  ],
  authors: [{ name: 'Mahdy Gribkov' }, { name: siteData.siteName }],
  creator: 'Mahdy Gribkov',
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
        {/* Critical CSS to prevent background flash before theme script runs */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html { background-color: #f1faee; }
              html[data-theme="dark"] { background-color: #2b2d42; }
            `,
          }}
        />
        {/* Prevent Flash of Unstyled Content - apply theme before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme-preference');
                  var resolved = theme;
                  if (!theme) {
                    // No preference saved - default to light and save it
                    resolved = 'light';
                    localStorage.setItem('theme-preference', 'light');
                  } else if (theme === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', resolved);
                } catch (e) {
                  // Fallback to light mode on any error
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              })();
            `,
          }}
        />
        <StructuredData />
      </head>
      <body>
        <AuthProvider>
          <Suspense fallback={null}>
            <AnalyticsProvider />
          </Suspense>
          <I18nProvider>
            <ThemeProvider defaultTheme="light">
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
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
