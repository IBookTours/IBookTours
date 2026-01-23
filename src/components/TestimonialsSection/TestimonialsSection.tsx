'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { TestimonialsContent } from '@/types';
import styles from './TestimonialsSection.module.scss';

interface TestimonialsSectionProps {
  content: TestimonialsContent;
}

export default function TestimonialsSection({ content }: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className={styles.section}>
      <div className={styles.background}>
        <Image
          src={content.backgroundImage}
          alt="Background"
          fill
          quality={60}
          sizes="100vw"
        />
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>{content.sectionLabel}</span>
          <h2 className={styles.title}>{content.title}</h2>
        </div>

        <div className={styles.testimonials}>
          {content.testimonials.map((testimonial, index) => (
            <article
              key={testimonial.id}
              className={styles.testimonialCard}
              style={{ display: index === activeIndex ? 'block' : 'none' }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  <Image
                    src={testimonial.author.avatar}
                    alt={testimonial.author.name}
                    fill
                    sizes="56px"
                  />
                </div>

                <div className={styles.authorInfo}>
                  <h4 className={styles.authorName}>{testimonial.author.name}</h4>
                  <p className={styles.authorTitle}>
                    {testimonial.author.title}
                    {testimonial.author.location && ` • ${testimonial.author.location}`}
                  </p>
                </div>

                <div className={styles.rating}>
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>
              </div>

              <p className={styles.content}>{testimonial.content}</p>

              {testimonial.date && (
                <span className={styles.date}>{testimonial.date}</span>
              )}
            </article>
          ))}
        </div>

        <div className={styles.dots}>
          {content.testimonials.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === activeIndex ? styles.active : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
