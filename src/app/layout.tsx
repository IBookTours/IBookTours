import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
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

export const metadata: Metadata = {
  title: `${siteData.siteName} - ${siteData.siteDescription}`,
  description: siteData.siteDescription,
  keywords: ['travel', 'adventure', 'tours', 'vacations', 'destinations'],
  openGraph: {
    title: siteData.siteName,
    description: siteData.siteDescription,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body>
        <Navbar navigation={siteData.navigation} siteName={siteData.siteName} />
        <main>{children}</main>
      </body>
    </html>
  );
}
