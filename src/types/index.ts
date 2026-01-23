// ============================================
// ITRAVEL - TypeScript Interfaces
// ============================================
// These interfaces prepare the data structure for easy CMS integration.
// Replace mock data with Sanity/CMS fetch calls when ready.

export interface NavItem {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  backgroundImage: string;
  overlayText: string;
}

export interface Destination {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  rating?: number;
  reviewCount?: number;
  price?: string;
  duration?: string;
  featured?: boolean;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  suffix?: string;
}

export interface AboutFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AboutContent {
  badge: string;
  title: string;
  description: string;
  features: AboutFeature[];
  images: string[];
  statsHighlight: {
    value: string;
    label: string;
  };
}

export interface BookingFeature {
  id: string;
  icon: string;
  value: string;
  label: string;
}

export interface BookingContent {
  sectionLabel: string;
  title: string;
  description: string;
  features: BookingFeature[];
  appPreview: string;
  ctaText: string;
}

export interface AdventureCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  count?: number;
}

export interface AdventureContent {
  sectionLabel: string;
  title: string;
  rating: {
    value: string;
    label: string;
  };
  categories: AdventureCategory[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date?: string;
  location?: string;
}

export interface EventsContent {
  year: string;
  title: string;
  events: Event[];
  partners: Partner[];
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
}

export interface Testimonial {
  id: string;
  author: {
    name: string;
    title: string;
    avatar: string;
    location?: string;
  };
  content: string;
  rating: number;
  date?: string;
}

export interface TestimonialsContent {
  sectionLabel: string;
  title: string;
  backgroundImage: string;
  testimonials: Testimonial[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author?: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime?: string;
  featured?: boolean;
  stats?: {
    value: string;
    label: string;
  };
}

export interface BlogContent {
  sectionTitle: string;
  posts: BlogPost[];
}

export interface CTAContent {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
}

export interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface FooterContent {
  logo: string;
  tagline: string;
  sections: FooterSection[];
  socialLinks: {
    platform: string;
    url: string;
    icon: string;
  }[];
  faqs: FAQ[];
  copyright: string;
}

export interface SiteContent {
  siteName: string;
  siteDescription: string;
  navigation: NavItem[];
  hero: HeroContent;
  destinations: Destination[];
  stats: Stat[];
  about: AboutContent;
  booking: BookingContent;
  adventure: AdventureContent;
  events: EventsContent;
  testimonials: TestimonialsContent;
  blog: BlogContent;
  cta: CTAContent;
  footer: FooterContent;
}
