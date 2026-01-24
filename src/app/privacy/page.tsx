import { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Privacy Policy | ITravel',
  description: 'Learn how ITravel protects and handles your personal data.',
};

export default function PrivacyPage() {
  return (
    <ComingSoon
      title="Privacy Policy"
      description="Our privacy policy page is being prepared. We take your privacy seriously and will have detailed information available soon."
    />
  );
}
