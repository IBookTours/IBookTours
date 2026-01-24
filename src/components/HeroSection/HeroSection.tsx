'use client';

import { useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, ChevronDown } from 'lucide-react';
import { HeroContent } from '@/types';
import VideoBackground from '@/components/VideoBackground';
import styles from './HeroSection.module.scss';

interface HeroSectionProps {
  content: HeroContent;
}

// Albanian destinations as popular tags
const popularTags = ['Saranda', 'Tirana', 'Berat', 'Ksamil', 'Theth'];

export default function HeroSection({ content }: HeroSectionProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tours?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/tours');
    }
  };

  // Fill the input with the tag instead of navigating
  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    inputRef.current?.focus();
  };

  return (
    <section className={styles.hero}>
      {content.backgroundVideo ? (
        <VideoBackground
          video={content.backgroundVideo}
          fallbackImage={content.backgroundImage}
        />
      ) : (
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
      )}

      <span className={styles.overlayText}>{content.overlayText}</span>

      <div className={styles.content}>
        <div className={styles.searchWrapper}>
          <form className={styles.searchBox} onSubmit={handleSearch}>
            <input
              ref={inputRef}
              type="text"
              placeholder={content.searchPlaceholder}
              aria-label="Search destinations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchBtn} aria-label="Search">
              <Search />
            </button>
          </form>
          <div className={styles.popularTags}>
            <span>Popular:</span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={styles.tag}
                onClick={() => handleTagClick(tag)}
              >
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
