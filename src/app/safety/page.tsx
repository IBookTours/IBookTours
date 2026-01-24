import { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Safety Information | ITravel',
  description: 'Learn about our safety measures and travel guidelines.',
};

export default function SafetyPage() {
  return (
    <ComingSoon
      title="Safety Information"
      description="Your safety is our priority. Our detailed safety guidelines and travel tips page is being prepared."
    />
  );
}
