import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LegalPage from '@/components/LegalPage';
import { termsContent } from '@/data/legalPages';
import { siteData } from '@/data/siteData';

export const metadata: Metadata = {
  title: 'Terms of Service | IBookTours',
  description: 'Read our terms of service and conditions for using IBookTours.',
};

export default function TermsPage() {
  return (
    <>
      <Navbar navigation={siteData.navigation} siteName={siteData.siteName} />
      <LegalPage content={termsContent} />
      <Footer content={siteData.footer} siteName={siteData.siteName} />
    </>
  );
}
