import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getHotelBySlug, hotels } from '@/data/hotelsData';
import HotelDetailClient from './HotelDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const hotel = getHotelBySlug(resolvedParams.slug);

  if (!hotel) {
    return {
      title: 'Hotel Not Found | IBookTours',
    };
  }

  return {
    title: `${hotel.name} - Hotels | IBookTours`,
    description: `${hotel.shortDescription} Located in ${hotel.location}. Starting from €${hotel.priceFrom}/night.`,
    keywords: [hotel.name, hotel.city, 'hotel Albania', hotel.category, 'accommodation'],
    openGraph: {
      title: `${hotel.name} | IBookTours`,
      description: hotel.shortDescription,
      images: [hotel.image],
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return hotels.map((hotel) => ({
    slug: hotel.slug,
  }));
}

export default async function HotelDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const hotel = getHotelBySlug(resolvedParams.slug);

  if (!hotel) {
    notFound();
  }

  return <HotelDetailClient hotel={hotel} />;
}
