// ============================================
// HOMEPAGE - Server Component
// ============================================

import dynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';
import { DayToursSection } from '@/components/DayToursSection';
import { VacationPackagesSection } from '@/components/VacationPackagesSection';
import StatsSection from '@/components/StatsSection';
import AboutSection from '@/components/AboutSection';
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
const EventsSection = dynamic(() => import('@/components/EventsSection'), {
  ssr: true,
});
const TravelServicesSection = dynamic(() => import('@/components/TravelServicesSection'), {
  ssr: true,
});

export default async function Home() {
  const stats = siteData.stats;

  return (
    <>
      {/* Hero - Main landing visual */}
      <HeroSection content={siteData.hero} />

      {/* Day Tours - Primary product (guided day trips and excursions) */}
      <DayToursSection tours={siteData.dayTours} maxDisplay={4} />

      {/* Vacation Packages - Flight + Hotel packages (Secondary) */}
      <VacationPackagesSection packages={siteData.vacationPackages} maxDisplay={4} />

      {/* About - Company story and values ("Your Balkan Experts") */}
      <AboutSection content={siteData.about} />

      {/* Car Rental - Self-drive exploration */}
      <CarRentalSection />

      {/* Hotels - Partner accommodations */}
      <HotelsSection />

      {/* Events - Upcoming local events */}
      <EventsSection content={siteData.events} />

      {/* Travel Services - Additional services */}
      <TravelServicesSection />

      {/* Stats - Trust indicators */}
      <StatsSection stats={stats} />

      {/* Testimonials - Customer reviews carousel */}
      <TestimonialsSection content={siteData.testimonials} />

      {/* Partners - Technology providers */}
      <PartnersSection partners={siteData.partners} />

      {/* Blog - Travel content */}
      <BlogSection content={siteData.blog} />

      {/* Footer */}
      <Footer content={siteData.footer} siteName={siteData.siteName} />
    </>
  );
}
