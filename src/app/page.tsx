import HeroSection from '@/components/HeroSection';
import DestinationsSection from '@/components/DestinationsSection';
import StatsSection from '@/components/StatsSection';
import AboutSection from '@/components/AboutSection';
import BookingSection from '@/components/BookingSection';
import AdventureSection from '@/components/AdventureSection';
import EventsSection from '@/components/EventsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BlogSection from '@/components/BlogSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import { siteData } from '@/data/siteData';

export default function Home() {
  return (
    <>
      <HeroSection content={siteData.hero} />
      <DestinationsSection destinations={siteData.destinations} />
      <StatsSection stats={siteData.stats} />
      <AboutSection content={siteData.about} />
      <BookingSection content={siteData.booking} />
      <AdventureSection content={siteData.adventure} />
      <EventsSection content={siteData.events} />
      <TestimonialsSection content={siteData.testimonials} />
      <BlogSection content={siteData.blog} />
      <CTASection content={siteData.cta} />
      <Footer content={siteData.footer} siteName={siteData.siteName} />
    </>
  );
}
