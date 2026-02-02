'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MapPin, Star, ChevronRight, Hotel, Compass } from 'lucide-react';
import { useInView } from '@/hooks';
import { ANIMATION } from '@/lib/constants';
import { regions, type MapRegion } from './mapData';
import styles from './AlbaniaMap.module.scss';

export default function AlbaniaMap() {
  const t = useTranslations();
  const [selectedRegion, setSelectedRegion] = useState<MapRegion | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: ANIMATION.THRESHOLD_LIGHT,
    triggerOnce: true,
  });

  const handleRegionClick = useCallback((region: MapRegion) => {
    setSelectedRegion(region);
  }, []);

  const handleRegionHover = useCallback((regionId: string | null) => {
    setHoveredRegion(regionId);
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={`${styles.header} ${isInView ? styles.visible : ''}`}>
          <span className={styles.badge}>
            <Compass size={16} />
            {t('map.sectionLabel')}
          </span>
          <h2 className={styles.title}>{t('map.title')}</h2>
          <p className={styles.subtitle}>{t('map.subtitle')}</p>
        </div>

        {/* Map and Info Panel */}
        <div className={`${styles.content} ${isInView ? styles.visible : ''}`}>
          {/* Interactive Map */}
          <div className={styles.mapContainer}>
            <div className={styles.mapWrapper}>
              {/* Decorative sea background */}
              <div className={styles.seaBackground}>
                <svg viewBox="0 0 100 100" className={styles.waveSvg}>
                  <defs>
                    <pattern id="waves" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
                      <path
                        d="M 0 5 Q 5 0, 10 5 T 20 5"
                        fill="none"
                        stroke="var(--color-primary-200)"
                        strokeWidth="0.5"
                        opacity="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect x="0" y="0" width="40" height="100" fill="url(#waves)" />
                </svg>
              </div>

              {/* Albania illustrated outline */}
              <svg viewBox="0 0 100 100" className={styles.mapSvg}>
                {/* Country shape */}
                <path
                  d="M 45 5 C 55 3, 65 8, 68 15 L 70 25 C 72 35, 70 45, 68 55 L 65 70 C 60 80, 55 88, 45 95 C 35 98, 28 95, 22 88 L 18 75 C 15 65, 18 55, 20 45 L 25 30 C 28 20, 35 10, 45 5 Z"
                  className={styles.countryOutline}
                />

                {/* Mountain decoration */}
                <g className={styles.mountains}>
                  <path d="M 38 12 L 44 5 L 50 12" fill="none" stroke="var(--text-tertiary)" strokeWidth="1" />
                  <path d="M 46 14 L 52 6 L 58 14" fill="none" stroke="var(--text-tertiary)" strokeWidth="1" />
                  <path d="M 54 12 L 60 4 L 66 12" fill="none" stroke="var(--text-tertiary)" strokeWidth="1" />
                </g>
              </svg>

              {/* Region markers */}
              {regions.map((region) => (
                <button
                  key={region.id}
                  className={`${styles.regionMarker} ${
                    selectedRegion?.id === region.id ? styles.selected : ''
                  } ${hoveredRegion === region.id ? styles.hovered : ''}`}
                  style={{
                    left: `${region.position.x}%`,
                    top: `${region.position.y}%`,
                  }}
                  onClick={() => handleRegionClick(region)}
                  onMouseEnter={() => handleRegionHover(region.id)}
                  onMouseLeave={() => handleRegionHover(null)}
                  aria-label={region.name}
                >
                  <span className={styles.markerIcon}>{region.icon}</span>
                  <span className={styles.markerLabel}>{region.name}</span>
                  <span className={styles.markerPulse} />
                </button>
              ))}

              {/* Compass rose decoration */}
              <div className={styles.compass}>
                <svg viewBox="0 0 50 50" width="40" height="40">
                  <circle cx="25" cy="25" r="20" fill="none" stroke="var(--border-medium)" strokeWidth="1" />
                  <path d="M 25 8 L 27 22 L 25 20 L 23 22 Z" fill="var(--color-primary-500)" />
                  <path d="M 25 42 L 23 28 L 25 30 L 27 28 Z" fill="var(--text-tertiary)" />
                  <path d="M 8 25 L 22 23 L 20 25 L 22 27 Z" fill="var(--text-tertiary)" />
                  <path d="M 42 25 L 28 27 L 30 25 L 28 23 Z" fill="var(--text-tertiary)" />
                  <text x="25" y="5" fontSize="5" textAnchor="middle" fill="var(--text-secondary)">N</text>
                </svg>
              </div>

              {/* Map title decoration */}
              <div className={styles.mapTitle}>
                <span>ALBANIA</span>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className={styles.infoPanel}>
            {selectedRegion ? (
              <div className={styles.regionInfo}>
                <div className={styles.regionImage}>
                  <Image
                    src={selectedRegion.image}
                    alt={selectedRegion.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className={styles.regionBadge}>
                    <MapPin size={14} />
                    {selectedRegion.name}
                  </div>
                </div>

                <div className={styles.regionContent}>
                  <div className={styles.regionHeader}>
                    <span className={styles.regionIcon}>{selectedRegion.icon}</span>
                    <h3 className={styles.regionName}>{selectedRegion.name}</h3>
                  </div>

                  <div className={styles.regionRating}>
                    <Star size={16} fill="currentColor" />
                    <span>{selectedRegion.stats.rating}</span>
                    <span className={styles.reviewCount}>
                      ({selectedRegion.stats.reviews.toLocaleString()} {t('map.reviews')})
                    </span>
                  </div>

                  <div className={styles.regionStats}>
                    <div className={styles.stat}>
                      <Compass size={16} />
                      <span>{selectedRegion.stats.tours} {t('map.tours')}</span>
                    </div>
                    <div className={styles.stat}>
                      <Hotel size={16} />
                      <span>{selectedRegion.stats.hotels} {t('map.hotels')}</span>
                    </div>
                  </div>

                  <div className={styles.regionActions}>
                    <Link
                      href={`/tours?destination=${selectedRegion.slug}`}
                      className={styles.primaryBtn}
                    >
                      {t('map.viewTours')}
                      <ChevronRight size={18} />
                    </Link>
                    {selectedRegion.stats.hotels > 0 && (
                      <Link
                        href={`/hotels?location=${selectedRegion.slug}`}
                        className={styles.secondaryBtn}
                      >
                        {t('map.viewHotels')}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.placeholder}>
                <div className={styles.placeholderIcon}>
                  <MapPin size={48} />
                </div>
                <h3>{t('map.selectRegion')}</h3>
                <p>{t('map.selectDescription')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
