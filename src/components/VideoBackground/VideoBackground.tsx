'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Play, Pause } from 'lucide-react';
import { TIMING, ANIMATION } from '@/lib/constants';
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
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(true);

  // Timeout fallback - if video doesn't load in time, show image
  useEffect(() => {
    if (isLoaded || hasError) return;

    const timeout = setTimeout(() => {
      if (!isLoaded) {
        setTimedOut(true);
      }
    }, TIMING.VIDEO_LOAD_TIMEOUT);

    return () => clearTimeout(timeout);
  }, [isLoaded, hasError]);

  // Toggle pause/play
  const togglePause = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  }, []);

  // Pause video when out of view for performance
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting && !isPaused) {
          video.play().catch(() => {
            // Autoplay might be blocked, show fallback
            setHasError(true);
          });
        } else {
          video.pause();
        }
      },
      { threshold: ANIMATION.THRESHOLD_LIGHT }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [isPaused]);

  // iOS requires user gesture before video can autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleUserGesture = () => {
      if (video.paused && !isPaused) {
        video.play().catch((err) => {
          console.warn('Video autoplay failed:', err);
        });
      }
    };

    // Add listeners for first interaction
    document.addEventListener('touchstart', handleUserGesture, { once: true });
    document.addEventListener('click', handleUserGesture, { once: true });

    return () => {
      document.removeEventListener('touchstart', handleUserGesture);
      document.removeEventListener('click', handleUserGesture);
    };
  }, [isPaused]);

  // Pause video when tab is not visible (battery optimization)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!videoRef.current) return;

      if (document.hidden) {
        videoRef.current.pause();
      } else if (!isPaused) {
        videoRef.current.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPaused]);

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
          preload="auto"
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

      {/* Pause/Play button - only show when video is in view */}
      {!hasError && isLoaded && isInView && (
        <button
          className={styles.pauseButton}
          onClick={togglePause}
          aria-label={isPaused ? 'Play video' : 'Pause video'}
          type="button"
        >
          {isPaused ? <Play size={12} /> : <Pause size={12} />}
        </button>
      )}
    </div>
  );
}
