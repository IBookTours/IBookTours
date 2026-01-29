import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LegalPage from '@/components/LegalPage';
import { safetyContent } from '@/data/legalPages';
import { siteData } from '@/data/siteData';

export const metadata: Metadata = {
  title: 'Safety Information | IBookTours',
  description: 'Learn about our safety measures and travel guidelines.',
};

export default function SafetyPage() {
  return (
    <>
      <Navbar navigation={siteData.navigation} siteName={siteData.siteName} />
      <LegalPage content={safetyContent} />
      <Footer content={siteData.footer} siteName={siteData.siteName} />
    </>
  );
}
