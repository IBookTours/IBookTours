import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LegalPage from '@/components/LegalPage';
import { cookiesContent } from '@/data/legalPages';
import { siteData } from '@/data/siteData';

export const metadata: Metadata = {
  title: 'Cookie Policy | IBookTours',
  description: 'Learn how IBookTours uses cookies and similar technologies.',
};

export default function CookiesPage() {
  return (
    <>
      <Navbar navigation={siteData.navigation} siteName={siteData.siteName} />
      <LegalPage content={cookiesContent} />
      <Footer content={siteData.footer} siteName={siteData.siteName} />
    </>
  );
}
