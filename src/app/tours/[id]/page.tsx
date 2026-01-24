'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  Clock,
  Users,
  MapPin,
  Calendar,
  Check,
  X,
  ChevronDown,
  Heart,
  Share2,
} from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import { siteData } from '@/data/siteData';
import styles from './tourDetail.module.scss';

// Extended tour data
const tourDetails: Record<string, {
  id: string;
  name: string;
  location: string;
  description: string;
  fullDescription: string[];
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  price: string;
  duration: string;
  groupSize: string;
  difficulty: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  itinerary: { day: number; title: string; description: string }[];
}> = {
  tirana: {
    id: 'tirana',
    name: 'Tirana City Explorer',
    location: 'Tirana, Albania',
    description: 'Albania\'s vibrant capital blends Ottoman, Italian, and Soviet architecture with colorful buildings, bustling cafes, and a thriving arts scene.',
    fullDescription: [
      'Discover the heart of Albania on this immersive 3-day journey through Tirana, the nation\'s colorful and dynamic capital city.',
      'From the moment you arrive, you\'ll be captivated by the unique blend of architectural styles that tell the story of Albania\'s complex history – from Ottoman mosques to Italian boulevards to brutalist communist monuments.',
      'Our expert local guides will take you beyond the tourist spots to experience the authentic Tirana that locals love, from hidden coffee shops to the best burek bakeries.',
    ],
    image: 'https://images.unsplash.com/photo-1603787081207-362bcef7c144?w=1200&h=600&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1603787081207-362bcef7c144?w=600&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555990793-da11153b2473?w=600&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=400&fit=crop&q=80',
    ],
    rating: 4.8,
    reviewCount: 2156,
    price: '€299',
    duration: '3 Days',
    groupSize: '8-12 people',
    difficulty: 'Easy',
    highlights: [
      'Explore Skanderbeg Square and the National History Museum',
      'Visit Bunk\'Art, a museum in a massive communist bunker',
      'Walk the trendy Blloku neighborhood',
      'Day trip to Dajti Mountain by cable car',
      'Traditional Albanian cooking class',
      'Wine tasting at local vineyard',
    ],
    included: [
      '2 nights accommodation in 4-star hotel',
      'Daily breakfast and welcome dinner',
      'All entrance fees and activities',
      'Professional English-speaking guide',
      'Dajti cable car tickets',
      'Cooking class materials',
      'Wine tasting session',
      'Airport transfers',
    ],
    notIncluded: [
      'International flights',
      'Travel insurance',
      'Personal expenses',
      'Gratuities (optional)',
      'Lunches not mentioned',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & City Introduction',
        description: 'Arrive at Tirana Airport and transfer to your hotel. After settling in, join your guide for an evening walking tour of the city center, including Skanderbeg Square and the Et\'hem Bey Mosque. Welcome dinner at a traditional restaurant.',
      },
      {
        day: 2,
        title: 'Deep Dive into History & Culture',
        description: 'Morning visit to Bunk\'Art 1 & 2, exploring Albania\'s communist past. Lunch in the trendy Blloku neighborhood. Afternoon cooking class learning to make traditional byrek, tavë kosi, and other Albanian specialties. Evening free to explore.',
      },
      {
        day: 3,
        title: 'Mountain Views & Departure',
        description: 'Take the Dajti Express cable car for panoramic views of Tirana. Visit a local winery for tastings and lunch with vineyard views. Transfer to airport for departure.',
      },
    ],
  },
  saranda: {
    id: 'saranda',
    name: 'Albanian Riviera Adventure',
    location: 'Saranda & Albanian Riviera',
    description: 'A stunning coastal resort town with crystal-clear turquoise waters, beautiful beaches, and the ancient ruins of Butrint nearby.',
    fullDescription: [
      'Experience the best of the Albanian Riviera on this 5-day adventure along one of Europe\'s most unspoiled coastlines.',
      'From the vibrant resort town of Saranda to the pristine beaches of Ksamil and the UNESCO World Heritage site of Butrint, this tour combines relaxation with cultural discovery.',
      'Swim in waters so clear you can see the bottom 20 meters below, explore ancient Greek and Roman ruins, and enjoy the warm hospitality that Albania is famous for.',
    ],
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&h=600&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&h=400&fit=crop&q=80',
    ],
    rating: 4.9,
    reviewCount: 3847,
    price: '€449',
    duration: '5 Days',
    groupSize: '6-10 people',
    difficulty: 'Easy',
    highlights: [
      'Swim at the famous Ksamil beaches and islands',
      'Explore ancient Butrint (UNESCO World Heritage)',
      'Boat trip to Corfu island (optional)',
      'Visit the Blue Eye natural spring',
      'Sunset at Lëkurësi Castle',
      'Fresh seafood dining by the sea',
    ],
    included: [
      '4 nights beachfront accommodation',
      'Daily breakfast',
      'Butrint entrance and guided tour',
      'Blue Eye excursion',
      'Boat trip to Ksamil islands',
      'Sunset dinner at Lëkurësi',
      'All transportation',
      'Professional guide',
    ],
    notIncluded: [
      'Flights',
      'Travel insurance',
      'Corfu day trip (optional extra)',
      'Personal expenses',
      'Other meals',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Welcome to Saranda',
        description: 'Arrive and transfer to your beachfront hotel. Afternoon free to relax and explore the promenade. Evening welcome dinner with views over Corfu.',
      },
      {
        day: 2,
        title: 'Butrint & Blue Eye',
        description: 'Morning visit to the ancient city of Butrint, exploring 2,500 years of history. Lunch at a traditional restaurant. Afternoon visit to the mesmerizing Blue Eye spring.',
      },
      {
        day: 3,
        title: 'Ksamil Paradise',
        description: 'Full day at the stunning Ksamil beaches. Boat trip to explore the small islands. Swimming, sunbathing, and lunch at a beachside taverna.',
      },
      {
        day: 4,
        title: 'Free Day & Sunset',
        description: 'Day at leisure – relax at the beach, optional day trip to Corfu, or explore Saranda\'s cafes and shops. Evening: sunset dinner at Lëkurësi Castle.',
      },
      {
        day: 5,
        title: 'Departure',
        description: 'Final morning swim if time permits. Transfer to airport or onward destination.',
      },
    ],
  },
  berat: {
    id: 'berat',
    name: 'Berat: City of a Thousand Windows',
    location: 'Berat, Albania',
    description: 'UNESCO World Heritage "City of a Thousand Windows" featuring stunning Ottoman architecture and a hilltop castle overlooking the Osum River.',
    fullDescription: [
      'Step back in time in Berat, one of the oldest continuously inhabited cities in Albania and a UNESCO World Heritage site.',
      'The city\'s distinctive Ottoman-era houses, built on a steep hillside with their many windows facing the valley, have earned it the poetic name "City of a Thousand Windows."',
      'Explore the ancient Kalasa fortress still inhabited by families, discover Byzantine churches with priceless icons, and experience the traditional way of life that continues in this remarkable town.',
    ],
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&h=600&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555990793-da11153b2473?w=600&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1603787081207-362bcef7c144?w=600&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=400&fit=crop&q=80',
    ],
    rating: 4.9,
    reviewCount: 1892,
    price: '€349',
    duration: '4 Days',
    groupSize: '8-12 people',
    difficulty: 'Moderate',
    highlights: [
      'Explore the living castle of Kalasa',
      'Visit the Onufri Museum and its Byzantine icons',
      'Walk through historic Mangalem and Gorica quarters',
      'Wine tasting at local wineries',
      'Osumi Canyon rafting or hiking',
      'Traditional raki distillery visit',
    ],
    included: [
      '3 nights boutique hotel accommodation',
      'Daily breakfast',
      'Expert local guide',
      'All museum and site entries',
      'Wine and raki tastings',
      'Osumi Canyon excursion',
      'Welcome and farewell dinners',
      'All transfers',
    ],
    notIncluded: [
      'Flights',
      'Travel insurance',
      'Personal expenses',
      'Lunches',
      'Gratuities',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Berat',
        description: 'Transfer from Tirana to Berat. Check into your boutique hotel in a restored Ottoman house. Afternoon orientation walk and welcome dinner in a traditional restaurant.',
      },
      {
        day: 2,
        title: 'Castle & Museums',
        description: 'Morning climb to Kalasa castle, exploring its churches, museums, and the Onufri collection of Byzantine icons. Lunch with views. Afternoon walk through Mangalem and Gorica quarters.',
      },
      {
        day: 3,
        title: 'Osumi Canyon & Wineries',
        description: 'Day trip to the Osumi Canyon for rafting (in season) or hiking. Lunch in Corovoda. Afternoon visit to the Çobo winery for tastings. Evening: visit a traditional raki distillery.',
      },
      {
        day: 4,
        title: 'Departure',
        description: 'Morning free for final photos and souvenir shopping. Farewell lunch before transfer to your next destination.',
      },
    ],
  },
};

export default function TourDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const tour = tourDetails[id] || tourDetails[Object.keys(tourDetails)[0]];

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!tour) {
    return (
      <>
        <Navbar navigation={siteData.navigation} siteName={siteData.siteName} />
        <div className={styles.notFound}>
          <h1>Tour Not Found</h1>
          <p>The tour you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/tours" className={styles.backButton}>
            <ArrowLeft size={16} />
            Back to Tours
          </Link>
        </div>
        <Footer content={siteData.footer} siteName={siteData.siteName} />
      </>
    );
  }

  return (
    <>
      <Navbar navigation={siteData.navigation} siteName={siteData.siteName} />
      <main className={styles.tourDetail}>
        <div className={styles.hero}>
          <Image
            src={tour.image}
            alt={tour.name}
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <Link href="/tours" className={styles.backLink}>
              <ArrowLeft size={16} />
              Back to Tours
            </Link>
            <div className={styles.location}>
              <MapPin size={16} />
              {tour.location}
            </div>
            <h1>{tour.name}</h1>
            <div className={styles.heroMeta}>
              <span className={styles.rating}>
                <Star size={16} fill="currentColor" />
                {tour.rating} ({tour.reviewCount.toLocaleString()} reviews)
              </span>
              <span className={styles.duration}>
                <Clock size={16} />
                {tour.duration}
              </span>
              <span className={styles.groupSize}>
                <Users size={16} />
                {tour.groupSize}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.mainContent}>
            <section className={styles.overview}>
              <h2 className={styles.sectionTitle}>Overview</h2>
              {tour.fullDescription.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </section>

            <section className={styles.gallery}>
              <h2 className={styles.sectionTitle}>Gallery</h2>
              <div className={styles.galleryGrid}>
                {tour.gallery.map((image, index) => (
                  <div key={index} className={styles.galleryItem}>
                    <Image
                      src={image}
                      alt={`${tour.name} - Image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.highlights}>
              <h2 className={styles.sectionTitle}>Tour Highlights</h2>
              <div className={styles.highlightsList}>
                {tour.highlights.map((highlight, index) => (
                  <div key={index} className={styles.highlightItem}>
                    <Check size={18} className={styles.checkIcon} />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.itinerary}>
              <h2 className={styles.sectionTitle}>Itinerary</h2>
              <div className={styles.itineraryList}>
                {tour.itinerary.map((day, index) => (
                  <div key={day.day} className={styles.itineraryDay}>
                    <button
                      className={`${styles.dayHeader} ${expandedDay === index ? styles.expanded : ''}`}
                      onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                      aria-expanded={expandedDay === index}
                    >
                      <div className={styles.dayInfo}>
                        <span className={styles.dayNumber}>Day {day.day}</span>
                        <span className={styles.dayTitle}>{day.title}</span>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`${styles.chevron} ${expandedDay === index ? styles.rotated : ''}`}
                      />
                    </button>
                    {expandedDay === index && (
                      <div className={styles.dayContent}>
                        <p>{day.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.includedSection}>
              <div className={styles.includedColumn}>
                <h3>What&apos;s Included</h3>
                <ul>
                  {tour.included.map((item, index) => (
                    <li key={index}>
                      <Check size={16} className={styles.includeIcon} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.includedColumn}>
                <h3>Not Included</h3>
                <ul>
                  {tour.notIncluded.map((item, index) => (
                    <li key={index}>
                      <X size={16} className={styles.excludeIcon} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.bookingCard}>
              <div className={styles.priceRow}>
                <span className={styles.price}>{tour.price}</span>
                <span className={styles.perPerson}>per person</span>
              </div>

              <div className={styles.tourMeta}>
                <div className={styles.metaItem}>
                  <Clock size={16} />
                  <span>{tour.duration}</span>
                </div>
                <div className={styles.metaItem}>
                  <Users size={16} />
                  <span>{tour.groupSize}</span>
                </div>
                <div className={styles.metaItem}>
                  <Calendar size={16} />
                  <span>{tour.difficulty}</span>
                </div>
              </div>

              <button
                className={styles.bookButton}
                onClick={() => setIsBookingOpen(true)}
              >
                Book This Tour
              </button>

              <div className={styles.actionButtons}>
                <button
                  className={`${styles.actionBtn} ${isFavorite ? styles.active : ''}`}
                  onClick={() => setIsFavorite(!isFavorite)}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                  Save
                </button>
                <button className={styles.actionBtn} aria-label="Share this tour">
                  <Share2 size={18} />
                  Share
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        destination={{
          id: tour.id,
          name: tour.name,
          location: tour.location,
          description: tour.description,
          image: tour.image,
          rating: tour.rating,
          reviewCount: tour.reviewCount,
          price: tour.price,
          duration: tour.duration,
        }}
      />

      <Footer content={siteData.footer} siteName={siteData.siteName} />
    </>
  );
}
