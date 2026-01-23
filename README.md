# ITravel - Travel Agency Landing Page

A modern, responsive travel agency landing page built with Next.js 14, TypeScript, and SCSS Modules. Features Sanity CMS for content management and NextAuth.js for authentication.

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- A Sanity.io account (for CMS)
- Google OAuth credentials (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ITravel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

   Fill in your credentials (see Environment Variables section below).

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   - Main site: [http://localhost:3000](http://localhost:3000)
   - Sanity Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

## 📋 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# ============================================
# SANITY CMS
# ============================================
# Get these from https://www.sanity.io/manage
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# For preview/draft content (optional)
SANITY_API_READ_TOKEN=your_read_token

# ============================================
# NEXTAUTH.JS
# ============================================
# Generate a secret: openssl rand -base64 32
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# ============================================
# GOOGLE OAUTH
# ============================================
# Get these from https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Getting Sanity Credentials

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Create a new project or select existing one
3. Copy the Project ID
4. For the read token, go to API > Tokens > Add token

### Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
ITravel/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/auth/          # NextAuth.js API routes
│   │   ├── studio/            # Embedded Sanity Studio
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── Navbar/
│   │   ├── HeroSection/
│   │   ├── DestinationCard/
│   │   └── ...
│   ├── data/                  # Mock data (CMS fallback)
│   │   └── siteData.ts
│   ├── lib/                   # Utility functions
│   │   ├── auth.ts           # NextAuth configuration
│   │   └── auth-utils.ts     # Auth helper functions
│   ├── sanity/               # Sanity CMS configuration
│   │   ├── schemas/          # Content schemas
│   │   ├── sanity.client.ts  # Sanity client
│   │   └── index.ts
│   ├── styles/               # Global styles
│   │   ├── _variables.scss   # SCSS variables (theming)
│   │   └── globals.scss      # Global styles
│   └── types/                # TypeScript definitions
│       └── index.ts
├── sanity.config.ts          # Sanity Studio configuration
├── next.config.js            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── package.json
```

## 🎨 Theming

The project uses a centralized theming system. To change the color scheme:

1. Open `src/styles/_variables.scss`
2. Modify the `$primary-*` color variables
3. The entire site will update automatically

Example - Change from Blue to Red:
```scss
// Before (Blue)
$primary-500: #3b82f6;
$primary-600: #2563eb;

// After (Red)
$primary-500: #ef4444;
$primary-600: #dc2626;
```

## 🔐 Authentication

The project includes NextAuth.js with:
- **Google OAuth** - Social login
- **Credentials** - Email/password (demo mode)

### Demo Credentials
For development/testing:
- Email: `demo@itravel.com` / Password: `demo123`
- Admin: `admin@itravel.com` / Password: `admin123`

⚠️ **Remove demo credentials before production deployment!**

### Protected Routes
Use the auth utilities in your pages:

```typescript
import { requireAuth, requireAdmin } from '@/lib/auth-utils';

// In a Server Component
export default async function ProtectedPage() {
  const session = await requireAuth(); // Redirects if not logged in
  return <div>Welcome, {session.user.name}</div>;
}
```

## 📝 Content Management

### Sanity Studio
Access the CMS at `/studio` to manage:
- **Tour Packages** - Destinations and travel packages
- **Testimonials** - Customer reviews
- **Homepage Stats** - Site-wide statistics

### Schema Types
- `tourPackage` - Travel destinations with pricing, duration, images
- `testimonial` - Customer reviews with ratings
- `homepageStats` - Singleton for site statistics

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
```bash
npm run build
npm run start
```

## 📄 License

MIT License - See LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Built with ❤️ using Next.js, Sanity, and SCSS Modules
