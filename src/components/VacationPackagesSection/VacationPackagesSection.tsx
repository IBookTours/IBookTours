'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Plane,
  Hotel,
  Calendar,
  MapPin,
  Star,
  ArrowRight,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { priceStringToCents } from '@/store/bookingStore';
import styles from './VacationPackagesSection.module.scss';

export interface VacationPackage {
  id: string;
  destination: string;
  location: string;
  departureCities: string[];
  hotelName: string;
  hotelRating: number;
  duration: string;
  nights: number;
  pricePerPerson: string;
  image: string;
  highlights: string[];
  includesFlights: boolean;
  includesHotel: boolean;
  rating: number;
  reviewCount: number;
}

interface VacationPackagesSectionProps {
  packages: VacationPackage[];
}

export default function VacationPackagesSection({ packages }: VacationPackagesSectionProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (pkg: VacationPackage) => {
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

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>
            <Plane size={16} />
            Flight + Hotel Packages
          </span>
          <h2 className={styles.title}>Vacation Packages</h2>
          <p className={styles.subtitle}>
            Complete holiday packages with flights and handpicked hotels. Everything you need for the perfect getaway.
          </p>
        </div>

        <div className={styles.grid}>
          {packages.map((pkg) => (
            <article key={pkg.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={pkg.image}
                  alt={pkg.destination}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className={styles.badges}>
                  {pkg.includesFlights && (
                    <span className={styles.includeBadge}>
                      <Plane size={14} />
                      Flights Included
                    </span>
                  )}
                  {pkg.includesHotel && (
                    <span className={styles.includeBadge}>
                      <Hotel size={14} />
                      Hotel Included
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.content}>
                <div className={styles.location}>
                  <MapPin size={14} />
                  {pkg.location}
                </div>

                <h3 className={styles.destination}>{pkg.destination}</h3>

                <div className={styles.hotelInfo}>
                  <Hotel size={16} />
                  <span>{pkg.hotelName}</span>
                  <div className={styles.stars}>
                    {Array.from({ length: pkg.hotelRating }).map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>

                <div className={styles.meta}>
                  <span className={styles.metaItem}>
                    <Calendar size={14} />
                    {pkg.nights} nights
                  </span>
                  <span className={styles.metaItem}>
                    <Users size={14} />
                    From {pkg.departureCities[0]}
                  </span>
                </div>

                <ul className={styles.highlights}>
                  {pkg.highlights.slice(0, 3).map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>

                <div className={styles.footer}>
                  <div className={styles.pricing}>
                    <span className={styles.price}>{pkg.pricePerPerson}</span>
                    <span className={styles.perPerson}>per person</span>
                  </div>

                  <div className={styles.rating}>
                    <Star size={14} fill="currentColor" />
                    <span>{pkg.rating}</span>
                    <span className={styles.reviews}>({pkg.reviewCount})</span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <Link href={`/tours/${pkg.id}`} className={styles.viewBtn}>
                    View Details
                    <ArrowRight size={16} />
                  </Link>
                  <button
                    className={styles.cartBtn}
                    onClick={() => handleAddToCart(pkg)}
                    aria-label="Add to cart"
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.cta}>
          <Link href="/tours?type=package" className={styles.ctaButton}>
            View All Packages
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
