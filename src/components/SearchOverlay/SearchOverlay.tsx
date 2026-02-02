'use client';

import { useState, useEffect, useRef, FormEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { X, Search, MapPin, Calendar, DollarSign, Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from './SearchOverlay.module.scss';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type Category = 'all' | 'tours' | 'packages' | 'hotels' | 'cars' | 'maps';

const CATEGORIES: { id: Category; icon: string }[] = [
  { id: 'all', icon: '🌍' },
  { id: 'tours', icon: '🎒' },
  { id: 'packages', icon: '✈️' },
  { id: 'hotels', icon: '🏨' },
  { id: 'cars', icon: '🚗' },
  { id: 'maps', icon: '🗺️' },
];

const PRICE_RANGES = [
  { id: 'any', min: 0, max: Infinity },
  { id: 'budget', min: 0, max: 100 },
  { id: 'mid', min: 100, max: 500 },
  { id: 'premium', min: 500, max: 1000 },
  { id: 'luxury', min: 1000, max: Infinity },
];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const t = useTranslations('search');
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [priceRange, setPriceRange] = useState('any');
  const [showFilters, setShowFilters] = useState(false);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow animation
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }, [onClose]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    // Build search URL with filters
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }

    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }

    if (dateRange.from) {
      params.set('from', dateRange.from);
    }

    if (dateRange.to) {
      params.set('to', dateRange.to);
    }

    if (priceRange !== 'any') {
      params.set('price', priceRange);
    }

    // Navigate based on category
    let basePath = '/tours';
    if (selectedCategory === 'hotels') basePath = '/hotels';
    if (selectedCategory === 'cars') basePath = '/car-rental';
    if (selectedCategory === 'maps') basePath = '/interactive-maps';
    if (selectedCategory === 'packages') basePath = '/tours?type=package';

    const queryString = params.toString();
    router.push(queryString ? `${basePath}?${queryString}` : basePath);
    onClose();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setDateRange({ from: '', to: '' });
    setPriceRange('any');
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{t('title')}</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close search"
          >
            <X />
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
          {/* Main Search Input */}
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchIcon} />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('placeholder')}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearInput}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className={styles.categories}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`${styles.categoryPill} ${selectedCategory === cat.id ? styles.active : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className={styles.categoryIcon}>{cat.icon}</span>
                <span>{t(`categories.${cat.id}`)}</span>
              </button>
            ))}
          </div>

          {/* Toggle Filters */}
          <button
            type="button"
            className={styles.filterToggle}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter />
            <span>{showFilters ? t('hideFilters') : t('showFilters')}</span>
          </button>

          {/* Expanded Filters */}
          {showFilters && (
            <div className={styles.filters}>
              {/* Date Range */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <Calendar />
                  <span>{t('dateRange')}</span>
                </label>
                <div className={styles.dateInputs}>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    className={styles.dateInput}
                  />
                  <span className={styles.dateSeparator}>→</span>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    className={styles.dateInput}
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <DollarSign />
                  <span>{t('priceRange')}</span>
                </label>
                <div className={styles.priceOptions}>
                  {PRICE_RANGES.map((range) => (
                    <button
                      key={range.id}
                      type="button"
                      className={`${styles.priceOption} ${priceRange === range.id ? styles.active : ''}`}
                      onClick={() => setPriceRange(range.id)}
                    >
                      {t(`prices.${range.id}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                type="button"
                className={styles.clearFilters}
                onClick={clearFilters}
              >
                {t('clearFilters')}
              </button>
            </div>
          )}

          {/* Search Button */}
          <button type="submit" className={styles.searchBtn}>
            <Search />
            <span>{t('searchButton')}</span>
          </button>
        </form>

        {/* Quick Links */}
        <div className={styles.quickLinks}>
          <span className={styles.quickLinksLabel}>{t('popular')}</span>
          <div className={styles.quickLinksList}>
            {['Saranda', 'Tirana', 'Berat', 'Ksamil', 'Albanian Alps'].map((place) => (
              <button
                key={place}
                type="button"
                className={styles.quickLink}
                onClick={() => {
                  setSearchQuery(place);
                  inputRef.current?.focus();
                }}
              >
                <MapPin />
                <span>{place}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
