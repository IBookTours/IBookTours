'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  ArrowLeft,
  ChevronRight,
  Star,
  Users,
  Settings2,
  Fuel,
  Briefcase,
  Calendar,
  MapPin,
  Clock,
  Check,
  Info,
  Zap,
  Shield,
  CreditCard,
  Car,
  DoorOpen,
} from 'lucide-react';
import { CarRentalVehicle } from '@/types/carRental';
import { rentalLocations } from '@/data/carRentalData';
import {
  useCarRentalStore,
  formatCarPrice,
  getMinPickupDate,
  getMinReturnDate,
} from '@/store/carRentalStore';
import styles from './vehicle-detail.module.scss';

interface Props {
  vehicle: CarRentalVehicle;
}

export default function VehicleDetailClient({ vehicle }: Props) {
  const t = useTranslations('carRental');
  const {
    booking,
    setPickupDate,
    setReturnDate,
    setPickupLocation,
    setReturnLocation,
    calculateTotalDays,
    calculateTotalPrice,
  } = useCarRentalStore();

  const [localPickupDate, setLocalPickupDate] = useState(booking.pickupDate || '');
  const [localReturnDate, setLocalReturnDate] = useState(booking.returnDate || '');
  const [localPickupLocation, setLocalPickupLocation] = useState(booking.pickupLocationId || '');
  const [localReturnLocation, setLocalReturnLocation] = useState(booking.returnLocationId || '');

  // Update store when local state changes
  const handlePickupDateChange = (date: string) => {
    setLocalPickupDate(date);
    setPickupDate(date);
  };

  const handleReturnDateChange = (date: string) => {
    setLocalReturnDate(date);
    setReturnDate(date);
  };

  const handlePickupLocationChange = (locationId: string) => {
    setLocalPickupLocation(locationId);
    setPickupLocation(locationId);
  };

  const handleReturnLocationChange = (locationId: string) => {
    setLocalReturnLocation(locationId);
    setReturnLocation(locationId);
  };

  // Calculate pricing
  const totalDays = useMemo(() => {
    if (!localPickupDate || !localReturnDate) return 0;
    const pickup = new Date(localPickupDate);
    const returnD = new Date(localReturnDate);
    const diffTime = returnD.getTime() - pickup.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  }, [localPickupDate, localReturnDate]);

  const vehicleTotal = totalDays * vehicle.pricePerDay;

  const canBook = localPickupDate && localReturnDate && localPickupLocation && totalDays > 0;

  const getFuelIcon = () => {
    if (vehicle.fuelType === 'electric' || vehicle.fuelType === 'hybrid') {
      return <Zap size={24} />;
    }
    return <Fuel size={24} />;
  };

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <ChevronRight />
        <Link href="/car-rental">Car Rental</Link>
        <ChevronRight />
        <span>{vehicle.name}</span>
      </nav>

      <div className={styles.container}>
        {/* Left Column - Vehicle Info */}
        <div className={styles.vehicleInfo}>
          {/* Back Button (Mobile) */}
          <Link href="/car-rental" className={styles.backButton}>
            <ArrowLeft />
            Back to all vehicles
          </Link>

          {/* Image Gallery */}
          <div className={styles.imageGallery}>
            <Image
              src={vehicle.image}
              alt={vehicle.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className={styles.badges}>
              {vehicle.featured && (
                <span className={`${styles.badge} ${styles.featured}`}>
                  <Star size={12} />
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
                  <Zap size={12} />
                  {t('electric')}
                </span>
              )}
            </div>
            <span className={styles.categoryBadge}>{t(`categories.${vehicle.category}`)}</span>
          </div>

          {/* Vehicle Header */}
          <div className={styles.vehicleHeader}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{vehicle.name}</h1>
              {vehicle.rating && (
                <div className={styles.rating}>
                  <Star size={18} fill="currentColor" />
                  <strong>{vehicle.rating}</strong>
                  {vehicle.reviewCount && <span>({vehicle.reviewCount} {t('reviews')})</span>}
                </div>
              )}
            </div>
            <p className={styles.brandModel}>
              {vehicle.brand} {vehicle.model} • {vehicle.year}
            </p>

            <div className={styles.mainSpecs}>
              <div className={styles.specItem}>
                <Users />
                <span className={styles.specLabel}>{t('seats')}</span>
                <span className={styles.specValue}>{vehicle.seats}</span>
              </div>
              <div className={styles.specItem}>
                <DoorOpen />
                <span className={styles.specLabel}>{t('doors')}</span>
                <span className={styles.specValue}>{vehicle.doors}</span>
              </div>
              <div className={styles.specItem}>
                <Settings2 />
                <span className={styles.specLabel}>{t('transmission')}</span>
                <span className={styles.specValue}>{t(vehicle.transmission)}</span>
              </div>
              <div className={styles.specItem}>
                {getFuelIcon()}
                <span className={styles.specLabel}>{t('fuelType')}</span>
                <span className={styles.specValue}>{t(vehicle.fuelType)}</span>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className={styles.featuresSection}>
            <h2 className={styles.sectionTitle}>
              <Check />
              {t('details.features')}
            </h2>
            <div className={styles.featuresList}>
              {vehicle.features.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  <Check />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Requirements Section */}
          <div className={styles.requirementsSection}>
            <h2 className={styles.sectionTitle}>
              <Info />
              {t('details.requirements')}
            </h2>
            <div className={styles.requirementsList}>
              <div className={styles.requirementItem}>
                <CreditCard />
                {t('details.minAge')}
              </div>
              <div className={styles.requirementItem}>
                <Car />
                {t('details.license')}
              </div>
              <div className={styles.requirementItem}>
                <Shield />
                {t('details.deposit')}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className={styles.bookingCard}>
          <div className={styles.priceSection}>
            {vehicle.originalPrice && (
              <span className={styles.originalPrice}>
                {formatCarPrice(vehicle.originalPrice, '€')}
              </span>
            )}
            <span className={styles.currentPrice}>
              {formatCarPrice(vehicle.pricePerDay, '€')}
            </span>
            <span className={styles.perDay}>/{t('perDay')}</span>
            {vehicle.discountPercent && (
              <span className={styles.discountTag}>-{vehicle.discountPercent}%</span>
            )}
          </div>

          <div className={styles.bookingForm}>
            {/* Dates */}
            <div className={styles.dateRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Calendar />
                  {t('booking.pickupDate')}
                </label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={localPickupDate}
                  onChange={(e) => handlePickupDateChange(e.target.value)}
                  min={getMinPickupDate()}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Calendar />
                  {t('booking.returnDate')}
                </label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={localReturnDate}
                  onChange={(e) => handleReturnDateChange(e.target.value)}
                  min={getMinReturnDate(localPickupDate)}
                />
              </div>
            </div>

            {/* Pickup Location */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <MapPin />
                {t('booking.pickupLocation')}
              </label>
              <select
                className={styles.formInput}
                value={localPickupLocation}
                onChange={(e) => handlePickupLocationChange(e.target.value)}
              >
                <option value="">Select location...</option>
                {rentalLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Return Location */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <MapPin />
                {t('booking.returnLocation')}
              </label>
              <select
                className={styles.formInput}
                value={localReturnLocation}
                onChange={(e) => handleReturnLocationChange(e.target.value)}
              >
                <option value="">Same as pickup</option>
                {rentalLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Summary */}
            {totalDays > 0 && (
              <div className={styles.priceSummary}>
                <div className={styles.summaryRow}>
                  <span>{t('booking.totalDays')}</span>
                  <span>{totalDays} days</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>{t('booking.vehiclePrice')}</span>
                  <span>{formatCarPrice(vehicle.pricePerDay, '€')} × {totalDays}</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>{t('booking.totalPrice')}</span>
                  <span>{formatCarPrice(vehicleTotal, '€')}</span>
                </div>
              </div>
            )}

            {/* Book Button */}
            <button
              className={styles.bookButton}
              disabled={!canBook}
              onClick={() => {
                // For now, show alert. In production, this would navigate to checkout
                alert(`Booking ${vehicle.name} for ${totalDays} days. Total: €${vehicleTotal}`);
              }}
            >
              {canBook ? (
                <>
                  {t('bookNow')}
                  <span>•</span>
                  {formatCarPrice(vehicleTotal, '€')}
                </>
              ) : (
                t('booking.selectDates')
              )}
            </button>

            {/* Info Note */}
            <div className={styles.infoNote}>
              <Info />
              <span>Free cancellation up to 24 hours before pickup. No hidden fees.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
