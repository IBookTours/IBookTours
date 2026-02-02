import { Metadata } from 'next';
import InteractiveMapsSection from '@/components/InteractiveMaps/InteractiveMapsSection';
import GeolocationPrompt from '@/components/GeolocationPrompt';

export const metadata: Metadata = {
  title: 'Interactive Maps | IBookTours',
  description: 'Explore Albania with our interactive Google Maps. Hundreds of marked locations including beaches, hiking trails, viewpoints, restaurants, and hidden gems. 4-month access.',
  keywords: 'Albania map, interactive map, Albania travel, Google Maps Albania, Tirana map, Albanian Riviera map',
  openGraph: {
    title: 'Interactive Albania Maps | IBookTours',
    description: 'Your digital guide to Albania. Over 500 curated locations at your fingertips.',
    type: 'website',
  },
};

export default function InteractiveMapsPage() {
  return (
    <>
      <InteractiveMapsSection />
      <GeolocationPrompt />
    </>
  );
}
