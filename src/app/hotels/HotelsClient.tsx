'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react';
import { HotelCard } from '@/components/Hotels';
import { hotels, getHotelCities } from '@/data/hotelsData';
import { HotelCategory, HOTEL_CATEGORIES } from '@/types/hotel';
import styles from './hotels.module.scss';

const categoryIds: Array<HotelCategory | 'all'> = ['all', 'boutique', 'resort', 'guesthouse', 'luxury', 'budget'];

export default function HotelsClient() {
  const t = useTranslations('hotels');
  const searchParams = useSearchParams();

  // Get initial values from URL
  const initialCategory = (searchParams.get('category') as HotelCategory | 'all') || 'all';
  const initialCity = searchParams.get('city') || 'all';
  const initialSearch = searchParams.get('search') || '';

  // Local state
  const [activeCategory, setActiveCategory] = useState<HotelCategory | 'all'>(initialCategory);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);

  const cities = useMemo(() => ['all', ...getHotelCities()], []);

  // Filter hotels
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      // Category filter
      if (activeCategory !== 'all' && hotel.category !== activeCategory) {
        return false;
      }

      // City filter
      if (selectedCity !== 'all' && hotel.city !== selectedCity) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableText = `${hotel.name} ${hotel.location} ${hotel.city} ${hotel.description}`.toLowerCase();
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [activeCategory, selectedCity, searchQuery]);

  const clearFilters = () => {
    setActiveCategory('all');
    setSelectedCity('all');
    setSearchQuery('');
  };

  const hasActiveFilters = activeCategory !== 'all' || selectedCity !== 'all' || searchQuery !== '';

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t('pageTitle')}</h1>
          <p className={styles.heroSubtitle}>{t('pageSubtitle')}</p>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.container}>
        {/* Search and Filter Bar */}
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={styles.clearSearch}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="button"
            className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} />
            <span>{t('filters')}</span>
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className={styles.filtersPanel}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>{t('filterByCity')}</label>
              <div className={styles.filterOptions}>
                {cities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    className={`${styles.filterChip} ${selectedCity === city ? styles.active : ''}`}
                    onClick={() => setSelectedCity(city)}
                  >
                    <MapPin size={14} />
                    {city === 'all' ? t('allCities') : city}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button type="button" className={styles.clearFilters} onClick={clearFilters}>
                {t('clearFilters')}
              </button>
            )}
          </div>
        )}

        {/* Category Tabs */}
        <div className={styles.categoryTabs}>
          {categoryIds.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`${styles.categoryTab} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {t(`categories.${cat}`)}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className={styles.resultsInfo}>
          <span>
            {filteredHotels.length} {filteredHotels.length === 1 ? t('hotelFound') : t('hotelsFound')}
          </span>
        </div>

        {/* Hotels Grid */}
        {filteredHotels.length > 0 ? (
          <div className={styles.grid}>
            {filteredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <p>{t('noResults')}</p>
            <button type="button" onClick={clearFilters} className={styles.resetBtn}>
              {t('resetFilters')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
