import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HelpCenter from '@/components/HelpCenter';
import { helpCategories } from '@/data/helpData';
import { siteData } from '@/data/siteData';

export const metadata: Metadata = {
  title: 'Help Center | ITravel',
  description: 'Get help with your ITravel bookings, account, and more.',
};

export default function HelpPage() {
  return (
    <>
      <Navbar navigation={siteData.navigation} siteName={siteData.siteName} />
      <HelpCenter categories={helpCategories} />
      <Footer content={siteData.footer} siteName={siteData.siteName} />
    </>
  );
}
