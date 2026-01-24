// ============================================
// HOMEPAGE - Server Component
// ============================================
// Fetches data from Sanity CMS with fallback to mock data

import HeroSection from '@/components/HeroSection';
import DestinationsSection from '@/components/DestinationsSection';
import StatsSection from '@/components/StatsSection';
import AboutSection from '@/components/AboutSection';
import AdventureSection from '@/components/AdventureSection';
import EventsSection from '@/components/EventsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BlogSection from '@/components/BlogSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import { siteData } from '@/data/siteData';
import {
  fetchTourPackagesWithFallback,
  fetchTestimonialsWithFallback,
  fetchStatsWithFallback,
} from '@/sanity';

export default async function Home() {
  // Fetch data from Sanity with fallback to mock data
  // These fetches run in parallel for better performance
  const [destinations, testimonials, stats] = await Promise.all([
    fetchTourPackagesWithFallback(),
    fetchTestimonialsWithFallback(),
    fetchStatsWithFallback(),
  ]);

  // Build testimonials content with fetched data
  const testimonialsContent = {
    ...siteData.testimonials,
    testimonials,
  };

  return (
    <>
      <HeroSection content={siteData.hero} />
      <DestinationsSection destinations={destinations} />
      <StatsSection stats={stats} />
      <AboutSection content={siteData.about} />
      <AdventureSection content={siteData.adventure} />
      <EventsSection content={siteData.events} />
      <TestimonialsSection content={testimonialsContent} />
      <BlogSection content={siteData.blog} />
      <CTASection content={siteData.cta} />
      <Footer content={siteData.footer} siteName={siteData.siteName} />
    </>
  );
}
