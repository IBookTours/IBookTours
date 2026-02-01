import type { Metadata } from 'next';
import HotelsClient from './HotelsClient';

export const metadata: Metadata = {
  title: 'Hotels | IBookTours',
  description: 'Discover handpicked hotels in Albania. From boutique guesthouses to luxury resorts on the Albanian Riviera. Book your perfect stay.',
  keywords: ['hotels Albania', 'boutique hotels', 'Albanian Riviera hotels', 'Tirana hotels', 'Saranda hotels', 'Berat hotels'],
  openGraph: {
    title: 'Hotels in Albania | IBookTours',
    description: 'Discover handpicked hotels in Albania. From boutique guesthouses to luxury resorts.',
    type: 'website',
  },
};

export default function HotelsPage() {
  return <HotelsClient />;
}
