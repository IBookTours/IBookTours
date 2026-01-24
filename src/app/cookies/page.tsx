import { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Cookie Policy | ITravel',
  description: 'Learn how ITravel uses cookies and similar technologies.',
};

export default function CookiesPage() {
  return (
    <ComingSoon
      title="Cookie Policy"
      description="Our cookie policy page is being prepared. We use cookies to enhance your browsing experience."
    />
  );
}
