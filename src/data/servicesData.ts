/**
 * Travel Services Data
 *
 * Centralized data for travel services displayed in the marketplace.
 * Used by ToursClient and TravelServicesSection.
 */

export interface TravelService {
  id: string;
  featureKey: 'events' | 'airportTransfers' | 'localGuides';
  href: string;
  image: string;
}

export const travelServices: TravelService[] = [
  {
    id: 'events',
    featureKey: 'events',
    href: '/tours?category=events',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop&q=80',
  },
  {
    id: 'airportTransfers',
    featureKey: 'airportTransfers',
    href: '/contact?service=transfers',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop&q=80',
  },
  {
    id: 'localGuides',
    featureKey: 'localGuides',
    href: '/contact?service=guides',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&h=400&fit=crop&q=80',
  },
];
