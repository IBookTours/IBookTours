// ============================================
// CMS-Ready TypeScript Interfaces
// ============================================
// These interfaces are designed to mirror Sanity CMS schemas.
// When Sanity is connected, replace mock data fetches with:
// const data = await sanityClient.fetch<CMSDocument>(query);

// ============================================
// BASE CMS DOCUMENT TYPES
// ============================================

export interface CMSDocument {
  _id: string;
  _type: string;
  _createdAt?: string;
  _updatedAt?: string;
}

export interface LocalizedString {
  en: string;
  he: string;
}

export interface LocalizedText {
  en: string[];
  he: string[];
}

export interface CMSImage {
  url: string;
  alt?: LocalizedString;
  width?: number;
  height?: number;
  blurDataURL?: string;
}

export interface CMSLink {
  href: string;
  external?: boolean;
}

// ============================================
// PRODUCT TYPES (for cancellation policies)
// ============================================

export type ProductType =
  | 'vacation-package'
  | 'day-tour'
  | 'event-ticket'
  | 'private-tour';

export interface CancellationTier {
  daysBeforeStart: number;
  refundPercent: number;
  label: LocalizedString;
}

export interface CancellationPolicy extends CMSDocument {
  _type: 'cancellationPolicy';
  productType: ProductType;
  name: LocalizedString;
  description: LocalizedString;
  tiers: CancellationTier[];
  notes?: LocalizedString;
  isDefault?: boolean;
}

// ============================================
// LEGAL CONTENT TYPES
// ============================================

export interface LegalSection {
  id: string;
  title: LocalizedString;
  content: LocalizedText;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface LegalPage extends CMSDocument {
  _type: 'legalPage';
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  lastUpdated: string;
  sections: LegalSection[];
  showTableOfContents?: boolean;
  contactCta?: boolean;
}

// ============================================
// FAQ/HELP TYPES
// ============================================

export interface FAQItem extends CMSDocument {
  _type: 'faqItem';
  question: LocalizedString;
  answer: LocalizedString;
  category: string;
  order?: number;
}

export interface FAQCategory extends CMSDocument {
  _type: 'faqCategory';
  id: string;
  name: LocalizedString;
  icon: string;
  items: FAQItem[];
  order?: number;
}

// ============================================
// TOUR/PRODUCT TYPES
// ============================================

export interface Destination extends CMSDocument {
  _type: 'destination';
  slug: string;
  name: LocalizedString;
  location: LocalizedString;
  description: LocalizedString;
  image: CMSImage;
  gallery?: CMSImage[];
  rating?: number;
  reviewCount?: number;
  price?: {
    amount: number;
    currency: string;
    display: string;
  };
  duration?: LocalizedString;
  featured?: boolean;
  cancellationPolicy?: string; // Reference to CancellationPolicy._id
}

export interface VacationPackageCMS extends CMSDocument {
  _type: 'vacationPackage';
  slug: string;
  destination: LocalizedString;
  location: LocalizedString;
  departureCities: string[];
  hotel: {
    name: string;
    rating: number;
  };
  duration: LocalizedString;
  nights: number;
  price: {
    amount: number;
    currency: string;
    perPerson: boolean;
  };
  image: CMSImage;
  highlights: LocalizedText;
  includes: {
    flights: boolean;
    hotel: boolean;
    meals?: string;
    transfers?: boolean;
  };
  rating: number;
  reviewCount: number;
  cancellationPolicy: 'flexible'; // Uses vacation-package policy
}

export interface DayTourCMS extends CMSDocument {
  _type: 'dayTour';
  slug: string;
  name: LocalizedString;
  duration: LocalizedString;
  location: LocalizedString;
  departsFrom: string;
  groupSize: { min: number; max: number };
  price: {
    amount: number;
    currency: string;
    perPerson: boolean;
  };
  category: 'cultural' | 'adventure' | 'food' | 'nature' | 'all';
  image: CMSImage;
  rating: number;
  reviewCount: number;
  highlights: LocalizedText;
  cancellationPolicy: 'standard'; // Uses day-tour policy
}

export interface EventCMS extends CMSDocument {
  _type: 'event';
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  image: CMSImage;
  date: string;
  endDate?: string;
  location: LocalizedString;
  price?: {
    amount: number;
    currency: string;
  };
  cancellationPolicy: 'strict'; // Uses event-ticket policy
}

// ============================================
// SITE CONTENT TYPES
// ============================================

export interface SiteSettings extends CMSDocument {
  _type: 'siteSettings';
  siteName: LocalizedString;
  siteDescription: LocalizedString;
  logo: CMSImage;
  favicon: CMSImage;
  ogImage: CMSImage;
  socialLinks: {
    platform: string;
    url: string;
    icon: string;
  }[];
  contactInfo: {
    email: string;
    phone: string;
    whatsapp?: string;
    address: LocalizedString;
  };
  businessHours: LocalizedString;
}

export interface NavigationItem extends CMSDocument {
  _type: 'navigationItem';
  label: LocalizedString;
  href: string;
  order: number;
  children?: NavigationItem[];
}

export interface HeroContent extends CMSDocument {
  _type: 'heroContent';
  title: LocalizedString;
  subtitle: LocalizedString;
  searchPlaceholder: LocalizedString;
  backgroundImage: CMSImage;
  backgroundVideo?: {
    mp4: string;
    webm?: string;
    poster: CMSImage;
  };
  overlayText: LocalizedString;
}

export interface Testimonial extends CMSDocument {
  _type: 'testimonial';
  author: {
    name: string;
    title: LocalizedString;
    avatar: CMSImage;
    location?: string;
  };
  content: LocalizedString;
  rating: number;
  date: string;
  source: 'Facebook' | 'Google' | 'TripAdvisor';
  featured?: boolean;
}

export interface BlogPost extends CMSDocument {
  _type: 'blogPost';
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  content: LocalizedString;
  image: CMSImage;
  category: LocalizedString;
  author?: {
    name: string;
    avatar: CMSImage;
  };
  publishedAt: string;
  readTime: number;
  featured?: boolean;
}

// ============================================
// FOOTER TYPES
// ============================================

export interface FooterSection extends CMSDocument {
  _type: 'footerSection';
  id: string;
  title: LocalizedString;
  links: {
    id: string;
    label: LocalizedString;
    href: string;
  }[];
  order: number;
}

// ============================================
// HELPER TYPES FOR CURRENT DATA FORMAT
// ============================================

// Use these until Sanity is connected
export type Locale = 'en' | 'he';

export function getLocalizedValue<T>(
  localized: { en: T; he: T } | T,
  locale: Locale
): T {
  if (typeof localized === 'object' && localized !== null && 'en' in localized) {
    return (localized as { en: T; he: T })[locale];
  }
  return localized as T;
}

export function createLocalizedString(en: string, he: string): LocalizedString {
  return { en, he };
}

export function createLocalizedText(en: string[], he: string[]): LocalizedText {
  return { en, he };
}
