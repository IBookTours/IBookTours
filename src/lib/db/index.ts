/**
 * Database Connection - Neon Postgres with Drizzle ORM
 *
 * This module provides a connection to Neon's serverless Postgres database.
 * Uses HTTP-based connections for optimal serverless performance.
 *
 * Usage:
 * ```typescript
 * import { db, users, bookings } from '@/lib/db';
 * import { eq } from 'drizzle-orm';
 *
 * // Query example
 * const user = await db.query.users.findFirst({
 *   where: eq(users.email, 'test@example.com'),
 * });
 *
 * // Insert example
 * const [newUser] = await db.insert(users).values({
 *   email: 'new@example.com',
 *   name: 'New User',
 * }).returning();
 * ```
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { isDemoMode } from '@/lib/env';

// Check if database URL is configured
const DATABASE_URL = process.env.DATABASE_URL;

// Create SQL client (only if DATABASE_URL is set)
const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

// Create Drizzle instance with schema (or null if not configured)
export const db = sql
  ? drizzle(sql, { schema })
  : null;

/**
 * Check if database is configured and available
 */
export function isDatabaseConfigured(): boolean {
  return !!DATABASE_URL && !isDemoMode();
}

/**
 * Get database instance or throw error if not configured
 * Use this when database is required (not optional)
 */
export function requireDb() {
  if (!db) {
    throw new Error(
      'Database not configured. Set DATABASE_URL environment variable.'
    );
  }
  return db;
}

// Re-export schema for convenience
export * from './schema';

// Re-export commonly used Drizzle operators
export { eq, ne, gt, gte, lt, lte, and, or, like, ilike, inArray, isNull, isNotNull, desc, asc } from 'drizzle-orm';
