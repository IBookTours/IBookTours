// ============================================
// CAR RENTAL TYPE DEFINITIONS
// ============================================
// Types for the car rental feature including vehicles,
// bookings, and rental locations.

export type VehicleCategory = 'economy' | 'compact' | 'midsize' | 'suv' | 'luxury' | 'van';
export type TransmissionType = 'automatic' | 'manual';
export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric';

/**
 * Car rental vehicle listing
 */
export interface CarRentalVehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: VehicleCategory;
  seats: number;
  doors: number;
  luggage: number; // Number of suitcases
  transmission: TransmissionType;
  fuelType: FuelType;
  pricePerDay: number;
  currency: string;
  image: string;
  images?: string[];
  features: string[];
  available: boolean;
  rating?: number;
  reviewCount?: number;
  // Promotional fields
  discountPercent?: number;
  originalPrice?: number;
  featured?: boolean;
}

/**
 * Rental location (pickup/return points)
 */
export interface RentalLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  type: 'airport' | 'city' | 'hotel';
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Extra services/add-ons for car rental
 */
export interface RentalExtra {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  priceTotal?: number; // For one-time fees
  icon?: string;
}

/**
 * Car rental booking request
 */
export interface CarRentalBooking {
  vehicleId: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  pickupLocationId: string;
  returnLocationId: string;
  driverAge: number;
  extras: string[]; // Array of extra IDs
  totalDays: number;
  totalPrice: number;
}

/**
 * Filter options for car rental listing
 */
export interface CarRentalFilters {
  category?: VehicleCategory | 'all';
  transmission?: TransmissionType | 'all';
  minSeats?: number;
  maxPrice?: number;
  fuelType?: FuelType | 'all';
}

// Category labels for UI
export const VEHICLE_CATEGORIES: { value: VehicleCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'economy', label: 'Economy' },
  { value: 'compact', label: 'Compact' },
  { value: 'midsize', label: 'Midsize' },
  { value: 'suv', label: 'SUV' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'van', label: 'Van' },
];

export const TRANSMISSION_TYPES: { value: TransmissionType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
];

export const FUEL_TYPES: { value: FuelType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Electric' },
];
