'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Quote, ChevronDown, ChevronUp, MapPin, Calendar, Camera } from 'lucide-react';
import { Testimonial } from '@/types';
import styles from './about.module.scss';

interface ExpandableReviewsProps {
  testimonials: Testimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.reviewStars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= rating ? styles.starFilled : styles.starEmpty}
          fill={star <= rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

interface ReviewCardProps {
  review: Testimonial;
  isExpanded: boolean;
  onToggle: () => void;
}

function ReviewCard({ review, isExpanded, onToggle }: ReviewCardProps) {
  // Truncate content for preview
  const maxPreviewLength = 120;
  const isLongContent = review.content.length > maxPreviewLength;
  const previewContent = isLongContent
    ? review.content.slice(0, maxPreviewLength) + '...'
    : review.content;

  return (
    <article className={`${styles.expandableReviewCard} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.reviewCardHeader}>
        <div className={styles.reviewAvatar}>
          {review.author.avatar ? (
            <Image
              src={review.author.avatar}
              alt={review.author.name}
              width={56}
              height={56}
            />
          ) : (
            <span>{review.author.name.charAt(0)}</span>
          )}
        </div>
        <div className={styles.reviewAuthorInfo}>
          <h4>{review.author.name}</h4>
          {review.author.location && (
            <p className={styles.authorLocation}>
              <MapPin size={12} />
              {review.author.location}
            </p>
          )}
        </div>
        <div className={styles.reviewMeta}>
          <StarRating rating={review.rating} />
          {review.source && (
            <span className={styles.reviewSource}>{review.source}</span>
          )}
        </div>
      </div>

      <div className={styles.reviewCardContent}>
        <Quote size={24} className={styles.quoteIcon} />
        <p className={styles.reviewText}>
          {isExpanded ? review.content : previewContent}
        </p>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={styles.expandedContent}>
          {/* Travel Photos */}
          {review.travelPhoto && (
            <div className={styles.travelPhotoSection}>
              <h5 className={styles.photoLabel}>
                <Camera size={16} />
                Travel Photo
              </h5>
              <div className={styles.travelPhotoWrapper}>
                <Image
                  src={review.travelPhoto}
                  alt="Travel experience"
                  width={400}
                  height={300}
                  className={styles.travelPhoto}
                />
              </div>
            </div>
          )}

          {/* Trip Date */}
          {review.date && (
            <div className={styles.tripDetails}>
              <span className={styles.tripDate}>
                <Calendar size={14} />
                {review.date}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Expand/Collapse Button */}
      {(isLongContent || review.travelPhoto) && (
        <button
          className={styles.expandButton}
          onClick={onToggle}
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp size={16} />
            </>
          ) : (
            <>
              {review.travelPhoto ? 'See Photo & More' : 'Read More'} <ChevronDown size={16} />
            </>
          )}
        </button>
      )}

      {review.date && !isExpanded && (
        <p className={styles.reviewDate}>{review.date}</p>
      )}
    </article>
  );
}

export default function ExpandableReviews({ testimonials }: ExpandableReviewsProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleReview = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (testimonials.length === 0) return null;

  return (
    <section className={styles.reviewsSection} id="reviews">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Testimonials</span>
          <h2>What Our Travelers Say</h2>
          <p>
            Real stories from real travelers. Click to see their travel photos and full reviews.
          </p>
        </div>

        <div className={styles.reviewsGrid}>
          {testimonials.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isExpanded={expandedIds.has(review.id)}
              onToggle={() => toggleReview(review.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
