# ITravel - Albanian Travel Agency

A modern, production-ready travel agency website built with Next.js 14, TypeScript, and SCSS Modules. Features demo mode for testing, optional Sanity CMS integration, and secure authentication.

**Live Demo:** [https://it-ravel.vercel.app](https://it-ravel.vercel.app)

## Features

- **Responsive Design** - Mobile-first approach with breakpoints for all devices
- **Dark Mode** - System-aware theme with manual toggle
- **Accessibility** - WCAG 2.1 compliant with keyboard navigation and screen reader support
- **Demo Mode** - Fully functional without external services (configurable via env)
- **SEO Optimized** - Structured data, Open Graph, and meta tags
- **Performance** - Optimized images, lazy loading, and code splitting

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | SCSS Modules |
| Auth | NextAuth.js v4 (JWT) |
| CMS | Sanity (optional) |
| Payments | Stripe (optional) |
| Email | Brevo (optional) |
| Hosting | Vercel |

## Quick Start

### Prerequisites

- Node.js 18.17+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ITravel

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Environment Variables

All external services are **optional**. The app runs fully functional in demo mode.

### Required Variables

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_SECRET` | JWT encryption key (generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `NEXTAUTH_URL` | Your site URL (e.g., `https://it-ravel.vercel.app`) |

### Optional Variables

| Variable | Service | Default Behavior |
|----------|---------|------------------|
| `DEMO_MODE` | Authentication | Set to `true` to enable demo accounts |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity CMS | Uses mock data from `src/data/` |
| `GOOGLE_CLIENT_ID` | Google OAuth | Only demo login available |
| `STRIPE_SECRET_KEY` | Stripe | Payments run in demo mode |
| `BREVO_API_KEY` | Brevo | Emails logged to console |

See `.env.example` for the complete list.

## Demo Mode

When `DEMO_MODE=true`, these test accounts are available:

| Account | Email | Password |
|---------|-------|----------|
| User | demo@itravel.com | demo123 |
| Admin | admin@itravel.com | admin123 |

Set `DEMO_MODE=false` or remove it to disable demo accounts in production.

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
ITravel/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── studio/            # Sanity Studio (embedded)
│   │   ├── (pages)/           # Page routes
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   ├── data/                  # Mock data (CMS fallback)
│   ├── lib/                   # Utilities & services
│   │   ├── auth.ts           # NextAuth config
│   │   └── services/         # Payment, Email, CMS
│   ├── sanity/               # Sanity schemas
│   └── styles/               # SCSS variables & globals
├── public/                    # Static assets
├── .env.example              # Environment template
└── SETUP.md                  # No-code setup guide
```

## Theming

### Light Mode
- Background: Honeydew (`#f0f8f1`)
- Text: Oxford Navy (`#0a1628`)
- Accent: Punch Red (`#dc2f2f`)

### Dark Mode
- Background: Space Indigo (`#0a0e1a`)
- Text: Platinum (`#e8e9ea`)
- Accent: Strawberry Red (`#ff4d6d`)

Customize colors in `src/styles/_variables.scss`.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. Add environment variables:
   - `NEXTAUTH_SECRET` (required)
   - `NEXTAUTH_URL` (required)
   - `DEMO_MODE=true` (if you want demo accounts)
4. Deploy

Or use Vercel CLI:

```bash
vercel --prod
```

### Other Platforms

```bash
npm run build
npm run start
```

## Security

- **NEXTAUTH_SECRET** - Required in production, app will fail to start without it
- **No hardcoded secrets** - All sensitive values come from environment
- **Demo mode configurable** - Disable demo accounts by setting `DEMO_MODE=false`
- **HTTPS enforced** - Security headers configured in `next.config.js`
- **JWT tokens** - Secure session management with NextAuth.js

## Cost

This project is designed to run at **$0/month**:

| Service | Free Tier |
|---------|-----------|
| Vercel | Hobby plan (100GB bandwidth) |
| Sanity | 100K API requests/month |
| Brevo | 300 emails/day |
| Stripe | Test mode (no charges) |
| Google OAuth | Free |

## Documentation

- **[SETUP.md](./SETUP.md)** - Step-by-step setup guide (no coding required)
- **[.env.example](./.env.example)** - Environment variable template

## License

MIT License

---

Built with Next.js, Sanity, and SCSS Modules
