// ============================================
// HOMEPAGE - Server Component
// ============================================

import dynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';
import { VacationPackagesSection } from '@/components/VacationPackagesSection';
import { DayToursSection } from '@/components/DayToursSection';
import StatsSection from '@/components/StatsSection';
import AboutSection from '@/components/AboutSection';
import AdventureSection from '@/components/AdventureSection';
import Footer from '@/components/Footer';
import { siteData } from '@/data/siteData';

// Lazy load below-fold sections for better initial page load
const CarRentalSection = dynamic(() => import('@/components/CarRentalSection'), {
  ssr: true,
});
const HotelsSection = dynamic(
  () => import('@/components/Hotels').then((mod) => mod.HotelsSection),
  { ssr: true }
);
const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), {
  ssr: true,
});
const PartnersSection = dynamic(
  () => import('@/components/PartnersSection').then((mod) => mod.PartnersSection),
  { ssr: true }
);
const BlogSection = dynamic(() => import('@/components/BlogSection'), {
  ssr: true,
});
const CTASection = dynamic(() => import('@/components/CTASection'), {
  ssr: true,
});
const EventsSection = dynamic(() => import('@/components/EventsSection'), {
  ssr: true,
});

export default async function Home() {
  const stats = siteData.stats;

  return (
    <>
      {/* Hero - Main landing visual */}
      <HeroSection content={siteData.hero} />

      {/* Vacation Packages - Flight + Hotel packages (Primary focus) */}
      <VacationPackagesSection packages={siteData.vacationPackages} maxDisplay={4} />

      {/* Day Tours - Guided day trips and excursions */}
      <DayToursSection tours={siteData.dayTours} maxDisplay={4} />

      {/* Car Rental - Self-drive exploration */}
      <CarRentalSection />

      {/* Hotels - Partner accommodations */}
      <HotelsSection />

      {/* Stats - Trust indicators */}
      <StatsSection stats={stats} />

      {/* About - Company story and values */}
      <AboutSection content={siteData.about} />

      {/* Testimonials - Customer reviews carousel */}
      <TestimonialsSection content={siteData.testimonials} />

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
