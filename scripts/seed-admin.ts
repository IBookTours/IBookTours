/**
 * Admin User Seed Script
 *
 * Creates the first admin user in the database.
 *
 * Usage:
 *   ADMIN_PASSWORD=yourpassword npx tsx scripts/seed-admin.ts
 *
 * Environment Variables:
 *   ADMIN_EMAIL - Admin email (default: admin@ibooktours.com)
 *   ADMIN_PASSWORD - Required. The admin password.
 *   DATABASE_URL - Required. Neon database connection string.
 */

import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';

// Define users table inline to avoid import resolution issues
import {
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  uuid,
} from 'drizzle-orm/pg-core';

const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }),
  passwordHash: text('password_hash'),
  role: varchar('role', { length: 20 }).default('user').notNull(),
  emailVerified: boolean('email_verified').default(false),
  image: text('image'),
  provider: varchar('provider', { length: 50 }),
  providerId: varchar('provider_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

const SALT_ROUNDS = 12;

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ibooktours.com';
  const adminPassword = process.env.ADMIN_PASSWORD;
  const databaseUrl = process.env.DATABASE_URL;

  console.log('');
  console.log('=================================');
  console.log('  IBookTours Admin Seed Script');
  console.log('=================================');
  console.log('');

  // Validate required environment variables
  if (!adminPassword) {
    console.error('ERROR: ADMIN_PASSWORD environment variable is required');
    console.error('');
    console.error('Usage:');
    console.error('  ADMIN_PASSWORD=yourpassword npx tsx scripts/seed-admin.ts');
    console.error('');
    console.error('Or set it in your shell:');
    console.error('  export ADMIN_PASSWORD=yourpassword');
    console.error('  npx tsx scripts/seed-admin.ts');
    console.error('');
    process.exit(1);
  }

  if (!databaseUrl) {
    console.error('ERROR: DATABASE_URL environment variable is required');
    console.error('');
    console.error('Get your connection string from https://console.neon.tech/');
    console.error('');
    process.exit(1);
  }

  console.log(`Admin email: ${adminEmail}`);
  console.log(`Database: ${databaseUrl.substring(0, 30)}...`);
  console.log('');

  try {
    // Initialize database connection
    const sql = neon(databaseUrl);
    const db = drizzle(sql);

    // Check if admin already exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    if (existing.length > 0) {
      console.log(`Admin user already exists: ${adminEmail}`);
      console.log(`ID: ${existing[0].id}`);
      console.log('');
      console.log('No changes made.');
      process.exit(0);
    }

    // Hash password
    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);

    // Create admin user
    const adminId = randomUUID();
    const now = new Date();

    console.log('Creating admin user...');
    await db.insert(users).values({
      id: adminId,
      email: adminEmail,
      name: 'Admin',
      passwordHash,
      role: 'admin',
      emailVerified: true,
      provider: 'credentials',
      createdAt: now,
      updatedAt: now,
    });

    console.log('');
    console.log('=================================');
    console.log('  Admin user created successfully');
    console.log('=================================');
    console.log('');
    console.log(`  Email: ${adminEmail}`);
    console.log(`  ID: ${adminId}`);
    console.log(`  Role: admin`);
    console.log('');
    console.log('You can now log in at /login with these credentials.');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('Failed to create admin user:');
    console.error(error);
    console.error('');
    console.error('Make sure:');
    console.error('1. DATABASE_URL is correct');
    console.error('2. Database tables exist (run `npm run db:push`)');
    console.error('3. Network connection is available');
    console.error('');
    process.exit(1);
  }
}

seedAdmin();
