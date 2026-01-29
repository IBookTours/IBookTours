/**
 * Database Schema - Drizzle ORM with Neon Postgres
 *
 * This file defines all database tables using Drizzle ORM.
 * Run `npm run db:push` to sync schema changes with the database.
 * Run `npm run db:generate` to generate migration files.
 */

import {
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  uuid,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// USERS TABLE
// ============================================
export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 255 }),
    passwordHash: text('password_hash'),
    role: varchar('role', { length: 20 }).default('user').notNull(),
    emailVerified: boolean('email_verified').default(false),
    image: text('image'),
    provider: varchar('provider', { length: 50 }), // 'credentials', 'google', etc.
    providerId: varchar('provider_id', { length: 255 }), // OAuth provider user ID
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index('users_email_idx').on(table.email),
    providerIdx: index('users_provider_idx').on(table.provider, table.providerId),
  })
);

// ============================================
// BOOKINGS TABLE
// ============================================
export const bookings = pgTable(
  'bookings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id),
    tourId: varchar('tour_id', { length: 100 }).notNull(),
    tourName: varchar('tour_name', { length: 255 }).notNull(),
    status: varchar('status', { length: 20 }).default('pending').notNull(),
    // Status values: 'pending', 'confirmed', 'cancelled', 'completed', 'refunded'
    totalAmount: integer('total_amount').notNull(), // in cents
    currency: varchar('currency', { length: 3 }).default('eur').notNull(),
    travelers: integer('travelers').default(1).notNull(),
    selectedDate: timestamp('selected_date'),
    paymentIntentId: varchar('payment_intent_id', { length: 255 }),
    paymentStatus: varchar('payment_status', { length: 20 }).default('pending'),
    // Payment status: 'pending', 'succeeded', 'failed', 'refunded'
    bookerName: varchar('booker_name', { length: 255 }).notNull(),
    bookerEmail: varchar('booker_email', { length: 255 }).notNull(),
    bookerPhone: varchar('booker_phone', { length: 50 }),
    specialRequests: text('special_requests'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('bookings_user_id_idx').on(table.userId),
    statusIdx: index('bookings_status_idx').on(table.status),
    tourIdIdx: index('bookings_tour_id_idx').on(table.tourId),
    paymentIntentIdx: index('bookings_payment_intent_idx').on(table.paymentIntentId),
  })
);

// ============================================
// PASSWORD RESET TOKENS TABLE
// ============================================
export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    token: varchar('token', { length: 255 }).unique().notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    used: boolean('used').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    tokenIdx: index('password_reset_tokens_token_idx').on(table.token),
    userIdIdx: index('password_reset_tokens_user_id_idx').on(table.userId),
  })
);

// ============================================
// EMAIL VERIFICATION TOKENS TABLE
// ============================================
export const emailVerificationTokens = pgTable(
  'email_verification_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    token: varchar('token', { length: 255 }).unique().notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    used: boolean('used').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    tokenIdx: index('email_verification_tokens_token_idx').on(table.token),
  })
);

// ============================================
// NEWSLETTER SUBSCRIBERS TABLE
// ============================================
export const newsletterSubscribers = pgTable(
  'newsletter_subscribers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 255 }),
    subscribed: boolean('subscribed').default(true),
    source: varchar('source', { length: 50 }), // 'footer', 'popup', 'checkout', etc.
    createdAt: timestamp('created_at').defaultNow().notNull(),
    unsubscribedAt: timestamp('unsubscribed_at'),
  },
  (table) => ({
    emailIdx: index('newsletter_subscribers_email_idx').on(table.email),
  })
);

// ============================================
// CONTACT SUBMISSIONS TABLE
// ============================================
export const contactSubmissions = pgTable(
  'contact_submissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    subject: varchar('subject', { length: 255 }).notNull(),
    message: text('message').notNull(),
    status: varchar('status', { length: 20 }).default('new').notNull(),
    // Status: 'new', 'read', 'replied', 'archived'
    repliedAt: timestamp('replied_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    statusIdx: index('contact_submissions_status_idx').on(table.status),
  })
);

// ============================================
// RELATIONS
// ============================================
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  passwordResetTokens: many(passwordResetTokens),
  emailVerificationTokens: many(emailVerificationTokens),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id],
  }),
}));

export const emailVerificationTokensRelations = relations(emailVerificationTokens, ({ one }) => ({
  user: one(users, {
    fields: [emailVerificationTokens.userId],
    references: [users.id],
  }),
}));

// ============================================
// TYPE EXPORTS
// ============================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type NewPasswordResetToken = typeof passwordResetTokens.$inferInsert;
export type EmailVerificationToken = typeof emailVerificationTokens.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
