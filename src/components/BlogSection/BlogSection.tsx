'use client';

import Image from 'next/image';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { BlogContent } from '@/types';
import styles from './BlogSection.module.scss';

interface BlogSectionProps {
  content: BlogContent;
}

export default function BlogSection({ content }: BlogSectionProps) {
  const featuredPost = content.posts.find((p) => p.featured) || content.posts[0];
  const otherPosts = content.posts.filter((p) => p.id !== featuredPost.id);

  return (
    <section className={styles.section} id="blog">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{content.sectionTitle}</h2>
          <a href="#" className={styles.viewAll}>
            View All Posts
            <ArrowRight />
          </a>
        </div>

        <div className={styles.grid}>
          {/* Featured Post */}
          <article className={`${styles.blogCard} ${styles.featuredPost}`}>
            <div className={styles.imageWrapper}>
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {featuredPost.stats && (
                <div className={styles.statsBadge}>
                  <span className={styles.value}>{featuredPost.stats.value}</span>
                  <span className={styles.label}>{featuredPost.stats.label}</span>
                </div>
              )}
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.postTitle}>{featuredPost.title}</h3>
              <p className={styles.excerpt}>{featuredPost.excerpt}</p>
              <div className={styles.meta}>
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
              <a href="#" className={styles.readMore}>
                Read More
                <ArrowRight />
              </a>
            </div>
          </article>

          {/* Other Posts */}
          {otherPosts.map((post) => (
            <article key={post.id} className={styles.blogCard}>
              <div className={styles.imageWrapper}>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className={styles.category}>{post.category}</span>
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
