'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  X,
  ChevronDown,
  Grid,
  List,
  Plane,
  Clock,
  Package,
  Calendar,
  Users,
  Star,
  ArrowRight,
  ShoppingCart,
  Hotel,
} from 'lucide-react';
import DestinationCard from '@/components/DestinationCard';
import { Destination } from '@/types';
import { VacationPackage } from '@/components/VacationPackagesSection/VacationPackagesSection';
import { DayTour } from '@/components/DayToursSection/DayToursSection';
import { useCartStore } from '@/store/cartStore';
import { priceStringToCents } from '@/store/bookingStore';
import styles from './tours.module.scss';

type TabType = 'all' | 'packages' | 'day-tours';

interface ToursClientProps {
  destinations: Destination[];
  vacationPackages: VacationPackage[];
  dayTours: DayTour[];
}

const priceRangeIds = ['all', 'budget', 'mid', 'premium', 'luxury'] as const;
const priceRangeValues: Record<string, { min: number; max: number }> = {
  all: { min: 0, max: Infinity },
  budget: { min: 0, max: 500 },
  mid: { min: 500, max: 1000 },
  premium: { min: 1000, max: 2000 },
  luxury: { min: 2000, max: Infinity },
};

const durationIds = ['all', 'short', 'medium', 'long'] as const;

const tabIds: TabType[] = ['all', 'packages', 'day-tours'];
const tabIcons: Record<TabType, React.ReactNode> = {
  'all': <Package size={18} />,
  'packages': <Plane size={18} />,
  'day-tours': <Clock size={18} />,
};

export default function ToursClient({
  destinations,
  vacationPackages,
  dayTours,
}: ToursClientProps) {
  const t = useTranslations('tours');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCartStore();

  // Get type from URL or default to 'all'
  const initialType = (searchParams.get('type') as TabType) || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [activeTab, setActiveTab] = useState<TabType>(initialType);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sync with URL params
  useEffect(() => {
    const urlType = (searchParams.get('type') as TabType) || 'all';
    const urlSearch = searchParams.get('search') || '';
    if (urlType !== activeTab) setActiveTab(urlType);
    if (urlSearch !== searchQuery) setSearchQuery(urlSearch);
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.set('type', activeTab);
      if (searchQuery) params.set('search', searchQuery);
      const newUrl = params.toString() ? `/tours?${params.toString()}` : '/tours';
      router.replace(newUrl, { scroll: false });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [activeTab, searchQuery, router]);

  // Helper to extract price number from string like "€299" or "From €1,299"
  const extractPrice = (priceStr: string): number => {
    const match = priceStr.replace(/,/g, '').match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Helper to extract duration days from string like "5 Days" or nights number
  const extractDays = (duration: string, nights?: number): number => {
    if (nights) return nights + 1;
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 1;
  };

  // Filter packages based on search, price, and duration
  const filteredPackages = useMemo(() => {
    return vacationPackages.filter((pkg) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          pkg.destination.toLowerCase().includes(query) ||
          pkg.location.toLowerCase().includes(query) ||
          pkg.hotelName.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Price filter
      if (selectedPrice !== 'all') {
        const price = extractPrice(pkg.pricePerPerson);
        const range = priceRangeValues[selectedPrice];
        if (range && (price < range.min || price >= range.max)) return false;
      }

      // Duration filter
      if (selectedDuration !== 'all') {
        const days = extractDays(pkg.duration, pkg.nights);
        if (selectedDuration === 'short' && days > 4) return false;
        if (selectedDuration === 'medium' && (days < 5 || days > 7)) return false;
        if (selectedDuration === 'long' && days < 8) return false;
      }

      return true;
    });
  }, [vacationPackages, searchQuery, selectedPrice, selectedDuration]);

  // Filter day tours based on search, price, and duration
  const filteredDayTours = useMemo(() => {
    return dayTours.filter((tour) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          tour.name.toLowerCase().includes(query) ||
          tour.location.toLowerCase().includes(query) ||
          tour.departsFrom.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Price filter
      if (selectedPrice !== 'all') {
        const price = extractPrice(tour.pricePerPerson);
        const range = priceRangeValues[selectedPrice];
        if (range && (price < range.min || price >= range.max)) return false;
      }

      // Duration filter (day tours are typically 1 day)
      if (selectedDuration !== 'all') {
        const hours = parseInt(tour.duration.match(/(\d+)/)?.[0] || '8', 10);
        const days = hours > 12 ? 2 : 1; // Assume 1 day unless very long
        if (selectedDuration === 'short' && days > 4) return false;
        if (selectedDuration === 'medium' && (days < 5 || days > 7)) return false;
        if (selectedDuration === 'long' && days < 8) return false;
      }

      return true;
    });
  }, [dayTours, searchQuery, selectedPrice, selectedDuration]);

  // Get counts for tabs
  const counts = {
    all: filteredPackages.length + filteredDayTours.length,
    packages: filteredPackages.length,
    'day-tours': filteredDayTours.length,
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPrice('all');
    setSelectedDuration('all');
  };

  const hasActiveFilters = searchQuery || selectedPrice !== 'all' || selectedDuration !== 'all';

  const handleAddPackageToCart = (pkg: VacationPackage) => {
    addItem({
      id: pkg.id,
      type: 'vacation-package',
      name: `${pkg.destination} - ${pkg.hotelName}`,
      image: pkg.image,
      duration: pkg.duration,
      location: pkg.location,
      basePrice: priceStringToCents(pkg.pricePerPerson),
      quantity: 1,
      date: '',
      travelers: { adults: 1, children: 0 },
      childDiscountPercent: 30,
      options: {
        hotelName: pkg.hotelName,
        includesFlights: pkg.includesFlights,
      },
    });
  };

  const handleAddTourToCart = (tour: DayTour) => {
    addItem({
      id: tour.id,
      type: 'day-tour',
      name: tour.name,
      image: tour.image,
      duration: tour.duration,
      location: tour.location,
      basePrice: priceStringToCents(tour.pricePerPerson),
      quantity: 1,
      date: '',
      travelers: { adults: 1, children: 0 },
      childDiscountPercent: 50,
    });
  };

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <Image
          src="https://images.unsplash.com/photo-1580746738099-78d6833b3a85?w=1920&h=600&fit=crop&q=90"
          alt="Albanian landscape - Explore our tours"
          fill
          priority
          quality={90}
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1>{t('title')}</h1>
          <p>{t('subtitle')}</p>

          {/* Search Bar */}
          <div className={styles.searchBar}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={t('search')}
            />
            <button
              className={`${styles.filterToggle} ${showFilters || hasActiveFilters ? styles.active : ''}`}
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-controls="filter-bar"
            >
              <SlidersHorizontal />
              {hasActiveFilters ? t('filtersOn') : t('filtersButton')}
            </button>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* Tabs */}
        <div className={styles.tabs} role="tablist" aria-label="Tour categories">
          {tabIds.map((tabId) => (
            <button
              key={tabId}
              className={`${styles.tab} ${activeTab === tabId ? styles.activeTab : ''}`}
              onClick={() => handleTabChange(tabId)}
              role="tab"
              aria-selected={activeTab === tabId}
              aria-controls={`tabpanel-${tabId}`}
              id={`tab-${tabId}`}
            >
              {tabIcons[tabId]}
              <span>{tabId === 'all' ? t('tabs.all') : tabId === 'packages' ? t('tabs.packages') : t('tabs.dayTours')}</span>
              <span className={styles.tabCount}>{counts[tabId]}</span>
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div
          id="filter-bar"
          className={`${styles.filterBar} ${showFilters ? styles.open : ''}`}
          role="group"
          aria-label="Tour filters"
        >
          <div className={styles.filterGroup}>
            <label htmlFor="price-filter">{t('price')}</label>
            <div className={styles.selectWrapper}>
              <select
                id="price-filter"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                aria-label="Filter by price range"
              >
                {priceRangeIds.map((rangeId) => (
                  <option key={rangeId} value={rangeId}>
                    {t(`priceRanges.${rangeId}`)}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="duration-filter">{t('duration')}</label>
            <div className={styles.selectWrapper}>
              <select
                id="duration-filter"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                aria-label="Filter by duration"
              >
                {durationIds.map((durId) => (
                  <option key={durId} value={durId}>
                    {t(`durations.${durId}`)}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" />
            </div>
          </div>

          {hasActiveFilters && (
            <button className={styles.clearFilters} onClick={clearFilters} aria-label="Clear all filters">
              <X aria-hidden="true" />
              {t('clear')}
            </button>
          )}
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className={styles.activeFilters}>
            {searchQuery && (
              <span className={styles.filterChip}>
                {t('search')}: &quot;{searchQuery}&quot;
                <button onClick={() => setSearchQuery('')} aria-label="Remove search filter">
                  <X />
                </button>
              </span>
            )}
            {selectedPrice !== 'all' && (
              <span className={styles.filterChip}>
                {t(`priceRanges.${selectedPrice}`)}
                <button onClick={() => setSelectedPrice('all')} aria-label="Remove price filter">
                  <X />
                </button>
              </span>
            )}
            {selectedDuration !== 'all' && (
              <span className={styles.filterChip}>
                {t(`durations.${selectedDuration}`)}
                <button onClick={() => setSelectedDuration('all')} aria-label="Remove duration filter">
                  <X />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results Header */}
        <div className={styles.resultsHeader}>
          <p className={styles.resultCount}>
            <strong>{counts[activeTab]}</strong>{' '}
            {activeTab === 'packages' ? t('results.packages') : activeTab === 'day-tours' ? t('results.dayTours') : t('results.items')} {t('results.found')}
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
        {counts[activeTab] > 0 ? (
          <div
            className={`${styles.grid} ${viewMode === 'list' ? styles.listView : ''}`}
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {/* Vacation Packages */}
            {(activeTab === 'all' || activeTab === 'packages') &&
              filteredPackages.map((pkg) => (
                <article key={pkg.id} className={styles.packageCard}>
                  <div className={styles.cardImage}>
                    <Image
                      src={pkg.image}
                      alt={pkg.destination}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className={styles.cardBadges}>
                      {pkg.includesFlights && (
                        <span className={styles.badge}>
                          <Plane size={12} />
                          {t('badges.flights')}
                        </span>
                      )}
                      {pkg.includesHotel && (
                        <span className={styles.badge}>
                          <Hotel size={12} />
                          {t('badges.hotel')}
                        </span>
                      )}
                    </div>
                    <span className={styles.typeBadge}>{t('badges.package')}</span>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardLocation}>
                      <MapPin size={12} />
                      {pkg.location}
                    </div>
                    <h3 className={styles.cardTitle}>{pkg.destination}</h3>
                    <p className={styles.cardHotel}>
                      <Hotel size={14} />
                      {pkg.hotelName}
                      <span className={styles.stars}>
                        {Array.from({ length: pkg.hotelRating }).map((_, i) => (
                          <Star key={i} size={10} fill="currentColor" />
                        ))}
                      </span>
                    </p>
                    <div className={styles.cardMeta}>
                      <span>
                        <Calendar size={14} />
                        {pkg.nights} {t('nights')}
                      </span>
                      <span className={styles.rating}>
                        <Star size={14} fill="currentColor" />
                        {pkg.rating}
                      </span>
                    </div>
                    <div className={styles.cardFooter}>
                      <div className={styles.price}>
                        <span className={styles.amount}>{pkg.pricePerPerson}</span>
                        <span className={styles.perPerson}>{t('perPerson')}</span>
                      </div>
                      <div className={styles.actions}>
                        <Link href={`/tours/${pkg.id}`} className={styles.viewBtn}>
                          {t('view')}
                          <ArrowRight size={14} />
                        </Link>
                        <button
                          className={styles.cartBtn}
                          onClick={() => handleAddPackageToCart(pkg)}
                          aria-label="Add to cart"
                        >
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

            {/* Day Tours */}
            {(activeTab === 'all' || activeTab === 'day-tours') &&
              filteredDayTours.map((tour) => (
                <article key={tour.id} className={styles.tourCard}>
                  <div className={styles.cardImage}>
                    <Image
                      src={tour.image}
                      alt={tour.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <span className={styles.durationBadge}>
                      <Clock size={12} />
                      {tour.duration}
                    </span>
                    <span className={`${styles.typeBadge} ${styles.tourType}`}>{t('badges.dayTour')}</span>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardLocation}>
                      <MapPin size={12} />
                      {tour.departsFrom}
                    </div>
                    <h3 className={styles.cardTitle}>{tour.name}</h3>
                    <div className={styles.cardMeta}>
                      <span>
                        <Users size={14} />
                        {tour.groupSize.min}-{tour.groupSize.max} {t('people')}
                      </span>
                      <span className={styles.rating}>
                        <Star size={14} fill="currentColor" />
                        {tour.rating}
                      </span>
                    </div>
                    <div className={styles.cardFooter}>
                      <div className={styles.price}>
                        <span className={styles.amount}>{tour.pricePerPerson}</span>
                        <span className={styles.perPerson}>{t('perPerson')}</span>
                      </div>
                      <div className={styles.actions}>
                        <Link href={`/tours/${tour.id}`} className={styles.viewBtn}>
                          {t('view')}
                          <ArrowRight size={14} />
                        </Link>
                        <button
                          className={styles.cartBtn}
                          onClick={() => handleAddTourToCart(tour)}
                          aria-label="Add to cart"
                        >
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <MapPin />
            <h3>{activeTab === 'packages' ? t('noResultsPackages') : activeTab === 'day-tours' ? t('noResultsDayTours') : t('noResults')}</h3>
            <p>{t('noResultsMessage')}</p>
            <button onClick={clearFilters}>{t('clearFilters')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
