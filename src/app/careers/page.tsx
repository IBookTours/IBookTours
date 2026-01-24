import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CareersPage from '@/components/CareersPage';
import { companyValues, benefits, jobListings } from '@/data/careersData';
import { siteData } from '@/data/siteData';

export const metadata: Metadata = {
  title: 'Careers | ITravel',
  description: 'Join our team at ITravel and help people explore the world.',
};

export default function Careers() {
  return (
    <>
      <Navbar navigation={siteData.navigation} siteName={siteData.siteName} />
      <CareersPage
        values={companyValues}
        benefits={benefits}
        jobs={jobListings}
      />
      <Footer content={siteData.footer} siteName={siteData.siteName} />
    </>
  );
}
