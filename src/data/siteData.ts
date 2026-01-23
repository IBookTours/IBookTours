// ============================================
// ITRAVEL - Mock Data (CMS Ready)
// ============================================
// Replace these imports with your CMS fetch calls.
// Example: const siteData = await sanityClient.fetch(query);

import { SiteContent } from '@/types';

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
    backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    overlayText: 'Explore',
  },

  destinations: [
    {
      id: 'kyoto',
      name: 'Kyoto',
      location: 'Japan',
      description: 'Kyoto is famous for its numerous classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and traditional wooden houses.',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
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
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
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
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
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
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
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
      'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=600&q=80',
      'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&q=80',
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&q=80',
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
    appPreview: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80',
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
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80',
        count: 156,
      },
      {
        id: 'culture',
        name: 'Culture',
        slug: 'culture',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80',
        count: 89,
      },
      {
        id: 'beaches',
        name: 'Beaches',
        slug: 'beaches',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
        count: 124,
      },
      {
        id: 'mountains',
        name: 'Mountains',
        slug: 'mountains',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
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
        image: 'https://images.unsplash.com/photo-1602836831852-4c5f5e92c3c8?w=600&q=80',
        date: 'November 2025',
        location: 'Chiang Mai, Thailand',
      },
      {
        id: 'aurora',
        title: 'Northern Lights',
        description: 'Witness the spectacular Aurora Borealis in Norway',
        image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80',
        date: 'December 2025',
        location: 'Tromsø, Norway',
      },
      {
        id: 'carnival',
        title: 'Rio Carnival',
        description: 'Join the world\'s biggest carnival celebration',
        image: 'https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=600&q=80',
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
    backgroundImage: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80',
    testimonials: [
      {
        id: 'review1',
        author: {
          name: 'Elena Martinez',
          title: 'Travel Enthusiast',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
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
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
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
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
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
        image: 'https://images.unsplash.com/photo-1586613832764-a6dbcef72ed0?w=600&q=80',
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
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
        category: 'Travel Tips',
        date: 'January 10, 2025',
        readTime: '5 min read',
      },
      {
        id: 'post3',
        title: 'Just for You - Personalized Travel',
        excerpt: 'How AI is revolutionizing the way we plan our trips.',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
        category: 'Technology',
        date: 'January 5, 2025',
        readTime: '6 min read',
      },
    ],
  },

  cta: {
    title: 'Ready to Explore?',
    subtitle: 'Start your journey today and create memories that will last a lifetime.',
    backgroundImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80',
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
