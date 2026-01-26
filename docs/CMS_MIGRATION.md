# CMS Migration Guide: Payload CMS + Neon PostgreSQL

This document outlines the plan to migrate from static TypeScript data to Payload CMS.

## Current Status

The website currently uses:
- Static TypeScript data files (`src/data/*.ts`)
- Sanity Studio at `/studio` (can be removed after migration)

## Planned Stack

| Component | Technology | Cost |
|-----------|------------|------|
| CMS | Payload CMS (self-hosted) | $0 |
| Database | Neon PostgreSQL (free tier) | $0 |
| Hosting | Vercel (free tier) | $0 |

## Migration Steps

### Step 1: Create Neon Database

1. Go to https://neon.tech
2. Sign up with the business Gmail account
3. Create a new project named "itravel"
4. Copy the connection string

### Step 2: Install Payload CMS

```bash
npm install payload @payloadcms/db-postgres @payloadcms/richtext-lexical
npm install -D @payloadcms/next
```

### Step 3: Environment Variables

Add to Vercel (and `.env.local` for development):

```env
DATABASE_URI=postgresql://user:pass@ep-xxx.neon.tech/itravel?sslmode=require
PAYLOAD_SECRET=generate-a-32-character-secret-key
```

### Step 4: Create Payload Config

Create `payload.config.ts` in the root:

```typescript
import { buildConfig } from 'payload/config';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

export default buildConfig({
  admin: {
    user: 'users',
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
  }),
  editor: lexicalEditor({}),
  collections: [
    // Will be created in Step 5
  ],
  localization: {
    locales: ['en', 'he'],
    defaultLocale: 'en',
  },
});
```

### Step 5: Create Collections

Create collections in `src/payload/collections/`:

| Collection | Replaces Data In |
|------------|------------------|
| Tours | `siteData.tours` |
| VacationPackages | `siteData.vacationPackages` |
| DayTours | `siteData.dayTours` |
| Events | `siteData.events` |
| BlogPosts | `siteData.blogPosts` |
| Testimonials | `siteData.testimonials` |
| Partners | `siteData.partners` |
| FAQs | `helpData.faqs` |
| LegalPages | `legalPages.*` |

### Step 6: Create Admin Route

Create `src/app/(payload)/admin/[[...segments]]/page.tsx`:

```typescript
// Payload admin panel setup
```

### Step 7: Data Fetching Pattern

Update data fetching to use CMS with static fallback:

```typescript
// src/lib/getData.ts
import { tours as staticTours } from '@/data/siteData';

export async function getTours() {
  // Try CMS if configured
  if (process.env.DATABASE_URI && process.env.DATABASE_URI !== 'placeholder') {
    try {
      const payload = await getPayloadClient();
      const { docs } = await payload.find({ collection: 'tours' });
      if (docs.length > 0) return docs;
    } catch (e) {
      console.warn('CMS unavailable, using static data');
    }
  }
  // Fallback to static data
  return staticTours;
}
```

### Step 8: Remove Sanity

After Payload is working:

```bash
npm uninstall sanity next-sanity @sanity/image-url @sanity/vision
```

Remove:
- `src/app/studio/` directory
- `sanity.config.ts` (if exists)
- Sanity-related imports

## Cold Start Handling

Neon PostgreSQL is serverless and scales to zero. First query after idle takes ~5-15 seconds.

**Solutions:**

1. **Accept it** (recommended for small sites)
   - Only affects admin panel after long idle
   - Public pages use cached/static data

2. **Keep warm with cron** (optional)
   ```typescript
   // src/app/api/warmup/route.ts
   export async function GET() {
     await sql`SELECT 1`;
     return Response.json({ status: 'warm' });
   }
   ```

## Content Migration

1. Export static data to JSON
2. Use Payload API to import
3. Verify all content appears correctly
4. Update frontend to fetch from CMS
5. Keep static files as fallback

## Timeline

1. **Demo Phase (current)**: Site works with static data
2. **Post-Approval**: Set up Neon + Payload accounts
3. **Migration**: Import content, verify, go live with CMS

---

*Document created: January 2026*
*Developer: Mahdy Gribkov*
