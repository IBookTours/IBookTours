/**
 * Car Rental Mock Data
 *
 * Sample vehicles for the car rental feature.
 * In production, this will come from the CMS.
 */

import { CarRentalVehicle } from '@/types/carRental';

export const carRentalVehicles: CarRentalVehicle[] = [
  {
    id: 'car-1',
    name: 'Fiat Panda',
    category: 'economy',
    seats: 4,
    transmission: 'manual',
    fuelType: 'petrol',
    pricePerDay: 25,
    currency: 'EUR',
    image: '/images/cars/economy-1.jpg',
    features: ['Air Conditioning', 'Bluetooth', 'USB Port'],
    available: true,
  },
  {
    id: 'car-2',
    name: 'Volkswagen Polo',
    category: 'compact',
    seats: 5,
    transmission: 'automatic',
    fuelType: 'petrol',
    pricePerDay: 35,
    currency: 'EUR',
    image: '/images/cars/compact-1.jpg',
    features: ['Air Conditioning', 'Bluetooth', 'GPS Navigation', 'USB Port'],
    available: true,
  },
  {
    id: 'car-3',
    name: 'Toyota Corolla',
    category: 'midsize',
    seats: 5,
    transmission: 'automatic',
    fuelType: 'hybrid',
    pricePerDay: 45,
    currency: 'EUR',
    image: '/images/cars/midsize-1.jpg',
    features: ['Air Conditioning', 'Bluetooth', 'GPS Navigation', 'Cruise Control', 'Backup Camera'],
    available: true,
  },
  {
    id: 'car-4',
    name: 'Nissan Qashqai',
    category: 'suv',
    seats: 5,
    transmission: 'automatic',
    fuelType: 'diesel',
    pricePerDay: 55,
    currency: 'EUR',
    image: '/images/cars/suv-1.jpg',
    features: ['Air Conditioning', 'Bluetooth', 'GPS Navigation', '4WD', 'Roof Rack'],
    available: true,
  },
  {
    id: 'car-5',
    name: 'Mercedes C-Class',
    category: 'luxury',
    seats: 5,
    transmission: 'automatic',
    fuelType: 'petrol',
    pricePerDay: 95,
    currency: 'EUR',
    image: '/images/cars/luxury-1.jpg',
    features: ['Leather Seats', 'Premium Sound', 'GPS Navigation', 'Climate Control', 'Parking Sensors'],
    available: true,
  },
  {
    id: 'car-6',
    name: 'Ford Transit',
    category: 'van',
    seats: 9,
    transmission: 'manual',
    fuelType: 'diesel',
    pricePerDay: 75,
    currency: 'EUR',
    image: '/images/cars/van-1.jpg',
    features: ['Air Conditioning', 'Bluetooth', 'Large Cargo Space', 'Backup Camera'],
    available: true,
  },
];

export const carRentalLocations = [
  { id: 'tirana-airport', name: 'Tirana International Airport' },
  { id: 'tirana-city', name: 'Tirana City Center' },
  { id: 'durres', name: 'Durrës' },
  { id: 'saranda', name: 'Sarandë' },
  { id: 'vlora', name: 'Vlorë' },
];
