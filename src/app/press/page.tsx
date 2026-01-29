import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PressPage from '@/components/PressPage';
import { pressReleases, mediaKit, mediaContact, companyFacts } from '@/data/pressData';
import { siteData } from '@/data/siteData';

export const metadata: Metadata = {
  title: 'Press & Media | IBookTours',
  description: 'Press releases, media kit, and news about IBookTours.',
};

export default function Press() {
  return (
    <>
      <Navbar navigation={siteData.navigation} siteName={siteData.siteName} />
      <PressPage
        pressReleases={pressReleases}
        mediaKit={mediaKit}
        contact={mediaContact}
        facts={companyFacts}
      />
      <Footer content={siteData.footer} siteName={siteData.siteName} />
    </>
  );
}
