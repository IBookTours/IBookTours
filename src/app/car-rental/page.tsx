import type { Metadata } from 'next';
import CarRentalClient from './CarRentalClient';

export const metadata: Metadata = {
  title: 'Car Rental | IBookTours',
  description: 'Rent a car in Albania. Choose from economy, compact, SUV, luxury vehicles and more. Explore Albania at your own pace.',
  keywords: ['car rental', 'Albania', 'rent a car', 'vehicle hire', 'SUV', 'economy car'],
  openGraph: {
    title: 'Car Rental in Albania | IBookTours',
    description: 'Rent a car and explore Albania at your own pace. Wide selection of vehicles available.',
    type: 'website',
  },
};

export default function CarRentalPage() {
  return <CarRentalClient />;
}
