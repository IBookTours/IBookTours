import { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Cancellation Policy | ITravel',
  description: 'Understand our booking cancellation and refund policies.',
};

export default function CancellationPage() {
  return (
    <ComingSoon
      title="Cancellation Policy"
      description="Our cancellation policy page is being prepared. For questions about existing bookings, please contact us directly."
    />
  );
}
