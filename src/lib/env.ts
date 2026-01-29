/**
 * Environment Variable Validation
 *
 * Centralized validation of all environment variables at startup.
 * Uses Zod for type-safe schema validation.
 */

import { z } from 'zod';

/**
 * Server-side environment variables schema
 * These are only available on the server
 */
const serverEnvSchema = z.object({
  // Authentication (required in production)
  NEXTAUTH_SECRET: z
    .string()
    .min(1, 'NEXTAUTH_SECRET is required')
    .optional()
    .refine(
      (val) => process.env.NODE_ENV !== 'production' || !!val,
      'NEXTAUTH_SECRET is required in production'
    ),
  NEXTAUTH_URL: z.string().url().optional(),

  // Application mode
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DEMO_MODE: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),

  // Payment (Stripe)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Email (Brevo/Sendinblue)
  BREVO_API_KEY: z.string().optional(),
  BREVO_SENDER_EMAIL: z.string().email().optional(),
  BREVO_SENDER_NAME: z.string().optional(),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Google Calendar Sync
  GOOGLE_CALENDAR_CLIENT_ID: z.string().optional(),
  GOOGLE_CALENDAR_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALENDAR_REFRESH_TOKEN: z.string().optional(),
  GOOGLE_CALENDAR_ADMIN_CALENDAR_ID: z.string().optional(),

  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional(),
});

/**
 * Client-side environment variables schema
 * These are exposed to the browser (NEXT_PUBLIC_ prefix)
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default('ITravelTours'),
});

/**
 * Combined environment schema
 */
const envSchema = serverEnvSchema.merge(clientEnvSchema);

export type Env = z.infer<typeof envSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Validated environment variables
 */
let validatedEnv: Env | null = null;

/**
 * Validates environment variables and returns typed config
 * Throws on validation failure in production
 */
export const validateEnv = (): Env => {
  if (validatedEnv) {
    return validatedEnv;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(errors)
      .map(([key, messages]) => `  ${key}: ${messages?.join(', ')}`)
      .join('\n');

    const message = `Environment validation failed:\n${errorMessages}`;

    if (process.env.NODE_ENV === 'production') {
      throw new Error(message);
    } else {
      console.warn(`\n⚠️ ${message}\n`);
      // In development, return partial env with defaults
      validatedEnv = envSchema.parse({
        ...process.env,
        NODE_ENV: process.env.NODE_ENV || 'development',
        DEMO_MODE: process.env.DEMO_MODE || 'true',
      });
      return validatedEnv;
    }
  }

  validatedEnv = result.data;
  return validatedEnv;
};

/**
 * Get validated environment config
 * Call this instead of accessing process.env directly
 */
export const env = (): Env => validateEnv();

/**
 * Check if running in demo mode
 */
export const isDemoMode = (): boolean => {
  const config = env();
  return (
    config.DEMO_MODE ||
    !config.STRIPE_SECRET_KEY ||
    !config.BREVO_API_KEY
  );
};

/**
 * Check if running in production
 */
export const isProduction = (): boolean => env().NODE_ENV === 'production';

/**
 * Check if a feature is configured (has required env vars)
 */
export const isFeatureConfigured = {
  stripe: (): boolean => !!env().STRIPE_SECRET_KEY,
  brevo: (): boolean => !!env().BREVO_API_KEY,
  googleAuth: (): boolean => !!env().GOOGLE_CLIENT_ID && !!env().GOOGLE_CLIENT_SECRET,
  googleCalendar: (): boolean =>
    !!env().GOOGLE_CALENDAR_CLIENT_ID &&
    !!env().GOOGLE_CALENDAR_CLIENT_SECRET &&
    !!env().GOOGLE_CALENDAR_REFRESH_TOKEN,
};

// Validate on module load in production
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  validateEnv();
}
