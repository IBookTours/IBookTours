// ============================================
// RATE LIMITING UTILITY
// ============================================
// Simple in-memory rate limiter for API routes
//
// IMPORTANT: This in-memory implementation only works for single-instance deployments.
// For production with multiple serverless instances, migrate to:
// - Vercel KV (Redis-compatible): https://vercel.com/docs/storage/vercel-kv
// - Upstash Redis: https://upstash.com/
//
// Rate limits can be customized via environment variables:
// - RATE_LIMIT_AUTH_MAX (default: 10)
// - RATE_LIMIT_CONTACT_MAX (default: 5)
// - RATE_LIMIT_NEWSLETTER_MAX (default: 3)
// - RATE_LIMIT_PAYMENT_MAX (default: 10)

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;

let cleanupTimer: NodeJS.Timeout | null = null;

function startCleanup() {
  if (cleanupTimer) return;

  cleanupTimer = setInterval(() => {
    const now = Date.now();
    // Use forEach for compatibility with TypeScript target
    rateLimitStore.forEach((entry, key) => {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key);
      }
    });
  }, CLEANUP_INTERVAL);

  // Allow the timer to not keep the process alive
  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }
}

// Start cleanup on module load
startCleanup();

export interface RateLimitConfig {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum number of requests per window */
  maxRequests: number;
  /** Optional custom key generator */
  keyGenerator?: (ip: string, path: string) => string;
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Remaining requests in the current window */
  remaining: number;
  /** Unix timestamp when the rate limit resets */
  resetTime: number;
  /** Total requests made in the current window */
  current: number;
}

// Helper to parse env var as integer with default
const getEnvInt = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Rate limit configurations - customizable via environment variables
export const RATE_LIMITS = {
  // Contact form: 5 requests per 15 minutes
  contact: {
    windowMs: 15 * 60 * 1000,
    maxRequests: getEnvInt('RATE_LIMIT_CONTACT_MAX', 5),
  },
  // Newsletter: 3 requests per hour
  newsletter: {
    windowMs: 60 * 60 * 1000,
    maxRequests: getEnvInt('RATE_LIMIT_NEWSLETTER_MAX', 3),
  },
  // Payment: 10 requests per minute
  payment: {
    windowMs: 60 * 1000,
    maxRequests: getEnvInt('RATE_LIMIT_PAYMENT_MAX', 10),
  },
  // Auth: 10 login attempts per 15 minutes (brute force protection)
  auth: {
    windowMs: 15 * 60 * 1000,
    maxRequests: getEnvInt('RATE_LIMIT_AUTH_MAX', 10),
  },
  // Default: 100 requests per minute
  default: {
    windowMs: 60 * 1000,
    maxRequests: getEnvInt('RATE_LIMIT_DEFAULT_MAX', 100),
  },
};

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (usually IP address)
 * @param path - Request path (used for per-route limiting)
 * @param config - Rate limit configuration
 * @returns Rate limit result with allowed status and metadata
 */
export function checkRateLimit(
  identifier: string,
  path: string,
  config: RateLimitConfig = RATE_LIMITS.default
): RateLimitResult {
  const now = Date.now();
  const keyGenerator = config.keyGenerator || ((ip, p) => `${ip}:${p}`);
  const key = keyGenerator(identifier, path);

  let entry = rateLimitStore.get(key);

  // If no entry or window expired, create new entry
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: entry.resetTime,
      current: 1,
    };
  }

  // Increment counter
  entry.count++;

  const allowed = entry.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);

  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
    current: entry.count,
  };
}

/**
 * Get client IP from Next.js request headers
 * Handles various proxy configurations
 */
export function getClientIP(headers: Headers): string {
  // Check various headers in order of preference
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }

  // Fallback for local development
  return '127.0.0.1';
}

/**
 * Create rate limit response headers
 */
export function getRateLimitHeaders(result: RateLimitResult, config: RateLimitConfig): Record<string, string> {
  return {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetTime.toString(),
    'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
  };
}

/**
 * Helper to create a rate limit exceeded response
 */
export function rateLimitExceededResponse(result: RateLimitResult, config: RateLimitConfig): Response {
  const headers = getRateLimitHeaders(result, config);
  const retryAfterSeconds = Math.ceil((result.resetTime - Date.now()) / 1000);

  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: `Rate limit exceeded. Please try again in ${retryAfterSeconds} seconds.`,
      retryAfter: retryAfterSeconds,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  );
}
