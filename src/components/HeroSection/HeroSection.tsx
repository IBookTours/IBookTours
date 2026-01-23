'use client';

import Image from 'next/image';
import { Search, ChevronDown } from 'lucide-react';
import { HeroContent } from '@/types';
import styles from './HeroSection.module.scss';

interface HeroSectionProps {
  content: HeroContent;
}

const popularTags = ['Japan', 'Bali', 'Maldives', 'Europe'];

export default function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <Image
          src={content.backgroundImage}
          alt="Travel destination"
          fill
          priority
          quality={90}
          sizes="100vw"
        />
      </div>

      <span className={styles.overlayText}>{content.overlayText}</span>

      <div className={styles.content}>
        <div className={styles.searchWrapper}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder={content.searchPlaceholder}
              aria-label="Search destinations"
            />
            <button className={styles.searchBtn} aria-label="Search">
              <Search />
            </button>
          </div>
          <div className={styles.popularTags}>
            <span>Popular:</span>
            {popularTags.map((tag) => (
              <button key={tag} className={styles.tag}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <span>Scroll Down</span>
        <ChevronDown />
      </div>
    </section>
  );
}
