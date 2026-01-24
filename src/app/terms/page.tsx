import { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Terms of Service | ITravel',
  description: 'Read our terms of service and conditions for using ITravel.',
};

export default function TermsPage() {
  return (
    <ComingSoon
      title="Terms of Service"
      description="Our terms of service page is being prepared. Please contact us if you have any questions about our policies."
    />
  );
}
