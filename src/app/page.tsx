// ============================================
// HOMEPAGE - Server Component
// ============================================
// Fetches data from Sanity CMS with fallback to mock data

import HeroSection from '@/components/HeroSection';
import { VacationPackagesSection } from '@/components/VacationPackagesSection';
import { DayToursSection } from '@/components/DayToursSection';
import StatsSection from '@/components/StatsSection';
import AboutSection from '@/components/AboutSection';
import AdventureSection from '@/components/AdventureSection';
import { PartnersSection } from '@/components/PartnersSection';
import BlogSection from '@/components/BlogSection';
import CTASection from '@/components/CTASection';
import EventsSection from '@/components/EventsSection';
import Footer from '@/components/Footer';
import { siteData } from '@/data/siteData';
import {
  fetchTestimonialsWithFallback,
  fetchStatsWithFallback,
} from '@/sanity';

export default async function Home() {
  // Fetch data from Sanity with fallback to mock data
  // These fetches run in parallel for better performance
  const [testimonials, stats] = await Promise.all([
    fetchTestimonialsWithFallback(),
    fetchStatsWithFallback(),
  ]);

  // Build about content with fetched testimonials for reviews display
  const aboutContent = {
    ...siteData.about,
    testimonials,
  };

  return (
    <>
      {/* Hero - Main landing visual */}
      <HeroSection content={siteData.hero} />

      {/* Vacation Packages - Flight + Hotel packages (Primary focus) */}
      <VacationPackagesSection packages={siteData.vacationPackages} />

      {/* Day Tours - Guided day trips and excursions */}
      <DayToursSection tours={siteData.dayTours} maxDisplay={8} />

      {/* Stats - Trust indicators */}
      <StatsSection stats={stats} />

      {/* About - Company story and values */}
      <AboutSection content={aboutContent} />

      {/* Adventure - Explore categories */}
      <AdventureSection content={siteData.adventure} />

      {/* Partners - Technology providers */}
      <PartnersSection partners={siteData.partners} />

      {/* Blog - Travel content */}
      <BlogSection content={siteData.blog} />

      {/* CTA - Final conversion */}
      <CTASection content={siteData.cta} />

      {/* Events - Upcoming events (lower priority) */}
      <EventsSection content={siteData.events} />

      {/* Footer */}
      <Footer content={siteData.footer} siteName={siteData.siteName} />
    </>
  );
}
