import { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Careers | ITravel',
  description: 'Join our team at ITravel and help people explore the world.',
};

export default function CareersPage() {
  return (
    <ComingSoon
      title="Careers at ITravel"
      description="We're always looking for passionate people to join our team. Our careers page is coming soon - in the meantime, feel free to reach out!"
    />
  );
}
