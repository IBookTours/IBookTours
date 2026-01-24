import { siteData } from '@/data/siteData';

interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': string;
    contactType: string;
    availableLanguage: string[];
  };
}

interface WebsiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    '@type': string;
    target: string;
    'query-input': string;
  };
}

interface TravelActionSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  provider: {
    '@type': string;
    name: string;
  };
}

export function OrganizationStructuredData() {
  const schema: OrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: siteData.siteName,
    description: siteData.siteDescription,
    url: 'https://itravel.com',
    logo: 'https://itravel.com/logo.png',
    sameAs: siteData.footer.socialLinks.map((link) => link.url),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteStructuredData() {
  const schema: WebsiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteData.siteName,
    url: 'https://itravel.com',
    description: siteData.siteDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://itravel.com/tours?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function TravelServiceStructuredData() {
  const services = siteData.destinations.map((dest) => ({
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: dest.name,
    description: dest.description,
    touristType: 'Adventure traveler',
    provider: {
      '@type': 'TravelAgency',
      name: siteData.siteName,
    },
    offers: dest.price
      ? {
          '@type': 'Offer',
          price: dest.price.replace(/[^0-9]/g, ''),
          priceCurrency: 'USD',
        }
      : undefined,
    aggregateRating: dest.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: dest.rating,
          reviewCount: dest.reviewCount || 0,
        }
      : undefined,
  }));

  return (
    <>
      {services.map((service, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
        />
      ))}
    </>
  );
}

export default function StructuredData() {
  return (
    <>
      <OrganizationStructuredData />
      <WebsiteStructuredData />
    </>
  );
}
