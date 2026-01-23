// ============================================
// ITRAVEL - Mock Data (CMS Ready)
// ============================================
// Replace these imports with your CMS fetch calls.
// Example: const siteData = await sanityClient.fetch(query);

import { SiteContent } from '@/types';

// Using picsum.photos with specific seeds for consistent, reliable images
// Format: https://picsum.photos/seed/{seed}/{width}/{height}

export const siteData: SiteContent = {
  siteName: 'ITravel',
  siteDescription: 'Discover Unforgettable Adventures with Us',

  navigation: [
    { id: 'home', label: 'Home', href: '/', isActive: true },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'tours', label: 'Tours', href: '#tours' },
    { id: 'destinations', label: 'Destinations', href: '#destinations' },
    { id: 'blog', label: 'Blog', href: '#blog' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ],

  hero: {
    title: 'Discover Unforgettable Adventures with Us!',
    subtitle: 'We make your trip',
    searchPlaceholder: 'Where do you want to explore?',
    backgroundImage: 'https://picsum.photos/seed/mountain-hero/1920/1080',
    overlayText: 'Explore',
  },

  destinations: [
    {
      id: 'kyoto',
      name: 'Kyoto',
      location: 'Japan',
      description: 'Kyoto is famous for its numerous classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and traditional wooden houses.',
      image: 'https://picsum.photos/seed/kyoto-japan/800/600',
      rating: 4.9,
      reviewCount: 2847,
      price: '$1,299',
      duration: '7 Days',
      featured: true,
    },
    {
      id: 'santorini',
      name: 'Santorini',
      location: 'Greece',
      description: 'Santorini is one of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC.',
      image: 'https://picsum.photos/seed/santorini-greece/800/600',
      rating: 4.8,
      reviewCount: 3156,
      price: '$1,499',
      duration: '5 Days',
      featured: true,
    },
    {
      id: 'bali',
      name: 'Bali',
      location: 'Indonesia',
      description: 'Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.',
      image: 'https://picsum.photos/seed/bali-indonesia/800/600',
      rating: 4.7,
      reviewCount: 4521,
      price: '$999',
      duration: '6 Days',
    },
    {
      id: 'maldives',
      name: 'Maldives',
      location: 'South Asia',
      description: 'The Maldives is a tropical nation in the Indian Ocean composed of 26 ring-shaped atolls, which are made up of more than 1,000 coral islands.',
      image: 'https://picsum.photos/seed/maldives-beach/800/600',
      rating: 4.9,
      reviewCount: 2103,
      price: '$2,199',
      duration: '5 Days',
    },
  ],

  stats: [
    {
      id: 'destinations',
      value: '72',
      label: 'World destinations',
    },
    {
      id: 'satisfaction',
      value: '94',
      label: 'Positive feedback',
      suffix: '%',
    },
    {
      id: 'travelers',
      value: '1000',
      label: 'Happy travelers',
      suffix: '+',
    },
  ],

  about: {
    badge: '12K+ Travelers Trust Us',
    title: 'About Us',
    description: 'We are passionate about creating unforgettable travel experiences. With over a decade of expertise, we\'ve helped thousands of travelers discover the world\'s most beautiful destinations.',
    features: [
      {
        id: 'expert',
        icon: 'compass',
        title: 'Expert Guides',
        description: 'Professional local guides with deep knowledge',
      },
      {
        id: 'support',
        icon: 'headphones',
        title: '24/7 Support',
        description: 'Round-the-clock assistance for travelers',
      },
      {
        id: 'value',
        icon: 'shield',
        title: 'Best Value',
        description: 'Competitive prices without compromising quality',
      },
    ],
    images: [
      'https://picsum.photos/seed/travel-group/600/800',
      'https://picsum.photos/seed/adventure-hiking/600/400',
      'https://picsum.photos/seed/beach-sunset/600/400',
    ],
    statsHighlight: {
      value: '12K+',
      label: 'Travelers',
    },
  },

  booking: {
    sectionLabel: 'Why Choose Us',
    title: 'Seamless Online Booking',
    description: 'Book your next adventure with just a few taps. Our intuitive platform makes planning your dream vacation effortless.',
    features: [
      {
        id: 'trips',
        icon: 'map',
        value: '8.4K',
        label: 'Trips Booked',
      },
      {
        id: 'hotels',
        icon: 'building',
        value: '2.1K',
        label: 'Partner Hotels',
      },
      {
        id: 'rating',
        icon: 'star',
        value: '4.9',
        label: 'User Rating',
      },
    ],
    appPreview: 'https://picsum.photos/seed/mobile-app/400/800',
    ctaText: 'Download App',
  },

  adventure: {
    sectionLabel: 'Find Your Adventure',
    title: 'Find The Perfect Adventure',
    rating: {
      value: '4.6K',
      label: 'Reviews from satisfied travelers who found their perfect adventure with us',
    },
    categories: [
      {
        id: 'trekking',
        name: 'Trekking',
        slug: 'trekking',
        image: 'https://picsum.photos/seed/trekking-mountain/600/800',
        count: 156,
      },
      {
        id: 'culture',
        name: 'Culture',
        slug: 'culture',
        image: 'https://picsum.photos/seed/culture-temple/600/800',
        count: 89,
      },
      {
        id: 'beaches',
        name: 'Beaches',
        slug: 'beaches',
        image: 'https://picsum.photos/seed/tropical-beach/600/800',
        count: 124,
      },
      {
        id: 'mountains',
        name: 'Mountains',
        slug: 'mountains',
        image: 'https://picsum.photos/seed/snowy-peaks/600/800',
        count: 98,
      },
    ],
  },

  events: {
    year: '2025',
    title: 'Top Event of 2025',
    events: [
      {
        id: 'lantern',
        title: 'Lantern Festival',
        description: 'Experience the magical Yi Peng Lantern Festival in Thailand',
        image: 'https://picsum.photos/seed/lantern-festival/600/800',
        date: 'November 2025',
        location: 'Chiang Mai, Thailand',
      },
      {
        id: 'aurora',
        title: 'Northern Lights',
        description: 'Witness the spectacular Aurora Borealis in Norway',
        image: 'https://picsum.photos/seed/aurora-norway/600/800',
        date: 'December 2025',
        location: 'Tromsø, Norway',
      },
      {
        id: 'carnival',
        title: 'Rio Carnival',
        description: 'Join the world\'s biggest carnival celebration',
        image: 'https://picsum.photos/seed/rio-carnival/600/800',
        date: 'February 2025',
        location: 'Rio de Janeiro, Brazil',
      },
    ],
    partners: [
      { id: 'airbnb', name: 'Airbnb', logo: '/partners/airbnb.svg' },
      { id: 'expedia', name: 'Expedia', logo: '/partners/expedia.svg' },
      { id: 'booking', name: 'Booking.com', logo: '/partners/booking.svg' },
      { id: 'tripadvisor', name: 'TripAdvisor', logo: '/partners/tripadvisor.svg' },
      { id: 'klm', name: 'KLM', logo: '/partners/klm.svg' },
    ],
  },

  testimonials: {
    sectionLabel: 'Testimonials',
    title: 'What They Say About Us',
    backgroundImage: 'https://picsum.photos/seed/travel-background/1920/1080',
    testimonials: [
      {
        id: 'review1',
        author: {
          name: 'Elena Martinez',
          title: 'Travel Enthusiast',
          avatar: 'https://i.pravatar.cc/150?u=elena-martinez',
          location: 'Barcelona, Spain',
        },
        content: 'The trip to Japan was absolutely incredible! Every detail was perfectly organized, from the traditional ryokan stays to the hidden gem restaurants. I\'ve traveled with many agencies, but ITravel truly exceeded my expectations.',
        rating: 5,
        date: 'October 2024',
      },
      {
        id: 'review2',
        author: {
          name: 'James Wilson',
          title: 'Adventure Seeker',
          avatar: 'https://i.pravatar.cc/150?u=james-wilson',
          location: 'London, UK',
        },
        content: 'From the moment I booked to the last day of my trip, everything was seamless. The local guides were knowledgeable and friendly. Can\'t wait for my next adventure with ITravel!',
        rating: 5,
        date: 'September 2024',
      },
      {
        id: 'review3',
        author: {
          name: 'Sarah Chen',
          title: 'Solo Traveler',
          avatar: 'https://i.pravatar.cc/150?u=sarah-chen',
          location: 'Singapore',
        },
        content: 'As a solo female traveler, safety was my top priority. ITravel made me feel secure throughout my journey while still allowing me the freedom to explore. Highly recommended!',
        rating: 5,
        date: 'August 2024',
      },
    ],
  },

  blog: {
    sectionTitle: 'Blog',
    posts: [
      {
        id: 'post1',
        title: 'Sri Lanka',
        excerpt: 'Discover the pearl of the Indian Ocean with its ancient temples, pristine beaches, and lush tea plantations.',
        image: 'https://picsum.photos/seed/sri-lanka/600/400',
        category: 'Destination Guide',
        date: 'January 15, 2025',
        readTime: '8 min read',
        featured: true,
        stats: {
          value: '130K',
          label: 'Travelers visited',
        },
      },
      {
        id: 'post2',
        title: 'Discover the best season for stress-free flights',
        excerpt: 'Learn the secrets of finding cheaper flights and avoiding crowded airports.',
        image: 'https://picsum.photos/seed/airplane-sky/600/400',
        category: 'Travel Tips',
        date: 'January 10, 2025',
        readTime: '5 min read',
      },
      {
        id: 'post3',
        title: 'Just for You - Personalized Travel',
        excerpt: 'How AI is revolutionizing the way we plan our trips.',
        image: 'https://picsum.photos/seed/road-trip/600/400',
        category: 'Technology',
        date: 'January 5, 2025',
        readTime: '6 min read',
      },
    ],
  },

  cta: {
    title: 'Ready to Explore?',
    subtitle: 'Start your journey today and create memories that will last a lifetime.',
    backgroundImage: 'https://picsum.photos/seed/adventure-cta/1920/1080',
    ctaText: 'Book Your Adventure',
    ctaLink: '/book',
  },

  footer: {
    logo: '/logo.svg',
    tagline: 'Making travel dreams come true since 2010.',
    sections: [
      {
        id: 'company',
        title: 'Company',
        links: [
          { id: 'about', label: 'About Us', href: '/about' },
          { id: 'careers', label: 'Careers', href: '/careers' },
          { id: 'press', label: 'Press', href: '/press' },
        ],
      },
      {
        id: 'support',
        title: 'Support',
        links: [
          { id: 'help', label: 'Help Center', href: '/help' },
          { id: 'safety', label: 'Safety', href: '/safety' },
          { id: 'cancel', label: 'Cancellation', href: '/cancellation' },
        ],
      },
      {
        id: 'legal',
        title: 'Legal',
        links: [
          { id: 'terms', label: 'Terms', href: '/terms' },
          { id: 'privacy', label: 'Privacy', href: '/privacy' },
          { id: 'cookies', label: 'Cookies', href: '/cookies' },
        ],
      },
    ],
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
      { platform: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
      { platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
      { platform: 'YouTube', url: 'https://youtube.com', icon: 'youtube' },
    ],
    faqs: [
      {
        id: 'faq1',
        question: 'How do I book a trip?',
        answer: 'Simply browse our destinations, select your preferred package, and follow the booking steps. Our team will confirm your reservation within 24 hours.',
      },
      {
        id: 'faq2',
        question: 'What is your cancellation policy?',
        answer: 'Free cancellation up to 30 days before departure. Partial refunds available for cancellations made 15-29 days prior.',
      },
      {
        id: 'faq3',
        question: 'Do you offer group discounts?',
        answer: 'Yes! Groups of 6 or more receive 10% off. Contact us for custom group packages.',
      },
    ],
    copyright: '© 2025 ITravel. All rights reserved.',
  },
};

export default siteData;
