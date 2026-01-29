/**
 * Car Rental Types
 *
 * Type definitions for the car rental feature.
 */

export type VehicleCategory =
  | 'economy'
  | 'compact'
  | 'midsize'
  | 'suv'
  | 'luxury'
  | 'van';

export type TransmissionType = 'automatic' | 'manual';

export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric';

export interface CarRentalVehicle {
  id: string;
  name: string;
  category: VehicleCategory;
  seats: number;
  transmission: TransmissionType;
  fuelType: FuelType;
  pricePerDay: number;
  currency: string;
  image: string;
  features: string[];
  available: boolean;
}

export interface CarRentalBooking {
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  driverAge: number;
  totalDays: number;
  totalPrice: number;
}

export interface CarRentalFilters {
  category?: VehicleCategory;
  transmission?: TransmissionType;
  minSeats?: number;
  maxPrice?: number;
}

export const VEHICLE_CATEGORIES: { value: VehicleCategory; label: string }[] = [
  { value: 'economy', label: 'Economy' },
  { value: 'compact', label: 'Compact' },
  { value: 'midsize', label: 'Midsize' },
  { value: 'suv', label: 'SUV' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'van', label: 'Van' },
];

export const TRANSMISSION_TYPES: { value: TransmissionType; label: string }[] = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
];
