import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { siteData } from '@/data/siteData';
import styles from './blog.module.scss';

export const metadata: Metadata = {
  title: 'Blog | ITravel',
  description: 'Travel tips, destination guides, and inspiration for your next adventure.',
};

const categories = [
  { id: 'all', label: 'All Posts' },
  { id: 'destination', label: 'Destination Guide' },
  { id: 'tips', label: 'Travel Tips' },
  { id: 'technology', label: 'Technology' },
  { id: 'culture', label: 'Culture' },
];

// Extend blog posts for a fuller page
const allPosts = [
  ...siteData.blog.posts,
  {
    id: 'post4',
    title: 'Hidden Gems of the Albanian Riviera',
    excerpt: 'Explore off-the-beaten-path beaches and coastal villages that will take your breath away.',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=400&fit=crop&q=80',
    category: 'Destination Guide',
    date: 'December 28, 2024',
    readTime: '10 min read',
  },
  {
    id: 'post5',
    title: 'Packing Light: The Ultimate Guide',
    excerpt: 'Master the art of minimalist travel with our comprehensive packing guide.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop&q=80',
    category: 'Travel Tips',
    date: 'December 20, 2024',
    readTime: '7 min read',
  },
  {
    id: 'post6',
    title: 'Albanian Culture and Traditions',
    excerpt: 'Essential customs and traditions every traveler to Albania should know.',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop&q=80',
    category: 'Culture',
    date: 'December 15, 2024',
    readTime: '9 min read',
  },
];

export default function BlogPage() {
  const featuredPost = siteData.blog.posts.find((p) => p.featured) || siteData.blog.posts[0];
  const regularPosts = allPosts.filter((p) => p.id !== featuredPost.id);

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Our Blog</span>
          <h1>Travel Stories & Inspiration</h1>
          <p>Expert tips, destination guides, and travel inspiration from around the world.</p>
        </div>
      </section>

      <div className={styles.container}>
        {/* Categories */}
        <div className={styles.categories}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryBtn} ${
                category.id === 'all' ? styles.active : ''
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <article className={styles.featuredPost}>
          <div className={styles.featuredImage}>
            <Image
              src={featuredPost.image}
              alt={featuredPost.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <span className={styles.featuredBadge}>Featured</span>
          </div>
          <div className={styles.featuredContent}>
            <div className={styles.postMeta}>
              <span className={styles.category}>
                <Tag />
                {featuredPost.category}
              </span>
              <span className={styles.date}>
                <Calendar />
                {featuredPost.date}
              </span>
              {featuredPost.readTime && (
                <span className={styles.readTime}>
                  <Clock />
                  {featuredPost.readTime}
                </span>
              )}
            </div>
            <h2>{featuredPost.title}</h2>
            <p>{featuredPost.excerpt}</p>
            {featuredPost.stats && (
              <div className={styles.stats}>
                <span className={styles.statsValue}>{featuredPost.stats.value}</span>
                <span className={styles.statsLabel}>{featuredPost.stats.label}</span>
              </div>
            )}
            <Link href={`/blog/${featuredPost.id}`} className={styles.readMore}>
              Read Article
              <ArrowRight />
            </Link>
          </div>
        </article>

        {/* Post Grid */}
        <div className={styles.postsGrid}>
          {regularPosts.map((post) => (
            <article key={post.id} className={styles.postCard}>
              <div className={styles.postImage}>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className={styles.postContent}>
                <div className={styles.postMeta}>
                  <span className={styles.category}>
                    <Tag />
                    {post.category}
                  </span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className={styles.postFooter}>
                  <div className={styles.postDate}>
                    <Calendar />
                    {post.date}
                  </div>
                  <Link href={`/blog/${post.id}`} className={styles.postLink}>
                    Read
                    <ArrowRight />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Section */}
        <section className={styles.newsletter}>
          <div className={styles.newsletterContent}>
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get the latest travel tips and destination guides delivered to your inbox.</p>
            <form className={styles.newsletterForm}>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
