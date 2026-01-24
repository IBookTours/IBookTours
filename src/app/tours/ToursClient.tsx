'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  X,
  ChevronDown,
  Grid,
  List,
} from 'lucide-react';
import DestinationCard from '@/components/DestinationCard';
import { Destination } from '@/types';
import styles from './tours.module.scss';

interface ToursClientProps {
  destinations: Destination[];
}

const priceRanges = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'budget', label: 'Under $1,000', min: 0, max: 1000 },
  { id: 'mid', label: '$1,000 - $1,500', min: 1000, max: 1500 },
  { id: 'premium', label: '$1,500 - $2,000', min: 1500, max: 2000 },
  { id: 'luxury', label: 'Over $2,000', min: 2000, max: Infinity },
];

const regions = [
  { id: 'all', label: 'All Destinations' },
  { id: 'asia', label: 'Asia' },
  { id: 'europe', label: 'Europe' },
  { id: 'oceania', label: 'Oceania' },
  { id: 'americas', label: 'Americas' },
];

const durations = [
  { id: 'all', label: 'Any Duration' },
  { id: 'short', label: '1-4 Days' },
  { id: 'medium', label: '5-7 Days' },
  { id: 'long', label: '8+ Days' },
];

export default function ToursClient({ destinations }: ToursClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Sync search query with URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    if (urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Update URL when search changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) {
        params.set('search', searchQuery);
      } else {
        params.delete('search');
      }
      const newUrl = params.toString() ? `?${params.toString()}` : '/tours';
      router.replace(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter destinations based on search and filters
  const filteredDestinations = destinations.filter((dest) => {
    // Search filter
    if (
      searchQuery &&
      !dest.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !dest.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Price filter
    if (selectedPrice !== 'all') {
      const range = priceRanges.find((r) => r.id === selectedPrice);
      if (range) {
        const price = parseInt(dest.price?.replace(/[^0-9]/g, '') || '0');
        if (price < range.min || price > range.max) {
          return false;
        }
      }
    }

    return true;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPrice('all');
    setSelectedRegion('all');
    setSelectedDuration('all');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedPrice !== 'all' ||
    selectedRegion !== 'all' ||
    selectedDuration !== 'all';

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <Image
          src="https://picsum.photos/seed/tours-hero/1920/600"
          alt="Explore our tours"
          fill
          priority
          quality={90}
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1>Explore Our Tours</h1>
          <p>Discover handpicked adventures designed for unforgettable experiences</p>

          {/* Search Bar */}
          <div className={styles.searchBar}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search destinations, tours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className={styles.filterToggle}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal />
              Filters
            </button>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* Filter Bar */}
        <div className={`${styles.filterBar} ${showFilters ? styles.open : ''}`}>
          <div className={styles.filterGroup}>
            <label>
              <MapPin />
              Destination
            </label>
            <div className={styles.selectWrapper}>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.label}
                  </option>
                ))}
              </select>
              <ChevronDown />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Price Range</label>
            <div className={styles.selectWrapper}>
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
              >
                {priceRanges.map((range) => (
                  <option key={range.id} value={range.id}>
                    {range.label}
                  </option>
                ))}
              </select>
              <ChevronDown />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Duration</label>
            <div className={styles.selectWrapper}>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
              >
                {durations.map((dur) => (
                  <option key={dur.id} value={dur.id}>
                    {dur.label}
                  </option>
                ))}
              </select>
              <ChevronDown />
            </div>
          </div>

          {hasActiveFilters && (
            <button className={styles.clearFilters} onClick={clearFilters}>
              <X />
              Clear All
            </button>
          )}
        </div>

        {/* Results Header */}
        <div className={styles.resultsHeader}>
          <p className={styles.resultCount}>
            <strong>{filteredDestinations.length}</strong> tours found
          </p>
          <div className={styles.viewToggle}>
            <button
              className={viewMode === 'grid' ? styles.active : ''}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <Grid />
            </button>
            <button
              className={viewMode === 'list' ? styles.active : ''}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List />
            </button>
          </div>
        </div>

        {/* Results Grid */}
        {filteredDestinations.length > 0 ? (
          <div
            className={`${styles.grid} ${
              viewMode === 'list' ? styles.listView : ''
            }`}
          >
            {filteredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                variant={viewMode === 'list' ? 'horizontal' : 'default'}
                showCta
              />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <MapPin />
            <h3>No tours found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button onClick={clearFilters}>Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
