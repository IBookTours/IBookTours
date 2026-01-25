# ITravel - Technical Architecture

This document provides a comprehensive technical overview of the ITravel project architecture, design decisions, and implementation details.

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Styling Architecture](#styling-architecture)
4. [Data Model](#data-model)
5. [Authentication System](#authentication-system)
6. [CMS Integration](#cms-integration)
7. [Component Architecture](#component-architecture)
8. [Performance Considerations](#performance-considerations)

---

## Technology Stack

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Framework | Next.js | 14.2.x | App Router, SSR/SSG, API routes |
| Language | TypeScript | 5.x | Type safety, better DX |
| Styling | SCSS Modules | 1.79.x | Component isolation, no runtime CSS |
| CMS | Sanity.io | 3.57.x | Real-time editing, GROQ queries |
| Auth | NextAuth.js | 4.24.x | Multiple providers, JWT sessions |
| Icons | Lucide React | 0.447.x | Lightweight, tree-shakeable |

### Why Not Tailwind CSS?

This project deliberately uses SCSS Modules instead of Tailwind CSS for:

1. **Theming Control** - Centralized variables in `_variables.scss` enable global theme changes
2. **No Runtime Overhead** - Pure CSS output, no JIT or runtime processing
3. **Better Glassmorphism** - Complex effects like `backdrop-filter` are easier to manage in SCSS
4. **Maintainability** - Styles co-located with components but isolated by CSS Modules

---

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── api/                    # API routes
│   │   └── auth/              # NextAuth endpoints
│   ├── studio/                # Sanity Studio (embedded)
│   ├── layout.tsx             # Root layout (fonts, providers)
│   ├── page.tsx               # Homepage
│   └── globals.css            # (Not used - we use SCSS)
│
├── components/                 # UI Components
│   ├── [ComponentName]/
│   │   ├── ComponentName.tsx          # Component logic
│   │   ├── ComponentName.module.scss  # Scoped styles
│   │   └── index.ts                   # Barrel export
│   └── providers/             # Context providers
│
├── data/                      # Static/mock data
│   └── siteData.ts           # Typed mock content (CMS fallback)
│
├── lib/                       # Utilities & configurations
│   ├── auth.ts               # NextAuth configuration
│   └── auth-utils.ts         # Auth helper functions
│
├── sanity/                    # Sanity CMS
│   ├── schemas/              # Content type definitions
│   │   ├── tourPackage.ts
│   │   ├── testimonial.ts
│   │   ├── homepageStats.ts
│   │   └── index.ts
│   ├── sanity.client.ts      # Client & queries
│   └── index.ts              # Barrel export
│
├── styles/                    # Global styles
│   ├── _variables.scss       # Design tokens & mixins
│   └── globals.scss          # Base styles & utilities
│
└── types/                     # TypeScript definitions
    └── index.ts              # Shared interfaces
```

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `HeroSection.tsx` |
| Styles | PascalCase.module | `HeroSection.module.scss` |
| Utilities | camelCase | `auth-utils.ts` |
| Types | PascalCase | `interface Destination` |
| Schemas | camelCase | `tourPackage.ts` |

---

## Styling Architecture

### SCSS Variables System

The theming engine is built on a three-tier system:

```
┌─────────────────────────────────────────────┐
│           _variables.scss                    │
│  ┌─────────────────────────────────────┐    │
│  │  Primary Colors ($primary-*)         │    │
│  │  Secondary Colors ($secondary-*)     │    │
│  │  Neutral Colors ($neutral-*)         │    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │  Semantic Tokens                     │    │
│  │  - $bg-primary, $text-primary        │    │
│  │  - $border-light, $shadow-card       │    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │  Mixins                              │    │
│  │  - @include glassmorphism            │    │
│  │  - @include button-primary           │    │
│  │  - @include respond-to(lg)           │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### Responsive Breakpoints

```scss
$breakpoint-sm: 640px;   // Mobile landscape
$breakpoint-md: 768px;   // Tablet
$breakpoint-lg: 1024px;  // Desktop
$breakpoint-xl: 1280px;  // Large desktop
$breakpoint-2xl: 1536px; // Extra large
```

### CSS Modules Pattern

Each component follows this pattern:

```scss
// ComponentName.module.scss
@use '@/styles/variables' as *;

.container {
  @include container;
}

.title {
  @include section-title;
  color: $text-primary;
}
```

---

## Data Model

### Core Content Types

#### TourPackage
```typescript
interface TourPackage {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: SanityImageSource;
  location: string;
  price: string;
  duration: string;
  rating: number;
  reviewCount: number;
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert';
  description: string;
  longDescription: PortableTextBlock[];
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary: ItineraryDay[];
  featured: boolean;
  category: string;
}
```

#### Testimonial
```typescript
interface Testimonial {
  _id: string;
  authorName: string;
  authorTitle: string;
  authorAvatar: SanityImageSource;
  authorLocation: string;
  content: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  tourPackage?: Reference<TourPackage>;
  featured: boolean;
  verified: boolean;
}
```

#### HomepageStats (Singleton)
```typescript
interface HomepageStats {
  happyTravelersCount: number;
  happyTravelersSuffix: string;
  destinationsCount: number;
  positiveFeedbackPercent: number;
  yearsExperience: number;
  tripsBooked: string;
  partnerHotels: string;
  userRating: number;
}
```

### Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Sanity CMS  │────▶│ sanity.client│────▶│  Components  │
│  (Content)   │     │  (GROQ)      │     │  (UI)        │
└──────────────┘     └──────────────┘     └──────────────┘
       │                                         │
       │                                         │
       ▼                                         ▼
┌──────────────┐                         ┌──────────────┐
│  siteData.ts │◀────── Fallback ───────│  Local Mock  │
│  (Mock Data) │                         │  (Dev Mode)  │
└──────────────┘                         └──────────────┘
```

---

## Authentication System

### NextAuth.js Configuration

```
┌─────────────────────────────────────────────┐
│              NextAuth.js                     │
│  ┌─────────────────────────────────────┐    │
│  │  Providers                           │    │
│  │  - GoogleProvider (OAuth)            │    │
│  │  - CredentialsProvider (Email/Pass)  │    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │  Session Strategy: JWT               │    │
│  │  - 30 day expiration                 │    │
│  │  - Role-based access                 │    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │  Custom Callbacks                    │    │
│  │  - jwt: Add user role to token       │    │
│  │  - session: Expose role to client    │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### Role Hierarchy

```typescript
type UserRole = 'user' | 'moderator' | 'admin';

const roleHierarchy = {
  user: 1,
  moderator: 2,
  admin: 3,
};
```

### Auth Utilities

| Function | Purpose | Usage |
|----------|---------|-------|
| `getSession()` | Get current session | Server Components |
| `requireAuth()` | Redirect if not logged in | Protected pages |
| `requireRole(role)` | Check role & redirect | Admin pages |
| `isAuthenticated()` | Boolean auth check | Conditional logic |

---

## CMS Integration

### Sanity Studio

The Sanity Studio is embedded at `/studio` using:

```typescript
// src/app/studio/[[...tool]]/page.tsx
'use client';
import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

### GROQ Queries

Centralized in `sanity.client.ts`:

```typescript
export const queries = {
  tourPackages: `*[_type == "tourPackage"] | order(featured desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    price,
    // ...
  }`,
};
```

### Image Optimization

```typescript
import { urlFor } from '@/sanity';

// Generate optimized image URL
const imageUrl = urlFor(post.mainImage)
  .width(800)
  .height(600)
  .format('webp')
  .url();
```

---

## Component Architecture

### Component Pattern

Each component follows this structure:

```
ComponentName/
├── ComponentName.tsx          # Component logic
├── ComponentName.module.scss  # Scoped styles
└── index.ts                   # Barrel export
```

### Props Interface Pattern

```typescript
interface ComponentNameProps {
  content: ContentType;      // Required data
  variant?: 'default' | 'featured';  // Optional variant
  className?: string;        // Optional custom class
}
```

### Client vs Server Components

| Type | Use Case | Examples |
|------|----------|----------|
| Server | Data fetching, no interactivity | `page.tsx`, data display |
| Client | Interactivity, hooks, browser APIs | Navbar, forms, carousels |

---

## Performance Considerations

### Image Optimization

- All images use Next.js `Image` component
- Lazy loading by default
- Responsive `sizes` attribute
- WebP format via Sanity

### Code Splitting

- Components are lazy-loaded where appropriate
- Route-based splitting via App Router
- Tree-shaking for Lucide icons

### CSS

- SCSS compiled to optimized CSS at build time
- CSS Modules prevent style conflicts
- No runtime CSS-in-JS overhead

### Caching

- Sanity CDN for production
- Static generation where possible
- Revalidation for dynamic content

---

## Future Enhancements

1. **Phase 3: User Features**
   - User profiles
   - Booking system
   - Wishlist functionality

2. **Phase 4: Advanced Features**
   - Multi-language support (i18n)
   - Advanced search with filters
   - Payment integration

3. **Phase 5: Analytics & Optimization**
   - Analytics dashboard
   - A/B testing
   - Performance monitoring

---

## Contributing

See [README.md](./README.md) for contribution guidelines.

---

*Last updated: January 2025*
