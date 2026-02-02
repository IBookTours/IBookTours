// Map region definitions for the interactive Albania map

export interface MapRegion {
  id: string;
  name: string;
  nameKey: string; // Translation key
  position: { x: number; y: number }; // Percentage position on map
  icon: string;
  descriptionKey: string; // Translation key
  image: string;
  stats: {
    tours: number;
    hotels: number;
    rating: number;
    reviews: number;
  };
  highlights: string[]; // Translation keys
  slug: string; // For URL navigation
}

export const regions: MapRegion[] = [
  {
    id: 'tirana',
    name: 'Tirana',
    nameKey: 'map.regions.tirana.name',
    position: { x: 52, y: 35 },
    icon: '🏛️',
    descriptionKey: 'map.regions.tirana.description',
    image: '/images/destinations/tirana.jpg',
    stats: { tours: 8, hotels: 2, rating: 4.7, reviews: 1200 },
    highlights: ['capital', 'culture', 'nightlife'],
    slug: 'tirana',
  },
  {
    id: 'saranda',
    name: 'Saranda',
    nameKey: 'map.regions.saranda.name',
    position: { x: 35, y: 92 },
    icon: '🏖️',
    descriptionKey: 'map.regions.saranda.description',
    image: '/images/destinations/saranda.jpg',
    stats: { tours: 15, hotels: 2, rating: 4.9, reviews: 2300 },
    highlights: ['beaches', 'riviera', 'corfu'],
    slug: 'saranda',
  },
  {
    id: 'ksamil',
    name: 'Ksamil',
    nameKey: 'map.regions.ksamil.name',
    position: { x: 32, y: 95 },
    icon: '🏝️',
    descriptionKey: 'map.regions.ksamil.description',
    image: '/images/destinations/ksamil.jpg',
    stats: { tours: 6, hotels: 1, rating: 4.9, reviews: 1800 },
    highlights: ['islands', 'crystal', 'snorkeling'],
    slug: 'ksamil',
  },
  {
    id: 'berat',
    name: 'Berat',
    nameKey: 'map.regions.berat.name',
    position: { x: 45, y: 52 },
    icon: '🏰',
    descriptionKey: 'map.regions.berat.description',
    image: '/images/destinations/berat.jpg',
    stats: { tours: 10, hotels: 1, rating: 4.8, reviews: 950 },
    highlights: ['unesco', 'ottoman', 'windows'],
    slug: 'berat',
  },
  {
    id: 'gjirokaster',
    name: 'Gjirokaster',
    nameKey: 'map.regions.gjirokaster.name',
    position: { x: 40, y: 80 },
    icon: '🏯',
    descriptionKey: 'map.regions.gjirokaster.description',
    image: '/images/destinations/gjirokaster.jpg',
    stats: { tours: 7, hotels: 1, rating: 4.8, reviews: 720 },
    highlights: ['unesco', 'stone', 'castle'],
    slug: 'gjirokaster',
  },
  {
    id: 'theth',
    name: 'Theth',
    nameKey: 'map.regions.theth.name',
    position: { x: 48, y: 10 },
    icon: '🏔️',
    descriptionKey: 'map.regions.theth.description',
    image: '/images/destinations/theth.jpg',
    stats: { tours: 12, hotels: 0, rating: 4.9, reviews: 1100 },
    highlights: ['alps', 'hiking', 'waterfall'],
    slug: 'theth',
  },
  {
    id: 'vlora',
    name: 'Vlora',
    nameKey: 'map.regions.vlora.name',
    position: { x: 28, y: 65 },
    icon: '⛵',
    descriptionKey: 'map.regions.vlora.description',
    image: '/images/destinations/vlora.jpg',
    stats: { tours: 9, hotels: 1, rating: 4.6, reviews: 680 },
    highlights: ['seaside', 'independence', 'karaburun'],
    slug: 'vlora',
  },
  {
    id: 'durres',
    name: 'Durres',
    nameKey: 'map.regions.durres.name',
    position: { x: 42, y: 28 },
    icon: '🏟️',
    descriptionKey: 'map.regions.durres.description',
    image: '/images/destinations/durres.jpg',
    stats: { tours: 5, hotels: 1, rating: 4.5, reviews: 420 },
    highlights: ['roman', 'amphitheater', 'port'],
    slug: 'durres',
  },
];

// SVG path data for Albania's outline and regions
// Using simplified paths for an illustrated look
export const albaniaOutlinePath = `
M 45 5
C 55 3, 65 8, 68 15
L 70 25
C 72 35, 70 45, 68 55
L 65 70
C 60 80, 55 88, 45 95
C 35 98, 28 95, 22 88
L 18 75
C 15 65, 18 55, 20 45
L 25 30
C 28 20, 35 10, 45 5
Z
`;

// Decorative wave pattern for the sea
export const seaWavesPath = `
M 5 50 Q 10 48, 15 50 T 25 50 T 35 50
M 5 60 Q 10 58, 15 60 T 25 60
M 5 70 Q 10 68, 15 70 T 25 70 T 35 70
M 5 80 Q 10 78, 15 80 T 25 80
M 5 90 Q 10 88, 15 90 T 25 90
`;

// Mountain range path for the Alps
export const mountainPath = `
M 35 8 L 42 18 L 48 8 L 55 20 L 62 10 L 68 22
`;
