'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { BlogContent, BlogPost } from '@/types';
import { useInView, useIsMobile, useSwipe } from '@/hooks';
import styles from './BlogSection.module.scss';

const FALLBACK_IMAGE = '/media/hero-fallback.jpg';

interface BlogSectionProps {
  content: BlogContent;
}

export default function BlogSection({ content }: BlogSectionProps) {
  const t = useTranslations('blog');
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: 0.15,
    triggerOnce: true,
  });

  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = useCallback((postId: string) => {
    setFailedImages((prev) => new Set(prev).add(postId));
  }, []);

  const featuredPost = content.posts.find((p) => p.featured) || content.posts[0];
  const otherPosts = content.posts.filter((p) => p.id !== featuredPost.id);
  const allPosts = [featuredPost, ...otherPosts];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allPosts.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === allPosts.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Swipe handlers for mobile
  const swipeHandlers = useSwipe(goToNext, goToPrevious);

  // Render a blog card (reusable) - entire card is now clickable
  const renderBlogCard = (post: BlogPost, isFeatured: boolean, index?: number, showAnimation = true) => (
    <Link
      key={post.id}
      href={`/blog/${post.id}`}
      className={`${styles.blogCard} ${styles.blogCardLink} ${isFeatured ? styles.featuredPost : ''} ${!showAnimation || isInView ? styles.visible : ''}`}
      style={showAnimation && index !== undefined ? { transitionDelay: `${0.2 + index * 0.15}s` } : undefined}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={failedImages.has(post.id) ? FALLBACK_IMAGE : post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => handleImageError(post.id)}
        />
        {isFeatured && post.stats && (
          <div className={styles.statsBadge}>
            <span className={styles.value}>{post.stats.value}</span>
            <span className={styles.label}>{post.stats.label}</span>
          </div>
        )}
        {!isFeatured && <span className={styles.category}>{post.category}</span>}
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.postTitle}>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.meta}>
          <span className={styles.date}>
            <Calendar />
            {post.date}
          </span>
          {post.readTime && (
            <span className={styles.readTime}>
              <Clock />
              {post.readTime}
            </span>
          )}
        </div>
        {isFeatured && (
          <span className={styles.readMore}>
            {t('readMore')}
            <ArrowRight />
          </span>
        )}
      </div>
    </Link>
  );

  return (
    <section ref={sectionRef} className={styles.section} id="blog">
      <div className={styles.container}>
        <div className={`${styles.header} ${isInView ? styles.visible : ''}`}>
          <h2 className={styles.title}>{t('title')}</h2>
          <Link href="/blog" className={styles.viewAll}>
            {t('viewAll')}
            <ArrowRight />
          </Link>
        </div>

        {/* Mobile: Carousel layout */}
        {isMobile && (
          <div className={`${styles.carouselContainer} ${isInView ? styles.visible : ''}`}>
            <div className={styles.carouselTrack} {...swipeHandlers}>
              {renderBlogCard(allPosts[currentIndex], currentIndex === 0, undefined, false)}
            </div>

            {/* Navigation arrows */}
            <button
              className={`${styles.carouselArrow} ${styles.prevArrow}`}
              onClick={goToPrevious}
              aria-label="Previous post"
            >
              <ChevronLeft />
            </button>
            <button
              className={`${styles.carouselArrow} ${styles.nextArrow}`}
              onClick={goToNext}
              aria-label="Next post"
            >
              <ChevronRight />
            </button>

            {/* Dot indicators */}
            <div className={styles.carouselDots}>
              {allPosts.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to post ${index + 1}`}
                  aria-current={index === currentIndex ? 'true' : 'false'}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tablet/Desktop: Grid layout */}
        {!isMobile && (
          <div className={styles.grid}>
            {/* Featured Post */}
            {renderBlogCard(featuredPost, true)}

            {/* Other Posts */}
            {otherPosts.map((post, index) => renderBlogCard(post, false, index))}
          </div>
        )}
      </div>
    </section>
  );
}
