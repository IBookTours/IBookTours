import { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Press & Media | ITravel',
  description: 'Press releases, media kit, and news about ITravel.',
};

export default function PressPage() {
  return (
    <ComingSoon
      title="Press & Media"
      description="Our press page with media resources and company news is being prepared. Contact us for press inquiries."
    />
  );
}
