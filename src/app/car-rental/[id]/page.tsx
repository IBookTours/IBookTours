import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVehicleById, carRentalVehicles } from '@/data/carRentalData';
import VehicleDetailClient from './VehicleDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const vehicle = getVehicleById(resolvedParams.id);

  if (!vehicle) {
    return {
      title: 'Vehicle Not Found | IBookTours',
    };
  }

  return {
    title: `${vehicle.name} - Car Rental | IBookTours`,
    description: `Rent a ${vehicle.name} in Albania. ${vehicle.seats} seats, ${vehicle.transmission} transmission. Starting from €${vehicle.pricePerDay}/day.`,
    keywords: [vehicle.brand, vehicle.model, 'car rental', 'Albania', vehicle.category],
    openGraph: {
      title: `Rent ${vehicle.name} in Albania | IBookTours`,
      description: `${vehicle.seats} seats, ${vehicle.transmission}, ${vehicle.fuelType}. €${vehicle.pricePerDay}/day`,
      images: [vehicle.image],
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return carRentalVehicles.map((vehicle) => ({
    id: vehicle.id,
  }));
}

export default async function VehicleDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const vehicle = getVehicleById(resolvedParams.id);

  if (!vehicle) {
    notFound();
  }

  return <VehicleDetailClient vehicle={vehicle} />;
}
