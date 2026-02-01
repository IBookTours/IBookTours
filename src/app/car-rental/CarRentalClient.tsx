'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Search,
  SlidersHorizontal,
  X,
  Grid,
  List,
  Car,
  Users,
  Star,
  ArrowRight,
  Fuel,
  Settings2,
  Briefcase,
  Zap,
} from 'lucide-react';
import Dropdown from '@/components/shared/Dropdown';
import VideoBackground from '@/components/VideoBackground';
import { VehicleCategory } from '@/types/carRental';
import { carRentalVehicles } from '@/data/carRentalData';
import {
  useCarRentalStore,
  filterVehicles,
  formatCarPrice,
} from '@/store/carRentalStore';
import styles from './car-rental.module.scss';

// Hero video configuration - add video files to public/videos/ when available
const HERO_VIDEO = {
  mp4: '/videos/car-rental-hero.mp4',
  webm: '/videos/car-rental-hero.webm',
  poster: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&h=600&fit=crop&q=90',
};
const HERO_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&h=600&fit=crop&q=90';

const categoryIds: Array<VehicleCategory | 'all'> = [
  'all',
  'economy',
  'compact',
  'midsize',
  'suv',
  'luxury',
  'van',
];

const transmissionOptions = ['all', 'automatic', 'manual'] as const;
const seatsOptions = ['all', '4', '5', '7', '9'] as const;

export default function CarRentalClient() {
  const t = useTranslations('carRental');
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterBarRef = useRef<HTMLDivElement>(null);

  // Get initial values from URL
  const initialCategory = (searchParams.get('category') as VehicleCategory | 'all') || 'all';
  const initialSearch = searchParams.get('search') || '';

  // Local state
  const [activeCategory, setActiveCategory] = useState<VehicleCategory | 'all'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedTransmission, setSelectedTransmission] = useState<string>('all');
  const [selectedSeats, setSelectedSeats] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Store access
  const { openBookingModal } = useCarRentalStore();

  // Toggle filters with scroll behavior on mobile
  const handleFilterToggle = useCallback(() => {
    const newShowFilters = !showFilters;
    setShowFilters(newShowFilters);

    if (newShowFilters && filterBarRef.current) {
      setTimeout(() => {
        filterBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showFilters]);

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    let vehicles = carRentalVehicles;

    // Category filter
    if (activeCategory !== 'all') {
      vehicles = vehicles.filter((v) => v.category === activeCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      vehicles = vehicles.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.brand.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query)
      );
    }

    // Transmission filter
    if (selectedTransmission !== 'all') {
      vehicles = vehicles.filter((v) => v.transmission === selectedTransmission);
    }

    // Seats filter
    if (selectedSeats !== 'all') {
      const minSeats = parseInt(selectedSeats, 10);
      vehicles = vehicles.filter((v) => v.seats >= minSeats);
    }

    // Only show available vehicles
    vehicles = vehicles.filter((v) => v.available);

    return vehicles;
  }, [activeCategory, searchQuery, selectedTransmission, selectedSeats]);

  // Get counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: carRentalVehicles.filter((v) => v.available).length };
    categoryIds.slice(1).forEach((cat) => {
      counts[cat] = carRentalVehicles.filter((v) => v.category === cat && v.available).length;
    });
    return counts;
  }, []);

  const handleCategoryChange = (category: VehicleCategory | 'all') => {
    setActiveCategory(category);
    // Update URL
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (searchQuery) params.set('search', searchQuery);
    const newUrl = params.toString() ? `/car-rental?${params.toString()}` : '/car-rental';
    router.replace(newUrl, { scroll: false });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTransmission('all');
    setSelectedSeats('all');
    setActiveCategory('all');
  };

  const hasActiveFilters =
    searchQuery || selectedTransmission !== 'all' || selectedSeats !== 'all' || activeCategory !== 'all';

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'economy':
      case 'compact':
        return <Car size={18} />;
      case 'suv':
        return <Car size={18} />;
      case 'luxury':
        return <Star size={18} />;
      case 'van':
        return <Users size={18} />;
      default:
        return <Car size={18} />;
    }
  };

  const getTransmissionLabel = (transmission: string) => {
    if (transmission === 'all') return t('filters.all');
    return t(transmission);
  };

  const getFuelIcon = (fuelType: string) => {
    if (fuelType === 'electric' || fuelType === 'hybrid') {
      return <Zap size={14} />;
    }
    return <Fuel size={14} />;
  };

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <VideoBackground
          video={HERO_VIDEO}
          fallbackImage={HERO_FALLBACK_IMAGE}
        />
        <div className={styles.heroContent}>
          <h1>{t('title')}</h1>
          <p>{t('subtitle')}</p>

          {/* Search Bar */}
          <div className={styles.searchBar}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder={t('filters.all')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search vehicles"
            />
            <button
              className={`${styles.filterToggle} ${showFilters || hasActiveFilters ? styles.active : ''}`}
              onClick={handleFilterToggle}
              aria-expanded={showFilters}
              aria-controls="filter-bar"
            >
              <SlidersHorizontal />
              {t('filters.all')}
            </button>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* Category Tabs */}
        <div className={styles.tabs} role="tablist" aria-label="Vehicle categories">
          {categoryIds.map((catId) => (
            <button
              key={catId}
              className={`${styles.tab} ${activeCategory === catId ? styles.activeTab : ''}`}
              onClick={() => handleCategoryChange(catId)}
              role="tab"
              aria-selected={activeCategory === catId}
            >
              {getCategoryIcon(catId)}
              <span>{t(`categories.${catId}`)}</span>
              <span className={styles.tabCount}>{categoryCounts[catId]}</span>
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div
          ref={filterBarRef}
          id="filter-bar"
          className={`${styles.filterBar} ${showFilters ? styles.open : ''}`}
          role="group"
          aria-label="Vehicle filters"
        >
          <div className={styles.filterGroup}>
            <label htmlFor="transmission-filter">{t('transmission')}</label>
            <Dropdown
              id="transmission-filter"
              value={selectedTransmission}
              onChange={setSelectedTransmission}
              options={transmissionOptions.map((opt) => ({
                value: opt,
                label: getTransmissionLabel(opt),
              }))}
              variant="compact"
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="seats-filter">{t('seats')}</label>
            <Dropdown
              id="seats-filter"
              value={selectedSeats}
              onChange={setSelectedSeats}
              options={seatsOptions.map((opt) => ({
                value: opt,
                label: opt === 'all' ? t('filters.all') : `${opt}+ ${t('seats')}`,
              }))}
              variant="compact"
            />
          </div>

          {hasActiveFilters && (
            <button className={styles.clearFilters} onClick={clearFilters} aria-label="Clear all filters">
              <X aria-hidden="true" />
              {t('filters.clearAll')}
            </button>
          )}
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className={styles.activeFilters}>
            {searchQuery && (
              <span className={styles.filterChip}>
                &quot;{searchQuery}&quot;
                <button onClick={() => setSearchQuery('')} aria-label="Remove search filter">
                  <X />
                </button>
              </span>
            )}
            {activeCategory !== 'all' && (
              <span className={styles.filterChip}>
                {t(`categories.${activeCategory}`)}
                <button onClick={() => setActiveCategory('all')} aria-label="Remove category filter">
                  <X />
                </button>
              </span>
            )}
            {selectedTransmission !== 'all' && (
              <span className={styles.filterChip}>
                {t(selectedTransmission)}
                <button onClick={() => setSelectedTransmission('all')} aria-label="Remove transmission filter">
                  <X />
                </button>
              </span>
            )}
            {selectedSeats !== 'all' && (
              <span className={styles.filterChip}>
                {selectedSeats}+ {t('seats')}
                <button onClick={() => setSelectedSeats('all')} aria-label="Remove seats filter">
                  <X />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results Header */}
        <div className={styles.resultsHeader}>
          <p className={styles.resultCount}>
            <strong>{filteredVehicles.length}</strong> vehicles found
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

        {/* Vehicle Grid */}
        {filteredVehicles.length > 0 ? (
          <div className={`${styles.grid} ${viewMode === 'list' ? styles.listView : ''}`}>
            {filteredVehicles.map((vehicle) => (
              <article key={vehicle.id} className={styles.vehicleCard}>
                <div className={styles.cardImage}>
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className={styles.cardBadges}>
                    {vehicle.featured && (
                      <span className={`${styles.badge} ${styles.featured}`}>
                        <Star size={10} />
                        {t('featured')}
                      </span>
                    )}
                    {vehicle.discountPercent && (
                      <span className={`${styles.badge} ${styles.discount}`}>
                        -{vehicle.discountPercent}% {t('discount')}
                      </span>
                    )}
                    {vehicle.fuelType === 'electric' && (
                      <span className={`${styles.badge} ${styles.electric}`}>
                        <Zap size={10} />
                        {t('electric')}
                      </span>
                    )}
                  </div>
                  <span className={styles.categoryBadge}>{t(`categories.${vehicle.category}`)}</span>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{vehicle.name}</h3>
                    {vehicle.rating && (
                      <div className={styles.cardRating}>
                        <Star size={14} fill="currentColor" />
                        {vehicle.rating}
                        {vehicle.reviewCount && <span>({vehicle.reviewCount})</span>}
                      </div>
                    )}
                  </div>

                  <div className={styles.cardSpecs}>
                    <span className={styles.spec}>
                      <Users size={14} />
                      {vehicle.seats} {t('seats')}
                    </span>
                    <span className={styles.spec}>
                      <Settings2 size={14} />
                      {t(vehicle.transmission)}
                    </span>
                    <span className={styles.spec}>
                      {getFuelIcon(vehicle.fuelType)}
                      {t(vehicle.fuelType)}
                    </span>
                    <span className={styles.spec}>
                      <Briefcase size={14} />
                      {vehicle.luggage} {t('luggage')}
                    </span>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.price}>
                      {vehicle.originalPrice && (
                        <span className={styles.originalPrice}>
                          {formatCarPrice(vehicle.originalPrice, '€')}
                        </span>
                      )}
                      <div className={styles.currentPrice}>
                        <span className={styles.amount}>
                          {formatCarPrice(vehicle.pricePerDay, '€')}
                        </span>
                        <span className={styles.perDay}>/{t('perDay')}</span>
                      </div>
                    </div>
                    <div className={styles.actions}>
                      <Link href={`/car-rental/${vehicle.id}`} className={styles.viewBtn}>
                        {t('viewDetails')}
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <Car />
            <h3>No vehicles found</h3>
            <p>Try adjusting your filters or search query</p>
            <button onClick={clearFilters}>{t('filters.clearAll')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
