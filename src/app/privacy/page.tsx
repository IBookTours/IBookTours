import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LegalPage from '@/components/LegalPage';
import { privacyContent } from '@/data/legalPages';
import { siteData } from '@/data/siteData';

export const metadata: Metadata = {
  title: 'Privacy Policy | ITravel',
  description: 'Learn how ITravel protects and handles your personal data.',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar navigation={siteData.navigation} siteName={siteData.siteName} />
      <LegalPage content={privacyContent} />
      <Footer content={siteData.footer} siteName={siteData.siteName} />
    </>
  );
}
