# ITravel Documentation

Welcome to the ITravel documentation. This folder contains detailed guides for development, deployment, and troubleshooting.

## Quick Links

- [Main README](../README.md) - Project overview and quick start
- [Setup Guide](../SETUP.md) - Step-by-step setup instructions
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | SCSS Modules + CSS Variables |
| Auth | NextAuth.js v4 |
| CMS | Sanity v3 (optional) |
| Payments | Stripe (optional) |
| Email | Brevo (optional) |

## Architecture Overview

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes (contact, payments, webhooks)
│   ├── studio/         # Embedded Sanity Studio
│   └── [pages]/        # Page components
├── components/         # Reusable React components
│   ├── shared/         # Common UI components
│   └── [feature]/      # Feature-specific components
├── data/               # Mock data (CMS fallback)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and services
├── sanity/             # Sanity CMS schemas
├── styles/             # SCSS variables and globals
└── utils/              # Helper functions
```

## Theming

ITravel uses a dual-theme system with CSS custom properties:

### Light Mode (Honeydew Palette)
- Primary: Punch Red (`#e63946`)
- Background: Honeydew (`#f1faee`)
- Text: Oxford Navy (`#1d3557`)
- Secondary: Cerulean (`#457b9d`)
- Accent: Frosted Blue (`#a8dadc`)

### Dark Mode (Space Indigo Palette)
- Primary: Strawberry Red (`#ef233c`)
- Background: Space Indigo (`#2b2d42`)
- Text: Platinum (`#edf2f4`)
- Secondary: Lavender Grey (`#8d99ae`)

## Responsive Breakpoints

```scss
$breakpoint-xs: 375px;   // Small phones (iPhone SE)
$breakpoint-sm: 640px;   // Large phones
$breakpoint-md: 768px;   // Tablets
$breakpoint-lg: 1024px;  // Laptops
$breakpoint-xl: 1280px;  // Desktops
$breakpoint-2xl: 1536px; // Large desktops
```

## Key Features

- **Form Validation** - Email and phone validation with regex patterns
- **Accessibility Widget** - WCAG 2.1 AA compliant with visual, reading, and color options
- **Demo Mode** - Fully functional without external services
- **Remotion Videos** - Programmatic video generation for marketing

## Environment Variables

See [.env.example](../.env.example) for all available configuration options.

## Deployment

Recommended platform: **Vercel**

```bash
# Deploy to production
vercel --prod
```

Or push to GitHub and connect to Vercel for automatic deployments.
