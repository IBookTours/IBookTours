import { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Help Center | ITravel',
  description: 'Get help with your ITravel bookings, account, and more.',
};

export default function HelpPage() {
  return (
    <ComingSoon
      title="Help Center"
      description="Our comprehensive help center is being built. For immediate assistance, please contact our support team."
    />
  );
}
