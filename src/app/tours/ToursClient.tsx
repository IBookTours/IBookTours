'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  X,
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
  CalendarDays,
  Car,
  Building2,
  Briefcase,
  Fuel,
  Settings,
  Hotel as HotelIcon,
} from 'lucide-react';
import DestinationCard from '@/components/DestinationCard';
import Dropdown from '@/components/shared/Dropdown';
import { Destination, Event } from '@/types';
import { VacationPackage } from '@/components/VacationPackagesSection/VacationPackagesSection';
import { DayTour } from '@/components/DayToursSection/DayToursSection';
import { Hotel as HotelType } from '@/types/hotel';
import { CarRentalVehicle } from '@/types/carRental';
import { TravelService } from '@/data/servicesData';
import { useCartStore } from '@/store/cartStore';
import { priceStringToCents } from '@/store/bookingStore';
import {
  trackViewItemList,
  trackSearch,
  trackTourAddToCart,
  trackFilterApplied,
  type GA4Item,
} from '@/lib/analytics';
import styles from './tours.module.scss';

type TabType = 'all' | 'packages' | 'tours' | 'events' | 'hotels' | 'cars' | 'services';
type CategoryType = 'all' | 'cultural' | 'adventure' | 'food' | 'nature';

interface ToursClientProps {
  destinations: Destination[];
  vacationPackages: VacationPackage[];
  dayTours: DayTour[];
  events: Event[];
  hotels: HotelType[];
  vehicles: CarRentalVehicle[];
  services: TravelService[];
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

const tabIds: TabType[] = ['all', 'packages', 'tours', 'events', 'hotels', 'cars', 'services'];
const tabIcons: Record<TabType, React.ReactNode> = {
  'all': <Package size={18} />,
  'packages': <Plane size={18} />,
  'tours': <Clock size={18} />,
  'events': <CalendarDays size={18} />,
  'hotels': <Building2 size={18} />,
  'cars': <Car size={18} />,
  'services': <Briefcase size={18} />,
};

const categoryIds: CategoryType[] = ['all', 'cultural', 'adventure', 'food', 'nature'];

// Map URL param values to valid tab types
const normalizeTabType = (type: string | null): TabType => {
  if (!type) return 'all';
  // Handle singular/legacy mappings
  if (type === 'package') return 'packages';
  if (type === 'day-tours') return 'tours';
  if (type === 'hotel') return 'hotels';
  if (type === 'car' || type === 'car-rental') return 'cars';
  if (type === 'service') return 'services';
  if (tabIds.includes(type as TabType)) return type as TabType;
  return 'all';
};

// Map adventure section categories to search terms or categories
const mapCategoryToFilter = (category: string | null): { search?: string; category?: CategoryType } => {
  if (!category) return {};

  // Map adventure section categories to appropriate filters
  const categoryMappings: Record<string, { search?: string; category?: CategoryType }> = {
    'riviera': { search: 'riviera' },
    'unesco': { search: 'unesco' },
    'alps': { search: 'alps' },
    'food-wine': { category: 'food' },
    'culture-history': { category: 'cultural' },
    'events': { search: 'event' },
    // Direct category mappings
    'cultural': { category: 'cultural' },
    'adventure': { category: 'adventure' },
    'food': { category: 'food' },
    'nature': { category: 'nature' },
  };

  return categoryMappings[category] || { search: category };
};

export default function ToursClient({
  destinations,
  vacationPackages,
  dayTours,
  events,
  hotels,
  vehicles,
  services,
}: ToursClientProps) {
  const t = useTranslations('tours');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCartStore();

  // Parse URL parameters
  const urlType = normalizeTabType(searchParams.get('type'));
  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category');
  const urlDestination = searchParams.get('destination');

  // Map category param to appropriate filter
  const categoryFilter = mapCategoryToFilter(urlCategory);

  // Combine URL search with category-based search
  const initialSearch = urlSearch || categoryFilter.search || '';
  const initialCategory = categoryFilter.category || 'all';
  const initialLocation = urlDestination || 'all';

  const [activeTab, setActiveTab] = useState<TabType>(urlType);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const filterBarRef = useRef<HTMLDivElement>(null);

  // Get unique locations from all data sources
  const uniqueLocations = useMemo(() => {
    const locationSet = new Set<string>();
    vacationPackages.forEach(pkg => locationSet.add(pkg.location));
    dayTours.forEach(tour => locationSet.add(tour.location));
    hotels.forEach(hotel => locationSet.add(hotel.city || hotel.location));
    events.forEach(event => event.location && locationSet.add(event.location));
    return ['all', ...Array.from(locationSet).sort()];
  }, [vacationPackages, dayTours, hotels, events]);

  // Toggle filters with scroll behavior on mobile
  const handleFilterToggle = useCallback(() => {
    const newShowFilters = !showFilters;
    setShowFilters(newShowFilters);

    // On mobile, scroll to filter bar when opening
    if (newShowFilters && filterBarRef.current) {
      setTimeout(() => {
        filterBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showFilters]);

  // Sync with URL params on initial load and when URL changes externally
  useEffect(() => {
    const newType = normalizeTabType(searchParams.get('type'));
    const newSearch = searchParams.get('search') || '';
    const newCategoryParam = searchParams.get('category');
    const newDestination = searchParams.get('destination') || 'all';

    const catFilter = mapCategoryToFilter(newCategoryParam);
    const combinedSearch = newSearch || catFilter.search || '';
    const mappedCategory = catFilter.category || 'all';

    if (newType !== activeTab) setActiveTab(newType);
    if (combinedSearch !== searchQuery) setSearchQuery(combinedSearch);
    if (mappedCategory !== selectedCategory) setSelectedCategory(mappedCategory);
    if (newDestination !== selectedLocation) setSelectedLocation(newDestination);
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.set('type', activeTab);
      if (searchQuery) params.set('search', searchQuery);
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (selectedLocation !== 'all') params.set('destination', selectedLocation);
      const newUrl = params.toString() ? `/tours?${params.toString()}` : '/tours';
      router.replace(newUrl, { scroll: false });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [activeTab, searchQuery, selectedCategory, selectedLocation, router]);

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

      // Location filter
      if (selectedLocation !== 'all') {
        if (!pkg.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      }

      return true;
    });
  }, [vacationPackages, searchQuery, selectedPrice, selectedDuration, selectedLocation]);

  // Filter day tours based on search, price, duration, and category
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

      // Category filter
      if (selectedCategory !== 'all') {
        if (tour.category !== selectedCategory) return false;
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

      // Location filter
      if (selectedLocation !== 'all') {
        if (!tour.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      }

      return true;
    });
  }, [dayTours, searchQuery, selectedPrice, selectedDuration, selectedCategory, selectedLocation]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          event.title.toLowerCase().includes(query) ||
          (event.location && event.location.toLowerCase().includes(query)) ||
          event.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (selectedLocation !== 'all' && event.location) {
        if (!event.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      }
      return true;
    });
  }, [events, searchQuery, selectedLocation]);

  // Filter hotels
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          hotel.name.toLowerCase().includes(query) ||
          hotel.location.toLowerCase().includes(query) ||
          hotel.city.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (selectedPrice !== 'all') {
        const range = priceRangeValues[selectedPrice];
        if (range && (hotel.priceFrom < range.min || hotel.priceFrom >= range.max)) return false;
      }
      if (selectedLocation !== 'all') {
        if (!hotel.location.toLowerCase().includes(selectedLocation.toLowerCase()) &&
            !hotel.city.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      }
      return true;
    });
  }, [hotels, searchQuery, selectedPrice, selectedLocation]);

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          vehicle.name.toLowerCase().includes(query) ||
          vehicle.brand.toLowerCase().includes(query) ||
          vehicle.category.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (selectedPrice !== 'all') {
        const range = priceRangeValues[selectedPrice];
        // Scale car prices differently (daily rate)
        const scaledMin = range.min / 20; // Rough daily equivalent
        const scaledMax = range.max === Infinity ? Infinity : range.max / 20;
        if (vehicle.pricePerDay < scaledMin || vehicle.pricePerDay >= scaledMax) return false;
      }
      return true;
    });
  }, [vehicles, searchQuery, selectedPrice]);

  // Filter services
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = service.id.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      return true;
    });
  }, [services, searchQuery]);

  // Get counts for tabs
  const counts: Record<TabType, number> = {
    all: filteredPackages.length + filteredDayTours.length + filteredEvents.length + filteredHotels.length + filteredVehicles.length + filteredServices.length,
    packages: filteredPackages.length,
    tours: filteredDayTours.length,
    events: filteredEvents.length,
    hotels: filteredHotels.length,
    cars: filteredVehicles.length,
    services: filteredServices.length,
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPrice('all');
    setSelectedDuration('all');
    setSelectedCategory('all');
    setSelectedLocation('all');
  };

  const hasActiveFilters = searchQuery || selectedPrice !== 'all' || selectedDuration !== 'all' || selectedCategory !== 'all' || selectedLocation !== 'all';

  const handleAddPackageToCart = (pkg: VacationPackage) => {
    const priceInCents = priceStringToCents(pkg.pricePerPerson);
    addItem({
      id: pkg.id,
      type: 'vacation-package',
      name: `${pkg.destination} - ${pkg.hotelName}`,
      image: pkg.image,
      duration: pkg.duration,
      location: pkg.location,
      basePrice: priceInCents,
      quantity: 1,
      date: '',
      travelers: { adults: 1, children: 0 },
      childDiscountPercent: 30,
      options: {
        hotelName: pkg.hotelName,
        includesFlights: pkg.includesFlights,
      },
    });

    // Track add_to_cart event
    trackTourAddToCart({
      id: pkg.id,
      name: `${pkg.destination} - ${pkg.hotelName}`,
      type: 'vacation-package',
      location: pkg.location,
      basePrice: priceInCents,
    });
  };

  const handleAddTourToCart = (tour: DayTour) => {
    const priceInCents = priceStringToCents(tour.pricePerPerson);
    addItem({
      id: tour.id,
      type: 'day-tour',
      name: tour.name,
      image: tour.image,
      duration: tour.duration,
      location: tour.location,
      basePrice: priceInCents,
      quantity: 1,
      date: '',
      travelers: { adults: 1, children: 0 },
      childDiscountPercent: 50,
    });

    // Track add_to_cart event
    trackTourAddToCart({
      id: tour.id,
      name: tour.name,
      type: 'day-tour',
      location: tour.location,
      basePrice: priceInCents,
    });
  };

  // Track search queries (debounced)
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) return;
    const timeoutId = setTimeout(() => {
      trackSearch({ search_term: searchQuery });
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Track view_item_list when tours are displayed
  useEffect(() => {
    const items: GA4Item[] = [];

    // Add packages to tracking
    filteredPackages.slice(0, 20).forEach((pkg, index) => {
      items.push({
        item_id: pkg.id,
        item_name: `${pkg.destination} - ${pkg.hotelName}`,
        item_category: 'vacation-package',
        item_category2: pkg.location,
        price: extractPrice(pkg.pricePerPerson),
        quantity: 1,
        index,
      });
    });

    // Add day tours to tracking
    filteredDayTours.slice(0, 20).forEach((tour, index) => {
      items.push({
        item_id: tour.id,
        item_name: tour.name,
        item_category: 'day-tour',
        item_category2: tour.location,
        item_category3: tour.category,
        price: extractPrice(tour.pricePerPerson),
        quantity: 1,
        index: filteredPackages.length + index,
      });
    });

    if (items.length > 0) {
      trackViewItemList({
        item_list_id: `tours_${activeTab}`,
        item_list_name: `Tours - ${activeTab}`,
        items,
      });
    }
  }, [activeTab, filteredPackages, filteredDayTours]);

  // Track filter changes
  useEffect(() => {
    if (selectedPrice !== 'all') {
      trackFilterApplied({ filter_type: 'price', filter_value: selectedPrice });
    }
  }, [selectedPrice]);

  useEffect(() => {
    if (selectedCategory !== 'all') {
      trackFilterApplied({ filter_type: 'category', filter_value: selectedCategory });
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedLocation !== 'all') {
      trackFilterApplied({ filter_type: 'location', filter_value: selectedLocation });
    }
  }, [selectedLocation]);

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=600&fit=crop&q=90"
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
              onClick={handleFilterToggle}
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
          {tabIds.map((tabId) => {
            const tabLabels: Record<TabType, string> = {
              'all': t('tabs.all'),
              'packages': t('tabs.packages'),
              'tours': t('tabs.tours'),
              'events': t('tabs.events'),
              'hotels': t('tabs.hotels'),
              'cars': t('tabs.cars'),
              'services': t('tabs.services'),
            };
            return (
              <button
                key={tabId}
                className={`${styles.tab} ${activeTab === tabId ? styles.activeTab : ''} ${counts[tabId] === 0 && tabId !== 'all' ? styles.comingSoon : ''}`}
                onClick={() => handleTabChange(tabId)}
                role="tab"
                aria-selected={activeTab === tabId}
                aria-controls={`tabpanel-${tabId}`}
                id={`tab-${tabId}`}
              >
                {tabIcons[tabId]}
                <span>{tabLabels[tabId]}</span>
                {counts[tabId] > 0 ? (
                  <span className={styles.tabCount}>{counts[tabId]}</span>
                ) : tabId !== 'all' ? (
                  <span className={styles.tabSoon}>{t('tabs.soon')}</span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        <div
          ref={filterBarRef}
          id="filter-bar"
          className={`${styles.filterBar} ${showFilters ? styles.open : ''}`}
          role="group"
          aria-label="Tour filters"
        >
          <div className={styles.filterGroup}>
            <label htmlFor="price-filter">{t('price')}</label>
            <Dropdown
              id="price-filter"
              value={selectedPrice}
              onChange={setSelectedPrice}
              options={priceRangeIds.map((rangeId) => ({
                value: rangeId,
                label: t(`priceRanges.${rangeId}`),
              }))}
              variant="compact"
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="duration-filter">{t('duration')}</label>
            <Dropdown
              id="duration-filter"
              value={selectedDuration}
              onChange={setSelectedDuration}
              options={durationIds.map((durId) => ({
                value: durId,
                label: t(`durations.${durId}`),
              }))}
              variant="compact"
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="category-filter">{t('category')}</label>
            <Dropdown
              id="category-filter"
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value as CategoryType)}
              options={categoryIds.map((catId) => ({
                value: catId,
                label: t(`categories.${catId}`),
              }))}
              variant="compact"
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="location-filter">{t('location')}</label>
            <Dropdown
              id="location-filter"
              value={selectedLocation}
              onChange={setSelectedLocation}
              options={uniqueLocations.map((loc) => ({
                value: loc,
                label: loc === 'all' ? t('locations.all') : loc,
              }))}
              variant="compact"
            />
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
            {selectedCategory !== 'all' && (
              <span className={styles.filterChip}>
                {t(`categories.${selectedCategory}`)}
                <button onClick={() => setSelectedCategory('all')} aria-label="Remove category filter">
                  <X />
                </button>
              </span>
            )}
            {selectedLocation !== 'all' && (
              <span className={styles.filterChip}>
                {selectedLocation}
                <button onClick={() => setSelectedLocation('all')} aria-label="Remove location filter">
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
            {activeTab === 'packages' ? t('results.packages') : activeTab === 'tours' ? t('results.tours') : t('results.items')} {t('results.found')}
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
                          <HotelIcon size={12} />
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
                      <HotelIcon size={14} />
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
            {(activeTab === 'all' || activeTab === 'tours') &&
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

            {/* Events */}
            {(activeTab === 'all' || activeTab === 'events') &&
              filteredEvents.map((event) => (
                <article key={event.id} className={styles.eventCard}>
                  <div className={styles.cardImage}>
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {event.date && (
                      <span className={styles.durationBadge}>
                        <CalendarDays size={12} />
                        {event.date}
                      </span>
                    )}
                    <span className={`${styles.typeBadge} ${styles.eventType}`}>{t('badges.event')}</span>
                  </div>
                  <div className={styles.cardContent}>
                    {event.location && (
                      <div className={styles.cardLocation}>
                        <MapPin size={12} />
                        {event.location}
                      </div>
                    )}
                    <h3 className={styles.cardTitle}>{event.title}</h3>
                    <p className={styles.cardDescription}>{event.description}</p>
                    <div className={styles.cardFooter}>
                      <div className={styles.actions}>
                        <Link href={event.href || '/contact'} className={styles.viewBtn}>
                          {t('learnMore')}
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

            {/* Hotels */}
            {(activeTab === 'all' || activeTab === 'hotels') &&
              filteredHotels.map((hotel) => (
                <article key={hotel.id} className={styles.hotelCard}>
                  <div className={styles.cardImage}>
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <span className={styles.starBadge}>
                      {Array.from({ length: hotel.starRating }).map((_, i) => (
                        <Star key={i} size={10} fill="currentColor" />
                      ))}
                    </span>
                    <span className={`${styles.typeBadge} ${styles.hotelType}`}>{t('badges.hotel')}</span>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardLocation}>
                      <MapPin size={12} />
                      {hotel.city}
                    </div>
                    <h3 className={styles.cardTitle}>{hotel.name}</h3>
                    <p className={styles.cardDescription}>{hotel.shortDescription}</p>
                    <div className={styles.cardMeta}>
                      <span className={styles.rating}>
                        <Star size={14} fill="currentColor" />
                        {hotel.rating} ({hotel.reviewCount})
                      </span>
                    </div>
                    <div className={styles.cardFooter}>
                      <div className={styles.price}>
                        <span className={styles.amount}>€{hotel.priceFrom}</span>
                        <span className={styles.perPerson}>{t('perNight')}</span>
                      </div>
                      <div className={styles.actions}>
                        <Link href={`/hotels/${hotel.slug}`} className={styles.viewBtn}>
                          {t('view')}
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

            {/* Cars */}
            {(activeTab === 'all' || activeTab === 'cars') &&
              filteredVehicles.map((vehicle) => (
                <article key={vehicle.id} className={styles.carCard}>
                  <div className={styles.cardImage}>
                    {vehicle.image ? (
                      <Image
                        src={vehicle.image}
                        alt={vehicle.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className={styles.carPlaceholder}>
                        <Car size={48} />
                      </div>
                    )}
                    <span className={styles.seatsBadge}>
                      <Users size={12} />
                      {vehicle.seats}
                    </span>
                    <span className={`${styles.typeBadge} ${styles.carType}`}>{t('badges.car')}</span>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardLocation}>
                      <Settings size={12} />
                      {vehicle.transmission} • {vehicle.fuelType}
                    </div>
                    <h3 className={styles.cardTitle}>{vehicle.name}</h3>
                    <div className={styles.cardMeta}>
                      <span>
                        <Fuel size={14} />
                        {vehicle.fuelType}
                      </span>
                      <span className={styles.rating}>
                        <Star size={14} fill="currentColor" />
                        {vehicle.rating}
                      </span>
                    </div>
                    <div className={styles.cardFooter}>
                      <div className={styles.price}>
                        <span className={styles.amount}>€{vehicle.pricePerDay}</span>
                        <span className={styles.perPerson}>{t('perDay')}</span>
                      </div>
                      <div className={styles.actions}>
                        <Link href={`/car-rental/${vehicle.id}`} className={styles.viewBtn}>
                          {t('view')}
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

            {/* Services */}
            {(activeTab === 'all' || activeTab === 'services') &&
              filteredServices.map((service) => (
                <article key={service.id} className={styles.serviceCard}>
                  <div className={styles.cardImage}>
                    <Image
                      src={service.image}
                      alt={t(`services.${service.id}.title`)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <span className={`${styles.typeBadge} ${styles.serviceType}`}>{t('badges.service')}</span>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{t(`services.${service.id}.title`)}</h3>
                    <p className={styles.cardDescription}>{t(`services.${service.id}.description`)}</p>
                    <div className={styles.cardFooter}>
                      <div className={styles.actions}>
                        <Link href={service.href} className={styles.viewBtn}>
                          {t('learnMore')}
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
            {activeTab === 'services' && counts.services === 0 ? (
              <>
                {tabIcons[activeTab]}
                <h3>{t('comingSoon.title')}</h3>
                <p>{t('comingSoon.message')}</p>
                <button onClick={() => setActiveTab('all')}>{t('comingSoon.browseAll')}</button>
              </>
            ) : (
              <>
                <MapPin />
                <h3>{t('noResults')}</h3>
                <p>{t('noResultsMessage')}</p>
                <button onClick={clearFilters}>{t('clearFilters')}</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
