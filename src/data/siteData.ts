// ============================================
// ITRAVEL - Mock Data (CMS Ready)
// ============================================
// Replace these imports with your CMS fetch calls.
// Example: const siteData = await sanityClient.fetch(query);

import { SiteContent } from '@/types';

// Using Unsplash for high-quality travel photography
// All images are free to use under Unsplash license

export const siteData: SiteContent = {
  siteName: 'ITravel',
  siteDescription: 'Discover Unforgettable Adventures with Us',

  navigation: [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'about', label: 'About', href: '/about' },
    { id: 'tours', label: 'Tours', href: '/tours' },
    { id: 'blog', label: 'Blog', href: '/blog' },
    { id: 'contact', label: 'Contact', href: '/contact' },
  ],

  hero: {
    title: 'Discover the Beauty of Albania!',
    subtitle: 'Your Gateway to the Hidden Gem of Europe',
    searchPlaceholder: 'Search Albanian destinations...',
    backgroundImage: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1920&h=1080&fit=crop&q=85',
    backgroundVideo: {
      // Using Pexels free travel video - beautiful ocean/coastal scenery
      mp4: 'https://videos.pexels.com/video-files/857251/857251-hd_1920_1080_25fps.mp4',
      webm: 'https://videos.pexels.com/video-files/857251/857251-hd_1920_1080_25fps.mp4',
      poster: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1920&h=1080&fit=crop&q=85',
    },
    overlayText: 'Albania',
  },

  destinations: [
    {
      id: 'tirana',
      name: 'Tirana',
      location: 'Albania',
      description: 'Albania\'s vibrant capital blends Ottoman, Italian, and Soviet architecture with colorful buildings, bustling cafes, and a thriving arts scene.',
      image: 'https://images.unsplash.com/photo-1603787081207-362bcef7c144?w=800&h=600&fit=crop&q=80',
      rating: 4.8,
      reviewCount: 2156,
      price: '€299',
      duration: '3 Days',
      featured: true,
    },
    {
      id: 'saranda',
      name: 'Saranda',
      location: 'Albanian Riviera',
      description: 'A stunning coastal resort town with crystal-clear turquoise waters, beautiful beaches, and the ancient ruins of Butrint nearby.',
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop&q=80',
      rating: 4.9,
      reviewCount: 3847,
      price: '€449',
      duration: '5 Days',
      featured: true,
    },
    {
      id: 'berat',
      name: 'Berat',
      location: 'Albania',
      description: 'UNESCO World Heritage "City of a Thousand Windows" featuring stunning Ottoman architecture and a hilltop castle overlooking the Osum River.',
      image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&h=600&fit=crop&q=80',
      rating: 4.9,
      reviewCount: 1892,
      price: '€349',
      duration: '4 Days',
      featured: true,
    },
    {
      id: 'gjirokaster',
      name: 'Gjirokastër',
      location: 'Albania',
      description: 'Another UNESCO gem, this "City of Stone" boasts a magnificent castle, traditional stone houses, and breathtaking mountain views.',
      image: 'https://images.unsplash.com/photo-1555990793-da11153b2473?w=800&h=600&fit=crop&q=80',
      rating: 4.8,
      reviewCount: 1654,
      price: '€329',
      duration: '3 Days',
    },
    {
      id: 'ksamil',
      name: 'Ksamil',
      location: 'Albanian Riviera',
      description: 'Often called "Albanian Maldives", this paradise features pristine white sand beaches, turquoise waters, and small islands to explore.',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop&q=80',
      rating: 4.9,
      reviewCount: 4521,
      price: '€399',
      duration: '5 Days',
    },
    {
      id: 'theth',
      name: 'Theth',
      location: 'Albanian Alps',
      description: 'A remote mountain village perfect for hiking, featuring dramatic peaks, the Blue Eye waterfall, and traditional stone tower houses.',
      image: 'https://images.unsplash.com/photo-1586768942530-c9a50f2bba90?w=800&h=600&fit=crop&q=80',
      rating: 4.7,
      reviewCount: 1203,
      price: '€279',
      duration: '4 Days',
    },
  ],

  stats: [
    {
      id: 'destinations',
      value: '28',
      label: 'Albanian destinations',
    },
    {
      id: 'satisfaction',
      value: '98',
      label: 'Positive feedback',
      suffix: '%',
    },
    {
      id: 'travelers',
      value: '5000',
      label: 'Happy travelers',
      suffix: '+',
    },
  ],

  about: {
    badge: '5K+ Happy Travelers',
    title: 'Your Albania Experts',
    description: 'We are passionate about sharing the beauty of Albania with the world. As locals, we know the hidden gems, the best beaches, and the authentic experiences that make Albania truly special.',
    features: [
      {
        id: 'expert',
        icon: 'compass',
        title: 'Local Expertise',
        description: 'Albanian guides who know every hidden corner',
      },
      {
        id: 'support',
        icon: 'headphones',
        title: '24/7 Support',
        description: 'Always available in English, Albanian & Italian',
      },
      {
        id: 'value',
        icon: 'shield',
        title: 'Best Prices',
        description: 'Direct local rates without middlemen',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586768942530-c9a50f2bba90?w=600&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&h=400&fit=crop&q=80',
    ],
    statsHighlight: {
      value: '5K+',
      label: 'Happy Travelers',
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
    appPreview: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=800&fit=crop&q=80',
    ctaText: 'Download App',
  },

  adventure: {
    sectionLabel: 'Explore Albania',
    title: 'Choose Your Albanian Adventure',
    rating: {
      value: '2.8K',
      label: 'Reviews from travelers who discovered the magic of Albania with us',
    },
    categories: [
      {
        id: 'riviera',
        name: 'Riviera',
        slug: 'riviera',
        image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=400&fit=crop&q=80',
        count: 45,
      },
      {
        id: 'unesco',
        name: 'UNESCO Sites',
        slug: 'unesco',
        image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&h=400&fit=crop&q=80',
        count: 12,
      },
      {
        id: 'alps',
        name: 'Albanian Alps',
        slug: 'alps',
        image: 'https://images.unsplash.com/photo-1586768942530-c9a50f2bba90?w=600&h=400&fit=crop&q=80',
        count: 28,
      },
      {
        id: 'food-wine',
        name: 'Food & Wine',
        slug: 'food-wine',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80',
        count: 18,
      },
    ],
  },

  events: {
    year: '2026',
    title: 'Top Albanian Events',
    events: [
      {
        id: 'summer-day',
        title: 'Dita e Verës',
        description: 'Celebrate Albania\'s traditional Summer Day festival with music, dancing, and delicious ballokume sweets',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop&q=80',
        date: 'March 14, 2026',
        location: 'Elbasan, Albania',
      },
      {
        id: 'kala-festival',
        title: 'Kala Festival',
        description: 'Albania\'s premier electronic music festival set on the stunning Albanian Riviera beaches',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop&q=80',
        date: 'June 2026',
        location: 'Dhërmi, Albanian Riviera',
      },
      {
        id: 'tirana-jazz',
        title: 'Tirana Jazz Festival',
        description: 'International jazz musicians gather in Albania\'s capital for world-class performances',
        image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&h=400&fit=crop&q=80',
        date: 'September 2026',
        location: 'Tirana, Albania',
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
    backgroundImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=800&fit=crop&q=80',
    testimonials: [
      {
        id: 'review1',
        author: {
          name: 'Elena Martinez',
          title: 'Travel Enthusiast',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80',
          location: 'Barcelona, Spain',
        },
        content: 'Albania was a revelation! The Albanian Riviera beaches are stunning and uncrowded. Our guide took us to hidden coves in Ksamil that felt like paradise. ITravel made everything seamless.',
        rating: 5,
        date: 'October 2025',
      },
      {
        id: 'review2',
        author: {
          name: 'James Wilson',
          title: 'Adventure Seeker',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
          location: 'London, UK',
        },
        content: 'The Theth to Valbona hike was the highlight of my year! The Albanian Alps are breathtaking. Local guides knew every trail and the guesthouses were incredibly welcoming.',
        rating: 5,
        date: 'September 2025',
      },
      {
        id: 'review3',
        author: {
          name: 'Sarah Chen',
          title: 'Solo Traveler',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80',
          location: 'Singapore',
        },
        content: 'As a solo traveler, I felt completely safe exploring Berat and Gjirokastër. The UNESCO sites are magnificent and Albanians are the most hospitable people I\'ve ever met!',
        rating: 5,
        date: 'August 2025',
      },
    ],
  },

  blog: {
    sectionTitle: 'Blog',
    posts: [
      {
        id: 'post1',
        title: 'Albanian Riviera: Europe\'s Best Kept Secret',
        excerpt: 'Discover pristine beaches, crystal-clear waters, and charming coastal villages along Albania\'s stunning Mediterranean coastline.',
        image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=500&fit=crop&q=80',
        category: 'Destination Guide',
        date: 'January 15, 2026',
        readTime: '8 min read',
        featured: true,
        stats: {
          value: '50K',
          label: 'Travelers visited',
        },
      },
      {
        id: 'post2',
        title: 'A Food Lover\'s Guide to Albanian Cuisine',
        excerpt: 'From byrek to tavë kosi, explore the rich culinary traditions that make Albanian food unforgettable.',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop&q=80',
        category: 'Food & Culture',
        date: 'January 10, 2026',
        readTime: '6 min read',
      },
      {
        id: 'post3',
        title: 'Hiking the Albanian Alps: Theth to Valbona',
        excerpt: 'Everything you need to know about trekking the famous Peaks of the Balkans trail.',
        image: 'https://images.unsplash.com/photo-1586768942530-c9a50f2bba90?w=800&h=500&fit=crop&q=80',
        category: 'Adventure',
        date: 'January 5, 2026',
        readTime: '10 min read',
      },
    ],
  },

  cta: {
    title: 'Ready to Explore?',
    subtitle: 'Start your journey today and create memories that will last a lifetime.',
    backgroundImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=600&fit=crop&q=85',
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
      { platform: 'Instagram', url: 'https://www.instagram.com/itraveltours666', icon: 'instagram' },
      { platform: 'Facebook', url: 'https://www.facebook.com/sharer/sharer.php?u=19kU1uLHB5', icon: 'facebook' },
      { platform: 'TikTok', url: 'https://www.tiktok.com/@k.q031', icon: 'tiktok' },
      { platform: 'YouTube', url: 'https://youtube.com/@itravel', icon: 'youtube' },
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
