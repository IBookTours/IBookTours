// ============================================
// HOTEL MOCK DATA
// ============================================
// Sample hotels for the hotels feature.
// In production, this will come from the CMS.

import { Hotel } from '@/types/hotel';

export const hotels: Hotel[] = [
  {
    id: 'hotel-1',
    slug: 'hotel-butrinti-saranda',
    name: 'Hotel Butrinti',
    category: 'boutique',
    location: 'Saranda, Albanian Riviera',
    city: 'Saranda',
    address: 'Rruga Butrinti, Saranda 9701',
    description: `Nestled along the stunning Albanian Riviera, Hotel Butrinti offers an authentic blend of traditional hospitality and modern comfort. Just minutes from the UNESCO World Heritage site of Butrint and the crystal-clear waters of the Ionian Sea, this boutique hotel serves as the perfect base for exploring southern Albania's most treasured destinations.

Each room features locally crafted furnishings that celebrate Albanian artisanship, paired with contemporary amenities for a truly relaxing stay. Wake up to panoramic views of the mountains meeting the sea, enjoy fresh Mediterranean cuisine at our rooftop restaurant, and let our knowledgeable staff guide you to hidden beaches and ancient ruins that most tourists never discover.`,
    shortDescription: 'Boutique coastal retreat near UNESCO Butrint with stunning Ionian Sea views.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
    ],
    starRating: 4,
    rating: 4.7,
    reviewCount: 156,
    priceFrom: 85,
    currency: 'EUR',
    amenities: ['wifi', 'parking', 'restaurant', 'bar', 'airConditioning', 'beachAccess', 'breakfast', 'concierge'],
    rooms: [
      {
        id: 'room-1-1',
        type: 'double',
        name: 'Sea View Double',
        description: 'Spacious room with private balcony overlooking the Ionian Sea.',
        maxGuests: 2,
        pricePerNight: 85,
        currency: 'EUR',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
        amenities: ['wifi', 'airConditioning', 'minibar'],
        available: true,
      },
      {
        id: 'room-1-2',
        type: 'suite',
        name: 'Riviera Suite',
        description: 'Luxurious suite with separate living area and panoramic coastal views.',
        maxGuests: 3,
        pricePerNight: 145,
        currency: 'EUR',
        image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=600&fit=crop',
        amenities: ['wifi', 'airConditioning', 'minibar', 'bathtub'],
        available: true,
      },
    ],
    highlights: [
      '10 minutes from UNESCO Butrint Archaeological Site',
      'Private beach access',
      'Rooftop restaurant with sea views',
      'Traditional Albanian breakfast included',
    ],
    coordinates: { lat: 39.8661, lng: 20.0050 },
    featured: true,
  },
  {
    id: 'hotel-2',
    slug: 'tirana-international-hotel',
    name: 'Tirana International Hotel',
    category: 'luxury',
    location: 'Tirana City Center',
    city: 'Tirana',
    address: 'Skanderbeg Square, Tirana 1001',
    description: `Standing proudly at the heart of Albania's vibrant capital, Tirana International Hotel combines Soviet-era grandeur with contemporary elegance. This landmark property overlooks the iconic Skanderbeg Square and serves as the gateway to Tirana's fascinating mix of Ottoman, Italian, and Communist-era architecture.

Our renovated rooms offer the perfect sanctuary after exploring the city's colorful streets, world-class museums, and burgeoning culinary scene. The hotel's central location means you're steps away from the National History Museum, Et'hem Bey Mosque, and the famous Blloku district with its trendy cafes and nightlife.`,
    shortDescription: 'Iconic landmark hotel overlooking Skanderbeg Square in the heart of Tirana.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
    ],
    starRating: 5,
    rating: 4.5,
    reviewCount: 324,
    priceFrom: 120,
    currency: 'EUR',
    amenities: ['wifi', 'parking', 'pool', 'spa', 'gym', 'restaurant', 'bar', 'roomService', 'airConditioning', 'concierge', 'laundry'],
    rooms: [
      {
        id: 'room-2-1',
        type: 'double',
        name: 'Superior Double',
        description: 'Elegant room with city views and premium amenities.',
        maxGuests: 2,
        pricePerNight: 120,
        currency: 'EUR',
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
        amenities: ['wifi', 'airConditioning', 'minibar', 'safe'],
        available: true,
      },
      {
        id: 'room-2-2',
        type: 'suite',
        name: 'Executive Suite',
        description: 'Spacious suite with Skanderbeg Square views and separate work area.',
        maxGuests: 2,
        pricePerNight: 195,
        currency: 'EUR',
        image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=600&fit=crop',
        amenities: ['wifi', 'airConditioning', 'minibar', 'safe', 'bathtub', 'workspace'],
        available: true,
      },
      {
        id: 'room-2-3',
        type: 'family',
        name: 'Family Room',
        description: 'Connecting rooms ideal for families, with space for up to 4 guests.',
        maxGuests: 4,
        pricePerNight: 185,
        currency: 'EUR',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
        amenities: ['wifi', 'airConditioning', 'minibar', 'safe'],
        available: true,
      },
    ],
    highlights: [
      'Prime location on Skanderbeg Square',
      'Rooftop bar with panoramic city views',
      'Full-service spa and wellness center',
      'Walking distance to major attractions',
    ],
    coordinates: { lat: 41.3275, lng: 19.8187 },
    featured: true,
  },
  {
    id: 'hotel-3',
    slug: 'hotel-mangalemi-berat',
    name: 'Hotel Mangalemi',
    category: 'guesthouse',
    location: 'Berat Old Town (UNESCO)',
    city: 'Berat',
    address: 'Mangalem Quarter, Berat 5001',
    description: `Step back in time at Hotel Mangalemi, a lovingly restored Ottoman-era house in the heart of Berat's famous Mangalem quarter. Known as the "City of a Thousand Windows," Berat is a UNESCO World Heritage Site, and this charming guesthouse places you directly within its living history.

The hotel occupies a traditional Albanian tower house, with thick stone walls that keep rooms cool in summer and cozy in winter. Each room is uniquely decorated with antique furniture and handwoven textiles, while modern comforts ensure a restful stay. Wake up to views of the castle-topped hill, enjoy homemade traditional breakfast, and explore centuries-old cobblestone streets right from your doorstep.`,
    shortDescription: 'Historic Ottoman guesthouse in UNESCO-listed Berat, the City of a Thousand Windows.',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
    ],
    starRating: 3,
    rating: 4.9,
    reviewCount: 89,
    priceFrom: 55,
    currency: 'EUR',
    amenities: ['wifi', 'parking', 'restaurant', 'airConditioning', 'breakfast'],
    rooms: [
      {
        id: 'room-3-1',
        type: 'double',
        name: 'Traditional Double',
        description: 'Authentic Ottoman-style room with antique furnishings and castle views.',
        maxGuests: 2,
        pricePerNight: 55,
        currency: 'EUR',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
        amenities: ['wifi', 'airConditioning'],
        available: true,
      },
      {
        id: 'room-3-2',
        type: 'twin',
        name: 'Heritage Twin',
        description: 'Cozy twin room featuring traditional wooden ceilings and local crafts.',
        maxGuests: 2,
        pricePerNight: 50,
        currency: 'EUR',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
        amenities: ['wifi', 'airConditioning'],
        available: true,
      },
    ],
    highlights: [
      'Inside UNESCO World Heritage zone',
      'Restored 18th-century Ottoman house',
      'Homemade traditional Albanian breakfast',
      'Walking distance to Berat Castle',
    ],
    coordinates: { lat: 40.7058, lng: 19.9522 },
  },
  {
    id: 'hotel-4',
    slug: 'ksamil-beach-resort',
    name: 'Ksamil Beach Resort',
    category: 'resort',
    location: 'Ksamil, Albanian Riviera',
    city: 'Ksamil',
    address: 'Ksamil Beach Road, Ksamil 9706',
    description: `Discover Albania's answer to the Maldives at Ksamil Beach Resort. Situated on the southernmost tip of the Albanian Riviera, our resort overlooks the legendary Ksamil Islands—small paradise islets with white sand beaches floating in impossibly turquoise waters.

This contemporary resort offers the perfect blend of relaxation and adventure. Spend your days island-hopping by boat, snorkeling in crystal-clear waters, or simply lounging by our infinity pool. As the sun sets, savor fresh seafood at our beachfront restaurant and watch the sky turn shades of gold and purple over the Greek island of Corfu on the horizon.`,
    shortDescription: 'Modern beachfront resort overlooking the stunning Ksamil Islands.',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    ],
    starRating: 4,
    rating: 4.6,
    reviewCount: 203,
    priceFrom: 95,
    currency: 'EUR',
    amenities: ['wifi', 'parking', 'pool', 'restaurant', 'bar', 'airConditioning', 'beachAccess', 'breakfast', 'shuttle'],
    rooms: [
      {
        id: 'room-4-1',
        type: 'double',
        name: 'Garden View Room',
        description: 'Comfortable room with private terrace overlooking the resort gardens.',
        maxGuests: 2,
        pricePerNight: 95,
        currency: 'EUR',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
        amenities: ['wifi', 'airConditioning', 'minibar', 'terrace'],
        available: true,
      },
      {
        id: 'room-4-2',
        type: 'double',
        name: 'Sea View Room',
        description: 'Premium room with balcony and stunning views of the Ksamil Islands.',
        maxGuests: 2,
        pricePerNight: 135,
        currency: 'EUR',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        amenities: ['wifi', 'airConditioning', 'minibar', 'balcony'],
        available: true,
      },
      {
        id: 'room-4-3',
        type: 'suite',
        name: 'Island View Suite',
        description: 'Spacious suite with wraparound balcony and panoramic island views.',
        maxGuests: 3,
        pricePerNight: 195,
        currency: 'EUR',
        image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=600&fit=crop',
        amenities: ['wifi', 'airConditioning', 'minibar', 'balcony', 'bathtub'],
        available: true,
      },
    ],
    highlights: [
      'Direct access to Ksamil Beach',
      'Views of the famous Ksamil Islands',
      'Infinity pool overlooking the sea',
      'Boat trips to nearby islands included',
    ],
    coordinates: { lat: 39.7722, lng: 20.0003 },
    featured: true,
    discountPercent: 15,
    originalPrice: 112,
  },
];

// Helper function to get featured hotels
export function getFeaturedHotels(limit = 4): Hotel[] {
  return hotels
    .filter(h => h.featured)
    .slice(0, limit);
}

// Helper function to get hotels by city
export function getHotelsByCity(city: string): Hotel[] {
  if (city === 'all') return hotels;
  return hotels.filter(h => h.city.toLowerCase() === city.toLowerCase());
}

// Helper function to get hotels by category
export function getHotelsByCategory(category: string): Hotel[] {
  if (category === 'all') return hotels;
  return hotels.filter(h => h.category === category);
}

// Helper function to get a single hotel by slug
export function getHotelBySlug(slug: string): Hotel | undefined {
  return hotels.find(h => h.slug === slug);
}

// Helper function to get a single hotel by ID
export function getHotelById(id: string): Hotel | undefined {
  return hotels.find(h => h.id === id);
}

// Get unique cities for filtering
export function getHotelCities(): string[] {
  return [...new Set(hotels.map(h => h.city))];
}