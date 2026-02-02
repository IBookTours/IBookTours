'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Map, MapPin, Mountain, Waves, Utensils, Camera, Car, Clock, Mail, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/store/cartStore';
import styles from './InteractiveMaps.module.scss';

interface MapProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  duration: string;
  locations: number;
  image: string;
  features: string[];
  popular?: boolean;
  // CMS-ready: Add Google Maps list URLs here after creating them
  googleMapsUrl?: string;
  description?: string;
}

// ============================================
// MAP PRODUCTS - CMS-READY DATA STRUCTURE
// ============================================
// To add Google Maps links:
// 1. Create a "Saved List" in Google Maps
// 2. Add all your locations to the list
// 3. Set list to shareable
// 4. Copy the share URL and add to googleMapsUrl field below
// ============================================

const MAP_PRODUCTS: MapProduct[] = [
  {
    id: 'albania-full-map',
    name: 'Albania Complete Map',
    price: 100,
    currency: 'ILS',
    duration: '4 months',
    locations: 500,
    image: '/media/maps/albania-map-preview.jpg',
    description: 'The ultimate guide to Albania - every beach, trail, viewpoint, and hidden gem curated by locals.',
    features: [
      'beaches',
      'hiking',
      'viewpoints',
      'restaurants',
      'historical',
      'accommodation',
    ],
    popular: true,
    // TODO: Add Google Maps URL after creating the list
    // googleMapsUrl: 'https://maps.app.goo.gl/YOUR_LIST_ID'
  },
  {
    id: 'tirana-city-map',
    name: 'Tirana City Map',
    price: 25,
    currency: 'ILS',
    duration: '4 months',
    locations: 150,
    image: '/media/maps/tirana-map-preview.jpg',
    description: 'Navigate Tirana like a local - the best restaurants, cafes, nightlife, and cultural spots.',
    features: [
      'restaurants',
      'cafes',
      'nightlife',
      'shopping',
      'museums',
      'parks',
    ],
    // TODO: Add Google Maps URL after creating the list
    // googleMapsUrl: 'https://maps.app.goo.gl/YOUR_LIST_ID'
  },
];

const CATEGORIES = [
  { id: 'beaches', icon: Waves, label: 'Beaches & Lakes' },
  { id: 'hiking', icon: Mountain, label: 'Hiking Trails' },
  { id: 'viewpoints', icon: Camera, label: 'Scenic Viewpoints' },
  { id: 'restaurants', icon: Utensils, label: 'Restaurants' },
  { id: 'historical', icon: MapPin, label: 'Historical Sites' },
  { id: 'roads', icon: Car, label: 'Road Conditions' },
];

export default function InteractiveMapsSection() {
  const t = useTranslations('interactiveMaps');
  const addItem = useCartStore((state) => state.addItem);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handlePurchase = (product: MapProduct) => {
    addItem({
      id: product.id,
      type: 'digital-product',
      name: product.name,
      image: product.image,
      duration: product.duration,
      location: 'Digital Access',
      basePrice: product.price * 100, // Convert to cents
      quantity: 1,
      date: new Date().toISOString().split('T')[0],
      travelers: { adults: 1, children: 0 },
      childDiscountPercent: 0,
    });
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <main className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <Image
          src="https://images.unsplash.com/photo-1565876427310-0695a4ff03b8?w=1920&h=600&fit=crop&q=90"
          alt="Aerial view of Albanian coastline"
          fill
          priority
          quality={90}
          className={styles.heroBackgroundImage}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.badge}>{t('badge')}</span>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>
      </section>

      {/* Categories Preview */}
      <section className={styles.categories}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{t('categoriesTitle')}</h2>
          <div className={styles.categoryGrid}>
            {CATEGORIES.map((category) => (
              <div key={category.id} className={styles.categoryCard}>
                <category.icon className={styles.categoryIcon} />
                <span>{t(`categories.${category.id}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className={styles.products}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{t('productsTitle')}</h2>
          <p className={styles.sectionSubtitle}>{t('productsSubtitle')}</p>

          <div className={styles.productGrid}>
            {MAP_PRODUCTS.map((product) => (
              <div key={product.id} className={`${styles.productCard} ${product.popular ? styles.popular : ''}`}>
                {product.popular && (
                  <span className={styles.popularBadge}>{t('mostPopular')}</span>
                )}

                <div className={styles.productImage}>
                  {product.image && !product.image.includes('preview') ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 500px"
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <Map />
                      <span>{product.locations}+ {t('locations')}</span>
                    </div>
                  )}
                </div>

                <div className={styles.productContent}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  {product.description && (
                    <p className={styles.productDesc}>{product.description}</p>
                  )}

                  <div className={styles.productMeta}>
                    <span className={styles.metaItem}>
                      <MapPin />
                      {product.locations}+ {t('locations')}
                    </span>
                    <span className={styles.metaItem}>
                      <Clock />
                      {product.duration} {t('access')}
                    </span>
                  </div>

                  <ul className={styles.featureList}>
                    {product.features.slice(0, 4).map((feature) => (
                      <li key={feature}>
                        <CheckCircle />
                        {t(`features.${feature}`)}
                      </li>
                    ))}
                  </ul>

                  <div className={styles.pricing}>
                    <span className={styles.price}>
                      ₪{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className={styles.originalPrice}>
                        ₪{product.originalPrice}
                      </span>
                    )}
                  </div>

                  <button
                    className={styles.purchaseBtn}
                    onClick={() => handlePurchase(product)}
                  >
                    {t('addToCart')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{t('howItWorksTitle')}</h2>

          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNumber}>1</span>
              <h3>{t('step1Title')}</h3>
              <p>{t('step1Desc')}</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNumber}>2</span>
              <h3>{t('step2Title')}</h3>
              <p>{t('step2Desc')}</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNumber}>3</span>
              <h3>{t('step3Title')}</h3>
              <p>{t('step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className={styles.requirements}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{t('requirementsTitle')}</h2>
          <div className={styles.requirementsList}>
            <div className={styles.requirement}>
              <Mail />
              <div>
                <h4>{t('reqGoogleAccount')}</h4>
                <p>{t('reqGoogleAccountDesc')}</p>
              </div>
            </div>
            <div className={styles.requirement}>
              <Map />
              <div>
                <h4>{t('reqGoogleMaps')}</h4>
                <p>{t('reqGoogleMapsDesc')}</p>
              </div>
            </div>
            <div className={styles.requirement}>
              <Clock />
              <div>
                <h4>{t('reqDelivery')}</h4>
                <p>{t('reqDeliveryDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{t('faqTitle')}</h2>

          <div className={styles.faqList}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(i)}
                  aria-expanded={expandedFaq === i}
                >
                  <span>{t(`faq${i}Q`)}</span>
                  {expandedFaq === i ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedFaq === i && (
                  <div className={styles.faqAnswer}>
                    <p>{t(`faq${i}A`)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
