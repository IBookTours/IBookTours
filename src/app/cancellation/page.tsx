import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LegalPage from '@/components/LegalPage';
import { cancellationContent } from '@/data/legalPages';
import { siteData } from '@/data/siteData';

export const metadata: Metadata = {
  title: 'Cancellation Policy | ITravel',
  description: 'Understand our booking cancellation and refund policies.',
};

export default function CancellationPage() {
  return (
    <>
      <Navbar navigation={siteData.navigation} siteName={siteData.siteName} />
      <LegalPage content={cancellationContent} />
      <Footer content={siteData.footer} siteName={siteData.siteName} />
    </>
  );
}
