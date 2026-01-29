/**
 * Drizzle Kit Configuration
 *
 * Used for database migrations and schema management.
 *
 * Commands:
 * - npm run db:generate - Generate migration files
 * - npm run db:push - Push schema changes to database (dev only)
 * - npm run db:studio - Open Drizzle Studio for database management
 */

import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required for migrations');
}

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  // Only include tables we manage
  tablesFilter: ['users', 'bookings', 'password_reset_tokens', 'email_verification_tokens', 'newsletter_subscribers', 'contact_submissions'],
} satisfies Config;
