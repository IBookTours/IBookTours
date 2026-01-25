'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { siteData } from '@/data/siteData';
import styles from './blogPost.module.scss';

const FALLBACK_IMAGE = '/media/hero-fallback.jpg';
const FALLBACK_AVATAR = '/icon.svg';

// Extended blog posts data
const blogPosts: Record<string, {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
}> = {
  post1: {
    id: 'post1',
    title: 'Top 10 Hidden Gems in Albania',
    excerpt: 'Discover the secret spots that most tourists never see in beautiful Albania.',
    content: [
      'Albania remains one of Europe\'s best-kept secrets, offering stunning landscapes, rich history, and authentic experiences without the crowds. Here are our top 10 hidden gems that will make your trip unforgettable.',
      '1. The Blue Eye (Syri i Kaltër) - This natural spring with crystal-clear blue water is mesmerizing. The water appears to be over 50 meters deep, though the exact depth remains unknown.',
      '2. Theth National Park - A remote mountain village accessible only by rugged roads, Theth offers dramatic Alpine scenery, traditional stone towers, and the stunning Grunas Waterfall.',
      '3. Benja Thermal Baths - Located near Përmet, these natural hot springs along the Lengarica River provide a unique swimming experience surrounded by Ottoman-era bridges.',
      '4. The Abandoned Town of Old Qeparo - This ghost village on the Riviera offers fascinating ruins and incredible views of the coast below.',
      '5. Lake Bovilla - Just 15km from Tirana, this turquoise reservoir is perfect for kayaking and offers hiking trails with panoramic views.',
      '6. Apollonia Archaeological Park - These extensive Greek and Roman ruins near Fier are surprisingly uncrowded and beautifully preserved.',
      '7. The Osumi Canyon - Albania\'s Grand Canyon offers rafting, hiking, and swimming in natural pools.',
      '8. Valbona Valley - Part of the Albanian Alps, this valley is a trekker\'s paradise with dramatic peaks and traditional guesthouses.',
      '9. The Cold War Bunkers - Over 170,000 bunkers dot the Albanian landscape. The Bunk\'Art museums in Tirana have converted some into fascinating art spaces.',
      '10. Dhërmi Beach - While increasingly popular, visiting in the shoulder season reveals why this is considered one of Europe\'s most beautiful beaches.',
    ],
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&h=600&fit=crop&q=85',
    category: 'Destination Guide',
    date: 'January 15, 2026',
    readTime: '8 min read',
    author: {
      name: 'Qaram Kassem',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      role: 'Founder & Travel Expert',
    },
  },
  post2: {
    id: 'post2',
    title: 'How AI is Revolutionizing Travel Planning',
    excerpt: 'Explore how artificial intelligence is changing the way we discover and book travel experiences.',
    content: [
      'The travel industry is experiencing a technological revolution, with AI at the forefront of innovation. From personalized recommendations to dynamic pricing, here\'s how AI is transforming your travel experience.',
      'Personalized Recommendations: AI algorithms analyze your past travel history, preferences, and browsing behavior to suggest destinations and experiences tailored specifically to you.',
      'Smart Pricing: Dynamic pricing algorithms adjust rates in real-time based on demand, weather, events, and hundreds of other factors, helping travelers find the best deals.',
      'Virtual Assistants: Chatbots and AI assistants now handle booking modifications, answer questions, and provide 24/7 customer support in multiple languages.',
      'Predictive Analytics: AI can predict flight delays, suggest optimal travel times, and even forecast destination popularity to help you avoid crowds.',
      'Language Translation: Real-time translation apps powered by AI have made communication barriers almost non-existent for modern travelers.',
      'Safety and Security: AI-powered systems monitor travel advisories, predict potential disruptions, and help keep travelers informed and safe.',
      'The future promises even more innovation: autonomous vehicles, biometric identification, and fully immersive virtual previews of destinations before you book.',
    ],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop&q=85',
    category: 'Technology',
    date: 'January 10, 2026',
    readTime: '6 min read',
    author: {
      name: 'Qaram Kassem',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      role: 'Founder & Travel Expert',
    },
  },
  post3: {
    id: 'post3',
    title: 'Best Time to Visit the Albanian Riviera',
    excerpt: 'Plan your perfect beach vacation with our seasonal guide to Albania\'s stunning coastline.',
    content: [
      'The Albanian Riviera stretches along the country\'s southwestern coast, offering some of the Mediterranean\'s most pristine beaches. Here\'s your complete seasonal guide.',
      'Summer (June-August): Peak season brings warm waters (24-26°C), guaranteed sunshine, and vibrant nightlife. Expect crowds at popular spots like Dhermi and Saranda. Book accommodations well in advance.',
      'Shoulder Season (May, September-October): Our top recommendation! Warm enough for swimming, fewer tourists, lower prices, and more authentic experiences. September often has the best weather.',
      'Spring (April-May): Wildflowers bloom, temperatures are pleasant for hiking, but swimming might still be chilly. Perfect for combining beach visits with mountain excursions.',
      'Winter (November-March): Many beach resorts close, but this is the cheapest time to visit. Great for exploring coastal towns without tourists and enjoying local life.',
      'Key Events: Consider planning around the Kala Festival (electronic music, June) or Apollonia Festival (arts, September) for unique cultural experiences.',
      'Pro Tips: The northern Riviera (Dhermi, Himara) is more developed; the southern section (Ksamil, Saranda) offers easier access to Butrint and Corfu. Rent a car for the best experience – the coastal road itself is an attraction.',
    ],
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&h=600&fit=crop&q=85',
    category: 'Travel Tips',
    date: 'January 5, 2026',
    readTime: '5 min read',
    author: {
      name: 'Qaram Kassem',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      role: 'Founder & Travel Expert',
    },
  },
  post4: {
    id: 'post4',
    title: 'Hidden Gems of Southeast Asia',
    excerpt: 'Explore off-the-beaten-path destinations that will take your breath away.',
    content: [
      'Southeast Asia is full of well-known destinations, but there are still plenty of hidden gems waiting to be discovered. Here are some lesser-known spots that deserve a place on your itinerary.',
      'Ha Giang, Vietnam: This remote northern province offers dramatic karst landscapes, terraced rice paddies, and authentic ethnic minority villages. The Ha Giang Loop is one of the most scenic motorcycle routes in Asia.',
      'Siquijor, Philippines: Known for its mystical reputation and healing traditions, this small island offers pristine beaches, waterfalls, and a laid-back atmosphere without the crowds.',
      'Kampot, Cambodia: This charming riverside town is famous for its pepper plantations, French colonial architecture, and stunning Bokor Mountain nearby.',
      'Pai, Thailand: Tucked in the mountains north of Chiang Mai, Pai offers hot springs, waterfalls, and a bohemian atmosphere that attracts artists and travelers seeking tranquility.',
      'Luang Prabang, Laos: While increasingly popular, this UNESCO World Heritage city still maintains its peaceful atmosphere with its morning alms-giving ceremony and stunning temples.',
    ],
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&h=600&fit=crop&q=85',
    category: 'Destination Guide',
    date: 'December 28, 2025',
    readTime: '10 min read',
    author: {
      name: 'Qaram Kassem',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      role: 'Founder & Travel Expert',
    },
  },
  post5: {
    id: 'post5',
    title: 'Packing Light: The Ultimate Guide',
    excerpt: 'Master the art of minimalist travel with our comprehensive packing guide.',
    content: [
      'Traveling light is a skill that can transform your travel experience. Here\'s everything you need to know about packing efficiently for any trip.',
      'The One-Bag Philosophy: A single carry-on can hold everything you need for trips up to several weeks. The key is choosing versatile items and packing techniques.',
      'Essential Clothing Rules: Pack neutral colors that mix and match. Choose fabrics that are wrinkle-resistant, quick-drying, and can be layered.',
      'The 5-4-3-2-1 Rule: 5 sets of underwear and socks, 4 tops, 3 bottoms, 2 pairs of shoes, 1 jacket. Adjust based on your destination and trip length.',
      'Toiletries: Solid toiletries (shampoo bars, solid toothpaste) save space and bypass liquid restrictions. Most hotels provide basics anyway.',
      'Tech Essentials: One phone, one charger (with international adapter), one power bank. Consider leaving the laptop at home if you can.',
      'Packing Techniques: Roll clothes instead of folding. Use packing cubes to organize and compress. Wear your bulkiest items on travel days.',
      'The Test: If you can\'t carry your bag comfortably for 15 minutes, you\'ve packed too much. Your back will thank you.',
    ],
    image: 'https://images.unsplash.com/photo-1553531384-411a247ccd73?w=1200&h=600&fit=crop&q=85',
    category: 'Travel Tips',
    date: 'December 20, 2025',
    readTime: '7 min read',
    author: {
      name: 'Qaram Kassem',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      role: 'Founder & Travel Expert',
    },
  },
  post6: {
    id: 'post6',
    title: 'Cultural Etiquette Around the World',
    excerpt: 'Essential customs and traditions every traveler should know.',
    content: [
      'Understanding local customs can make the difference between a good trip and a great one. Here are essential etiquette tips for popular destinations.',
      'Japan: Bow when greeting. Remove shoes before entering homes and many restaurants. Never tip – it can be considered rude. Queue orderly and speak quietly in public.',
      'Middle East: Dress modestly, especially when visiting religious sites. Accept hospitality graciously – refusing tea can be offensive. Use your right hand for eating and greetings.',
      'India: The head is sacred; never touch someone\'s head. Remove shoes before entering temples. Avoid public displays of affection. Namaste is the traditional greeting.',
      'Mediterranean Europe: Long lunches and late dinners are the norm. Personal space is closer than in Northern countries. Dress up more for restaurants and cultural sites.',
      'Latin America: Greetings often include a kiss on the cheek. Be patient – time is more flexible. Learn a few words of Spanish or Portuguese; locals appreciate the effort.',
      'Southeast Asia: Remove shoes before entering temples and homes. Dress modestly at religious sites. The head is the highest point of the body spiritually; feet are the lowest.',
      'General Tips: Always research before you go. When in doubt, observe locals. A genuine smile and respectful attitude go a long way anywhere in the world.',
    ],
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&h=600&fit=crop&q=85',
    category: 'Culture',
    date: 'December 15, 2025',
    readTime: '9 min read',
    author: {
      name: 'Qaram Kassem',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      role: 'Founder & Travel Expert',
    },
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts[slug];
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = useCallback((imageId: string) => {
    setFailedImages((prev) => new Set(prev).add(imageId));
  }, []);

  if (!post) {
    return (
      <>
        <Navbar navigation={siteData.navigation} siteName={siteData.siteName} />
        <div className={styles.notFound}>
          <h1>Post Not Found</h1>
          <p>The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog" className={styles.backButton}>
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>
        <Footer content={siteData.footer} siteName={siteData.siteName} />
      </>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <Navbar navigation={siteData.navigation} siteName={siteData.siteName} />
      <article className={styles.article}>
        <div className={styles.hero}>
          <Image
            src={failedImages.has(`hero-${post.id}`) ? FALLBACK_IMAGE : post.image}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
            onError={() => handleImageError(`hero-${post.id}`)}
          />
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <Link href="/blog" className={styles.backLink}>
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
            <div className={styles.meta}>
              <span className={styles.category}>
                <Tag size={14} />
                {post.category}
              </span>
              <span className={styles.date}>
                <Calendar size={14} />
                {post.date}
              </span>
              <span className={styles.readTime}>
                <Clock size={14} />
                {post.readTime}
              </span>
            </div>
            <h1>{post.title}</h1>
            <p className={styles.excerpt}>{post.excerpt}</p>
          </div>
        </div>

        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <div className={styles.authorCard}>
              <Image
                src={failedImages.has(`avatar-${post.id}`) ? FALLBACK_AVATAR : post.author.avatar}
                alt={post.author.name}
                width={64}
                height={64}
                className={styles.authorAvatar}
                onError={() => handleImageError(`avatar-${post.id}`)}
              />
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>{post.author.name}</span>
                <span className={styles.authorRole}>{post.author.role}</span>
              </div>
            </div>

            <div className={styles.shareCard}>
              <h3>Share this article</h3>
              <div className={styles.shareButtons}>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.shareButton}
                  aria-label="Share on Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.shareButton}
                  aria-label="Share on Twitter"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.shareButton}
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </aside>

          <div className={styles.content}>
            {post.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className={styles.relatedSection}>
          <div className={styles.relatedContainer}>
            <h2>Related Articles</h2>
            <div className={styles.relatedGrid}>
              {Object.values(blogPosts)
                .filter((p) => p.id !== post.id && p.category === post.category)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.id}`}
                    className={styles.relatedCard}
                  >
                    <div className={styles.relatedImage}>
                      <Image
                        src={failedImages.has(`related-${relatedPost.id}`) ? FALLBACK_IMAGE : relatedPost.image}
                        alt={relatedPost.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onError={() => handleImageError(`related-${relatedPost.id}`)}
                      />
                    </div>
                    <div className={styles.relatedContent}>
                      <span className={styles.relatedCategory}>{relatedPost.category}</span>
                      <h3>{relatedPost.title}</h3>
                      <span className={styles.relatedDate}>{relatedPost.date}</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </article>
      <Footer content={siteData.footer} siteName={siteData.siteName} />
    </>
  );
}
