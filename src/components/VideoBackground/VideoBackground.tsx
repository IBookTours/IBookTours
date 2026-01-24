'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './VideoBackground.module.scss';

interface VideoBackgroundProps {
  video: {
    mp4: string;
    webm?: string;
    poster: string;
  };
  fallbackImage: string;
  className?: string;
}

export default function VideoBackground({
  video,
  fallbackImage,
  className = '',
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Timeout fallback - if video doesn't load in 5 seconds, show image
  useEffect(() => {
    if (isLoaded || hasError) return;

    const timeout = setTimeout(() => {
      if (!isLoaded) {
        setTimedOut(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isLoaded, hasError]);

  // Pause video when out of view for performance
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Autoplay might be blocked, show fallback
            setHasError(true);
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleVideoLoaded = () => {
    setIsLoaded(true);
    setTimedOut(false);
  };

  const handleVideoError = () => {
    setHasError(true);
  };

  // Show fallback if error, timeout, or not loaded yet
  const showFallback = hasError || timedOut || !isLoaded;

  return (
    <div ref={containerRef} className={`${styles.videoBackground} ${className}`}>
      {/* Poster/Fallback Image - always rendered for loading state */}
      <div className={`${styles.fallback} ${!showFallback ? styles.hidden : ''}`}>
        <Image
          src={hasError ? fallbackImage : video.poster}
          alt="Background"
          fill
          priority
          quality={85}
          sizes="100vw"
        />
      </div>

      {/* Video - show unless there's an error */}
      {!hasError && (
        <video
          ref={videoRef}
          className={`${styles.video} ${isLoaded ? styles.visible : ''}`}
          autoPlay
          muted
          loop
          playsInline
          poster={video.poster}
          onLoadedData={handleVideoLoaded}
          onError={handleVideoError}
        >
          {video.webm && <source src={video.webm} type="video/webm" />}
          <source src={video.mp4} type="video/mp4" />
        </video>
      )}

      {/* Gradient overlay */}
      <div className={styles.overlay} />
    </div>
  );
}
