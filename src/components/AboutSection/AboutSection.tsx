'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Compass, Headphones, Shield, ArrowRight, Star, Quote } from 'lucide-react';
import { AboutContent, Testimonial } from '@/types';
import { useInView } from '@/hooks';
import { ANIMATION } from '@/lib/constants';
import styles from './AboutSection.module.scss';

interface AboutSectionProps {
  content: AboutContent & { testimonials?: Testimonial[] };
}

const iconMap: Record<string, React.ReactNode> = {
  compass: <Compass />,
  headphones: <Headphones />,
  shield: <Shield />,
};

// Render star rating
function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={star <= rating ? styles.starFilled : styles.starEmpty}
          fill={star <= rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

export default function AboutSection({ content }: AboutSectionProps) {
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: ANIMATION.THRESHOLD_STANDARD,
    triggerOnce: true,
  });

  const testimonials = content.testimonials || [];
  const displayedReviews = testimonials.slice(0, 6); // Show up to 6 reviews

  return (
    <section ref={sectionRef} className={styles.section} id="about">
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={`${styles.images} ${isInView ? styles.visible : ''}`}>
            {content.images.map((image, index) => (
              <div key={index} className={styles.imageWrapper}>
                <Image
                  src={image}
                  alt={`About us ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}

            <div className={styles.badge}>
              <span className={styles.value}>{content.statsHighlight.value}</span>
              <span className={styles.label}>{content.statsHighlight.label}</span>
            </div>
          </div>

          <div className={`${styles.content} ${isInView ? styles.visible : ''}`}>
            <span className={styles.sectionLabel}>{content.badge}</span>
            <h2 className={styles.title}>{content.title}</h2>
            <p className={styles.description}>{content.description}</p>

            <div className={styles.features}>
              {content.features.map((feature) => (
                <div key={feature.id} className={styles.feature}>
                  <div className={styles.featureIcon}>
                    {iconMap[feature.icon]}
                  </div>
                  <div className={styles.featureContent}>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/about" className={styles.cta}>
              Learn More
              <ArrowRight />
            </Link>
          </div>
        </div>

        {/* Reviews Section */}
        {displayedReviews.length > 0 && (
          <div className={`${styles.reviewsSection} ${isInView ? styles.visible : ''}`}>
            <div className={styles.reviewsHeader}>
              <h3 className={styles.reviewsTitle}>What Our Travelers Say</h3>
              <p className={styles.reviewsSubtitle}>
                100% of travelers recommend I-Travel Tourism
              </p>
            </div>

            <div className={styles.reviewsGrid}>
              {displayedReviews.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewAvatar}>
                      {review.author.avatar ? (
                        <Image
                          src={review.author.avatar}
                          alt={review.author.name}
                          width={48}
                          height={48}
                        />
                      ) : (
                        <span>{review.author.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className={styles.reviewAuthor}>
                      <h4>{review.author.name}</h4>
                      {review.author.location && (
                        <p className={styles.reviewLocation}>{review.author.location}</p>
                      )}
                    </div>
                    {review.source && (
                      <span className={styles.reviewSource}>{review.source}</span>
                    )}
                  </div>

                  <StarRating rating={review.rating} />

                  <div className={styles.reviewContent}>
                    <Quote size={20} className={styles.quoteIcon} />
                    <p>{review.content}</p>
                  </div>

                  {review.travelPhoto && (
                    <div className={styles.reviewPhoto}>
                      <Image
                        src={review.travelPhoto}
                        alt="Travel photo"
                        width={200}
                        height={150}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  {review.date && (
                    <p className={styles.reviewDate}>{review.date}</p>
                  )}
                </div>
              ))}
            </div>

            {testimonials.length > 6 && (
              <div className={styles.reviewsMore}>
                <Link href="/about#reviews" className={styles.viewAllBtn}>
                  View All Reviews
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
