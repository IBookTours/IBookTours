// ============================================
// HOTEL TYPE DEFINITIONS
// ============================================
// Types for the hotels feature including listings,
// rooms, amenities, and bookings.

export type HotelCategory = 'boutique' | 'resort' | 'guesthouse' | 'luxury' | 'budget';
export type RoomType = 'single' | 'double' | 'twin' | 'suite' | 'family';

/**
 * Amenity that a hotel provides
 */
export interface HotelAmenity {
  id: string;
  icon: string;
}

/**
 * Room type available at a hotel
 */
export interface HotelRoom {
  id: string;
  type: RoomType;
  name: string;
  description: string;
  maxGuests: number;
  pricePerNight: number;
  currency: string;
  image: string;
  amenities: string[];
  available: boolean;
}

/**
 * Hotel listing
 */
export interface Hotel {
  id: string;
  slug: string;
  name: string;
  category: HotelCategory;
  location: string;
  city: string;
  address: string;
  description: string;
  shortDescription: string;
  image: string;
  images: string[];
  starRating: number;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  currency: string;
  amenities: string[];
  rooms: HotelRoom[];
  highlights: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  featured?: boolean;
  // Promotional fields
  discountPercent?: number;
  originalPrice?: number;
}

/**
 * Hotel booking request
 */
export interface HotelBooking {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalNights: number;
  totalPrice: number;
}

/**
 * Filter options for hotel listing
 */
export interface HotelFilters {
  category?: HotelCategory | 'all';
  city?: string | 'all';
  minRating?: number;
  maxPrice?: number;
  amenities?: string[];
}

// Category labels for UI
export const HOTEL_CATEGORIES: { value: HotelCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'boutique', label: 'Boutique' },
  { value: 'resort', label: 'Resort' },
  { value: 'guesthouse', label: 'Guesthouse' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'budget', label: 'Budget' },
];

export const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'double', label: 'Double' },
  { value: 'twin', label: 'Twin' },
  { value: 'suite', label: 'Suite' },
  { value: 'family', label: 'Family' },
];

// Common amenity IDs for reference
export const AMENITY_IDS = {
  wifi: 'wifi',
  parking: 'parking',
  pool: 'pool',
  spa: 'spa',
  gym: 'gym',
  restaurant: 'restaurant',
  bar: 'bar',
  roomService: 'roomService',
  airConditioning: 'airConditioning',
  beachAccess: 'beachAccess',
  breakfast: 'breakfast',
  petFriendly: 'petFriendly',
  concierge: 'concierge',
  laundry: 'laundry',
  shuttle: 'shuttle',
} as const;