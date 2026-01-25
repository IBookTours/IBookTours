'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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

const priceRanges = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'budget', label: 'Under €500', min: 0, max: 500 },
  { id: 'mid', label: '€500 - €1,000', min: 500, max: 1000 },
  { id: 'premium', label: '€1,000 - €2,000', min: 1000, max: 2000 },
  { id: 'luxury', label: 'Over €2,000', min: 2000, max: Infinity },
];

const durations = [
  { id: 'all', label: 'Any Duration' },
  { id: 'short', label: '1-4 Days' },
  { id: 'medium', label: '5-7 Days' },
  { id: 'long', label: '8+ Days' },
];

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All', icon: <Package size={18} /> },
  { id: 'packages', label: 'Vacation Packages', icon: <Plane size={18} /> },
  { id: 'day-tours', label: 'Day Tours', icon: <Clock size={18} /> },
];

export default function ToursClient({
  destinations,
  vacationPackages,
  dayTours,
}: ToursClientProps) {
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

  // Filter packages based on search
  const filteredPackages = useMemo(() => {
    return vacationPackages.filter((pkg) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          pkg.destination.toLowerCase().includes(query) ||
          pkg.location.toLowerCase().includes(query) ||
          pkg.hotelName.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [vacationPackages, searchQuery]);

  // Filter day tours based on search
  const filteredDayTours = useMemo(() => {
    return dayTours.filter((tour) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          tour.name.toLowerCase().includes(query) ||
          tour.location.toLowerCase().includes(query) ||
          tour.departsFrom.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [dayTours, searchQuery]);

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
              aria-label="Search tours and destinations"
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
        {/* Tabs */}
        <div className={styles.tabs} role="tablist" aria-label="Tour categories">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => handleTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className={styles.tabCount}>{counts[tab.id]}</span>
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className={`${styles.filterBar} ${showFilters ? styles.open : ''}`} role="group" aria-label="Tour filters">
          <div className={styles.filterGroup}>
            <label htmlFor="price-filter">Price Range</label>
            <div className={styles.selectWrapper}>
              <select
                id="price-filter"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                aria-label="Filter by price range"
              >
                {priceRanges.map((range) => (
                  <option key={range.id} value={range.id}>
                    {range.label}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="duration-filter">Duration</label>
            <div className={styles.selectWrapper}>
              <select
                id="duration-filter"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                aria-label="Filter by duration"
              >
                {durations.map((dur) => (
                  <option key={dur.id} value={dur.id}>
                    {dur.label}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" />
            </div>
          </div>

          {hasActiveFilters && (
            <button className={styles.clearFilters} onClick={clearFilters} aria-label="Clear all filters">
              <X aria-hidden="true" />
              Clear All
            </button>
          )}
        </div>

        {/* Results Header */}
        <div className={styles.resultsHeader}>
          <p className={styles.resultCount}>
            <strong>{counts[activeTab]}</strong>{' '}
            {activeTab === 'packages' ? 'packages' : activeTab === 'day-tours' ? 'day tours' : 'items'} found
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
                          Flights
                        </span>
                      )}
                      {pkg.includesHotel && (
                        <span className={styles.badge}>
                          <Hotel size={12} />
                          Hotel
                        </span>
                      )}
                    </div>
                    <span className={styles.typeBadge}>Package</span>
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
                        {pkg.nights} nights
                      </span>
                      <span className={styles.rating}>
                        <Star size={14} fill="currentColor" />
                        {pkg.rating}
                      </span>
                    </div>
                    <div className={styles.cardFooter}>
                      <div className={styles.price}>
                        <span className={styles.amount}>{pkg.pricePerPerson}</span>
                        <span className={styles.perPerson}>per person</span>
                      </div>
                      <div className={styles.actions}>
                        <Link href={`/tours/${pkg.id}`} className={styles.viewBtn}>
                          View
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
                    <span className={`${styles.typeBadge} ${styles.tourType}`}>Day Tour</span>
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
                        {tour.groupSize.min}-{tour.groupSize.max} people
                      </span>
                      <span className={styles.rating}>
                        <Star size={14} fill="currentColor" />
                        {tour.rating}
                      </span>
                    </div>
                    <div className={styles.cardFooter}>
                      <div className={styles.price}>
                        <span className={styles.amount}>{tour.pricePerPerson}</span>
                        <span className={styles.perPerson}>per person</span>
                      </div>
                      <div className={styles.actions}>
                        <Link href={`/tours/${tour.id}`} className={styles.viewBtn}>
                          View
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
            <h3>No {activeTab === 'packages' ? 'packages' : activeTab === 'day-tours' ? 'day tours' : 'tours'} found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button onClick={clearFilters}>Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
