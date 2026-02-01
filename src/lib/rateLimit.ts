// ============================================
// RATE LIMITING UTILITY
// ============================================
// Distributed rate limiter supporting both in-memory (dev) and Redis (production)
//
// For production with multiple serverless instances, set up Upstash Redis:
// 1. Create free account at https://upstash.com/
// 2. Create a Redis database
// 3. Add environment variables:
//    UPSTASH_REDIS_REST_URL=your-url
//    UPSTASH_REDIS_REST_TOKEN=your-token
//
// Rate limits can be customized via environment variables:
// - RATE_LIMIT_AUTH_MAX (default: 10)
// - RATE_LIMIT_CONTACT_MAX (default: 5)
// - RATE_LIMIT_NEWSLETTER_MAX (default: 3)
// - RATE_LIMIT_PAYMENT_MAX (default: 10)
// ============================================

import { Redis } from '@upstash/redis';
import { createLogger } from '@/lib/logger';

const logger = createLogger('RateLimit');

// ============================================
// REDIS CLIENT (lazy initialization)
// ============================================
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      redisClient = new Redis({ url, token });
      logger.info('Redis rate limiting enabled');
      return redisClient;
    } catch (error) {
      logger.error('Failed to initialize Redis client', error);
      return null;
    }
  }

  return null;
}

// ============================================
// IN-MEMORY FALLBACK
// ============================================
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let cleanupTimer: NodeJS.Timeout | null = null;

function startCleanup() {
  if (cleanupTimer) return;

  cleanupTimer = setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((entry, key) => {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key);
      }
    });
  }, CLEANUP_INTERVAL);

  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }
}

startCleanup();

// ============================================
// TYPES & CONFIGS
// ============================================
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

const getEnvInt = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

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

// ============================================
// REDIS RATE LIMITING
// ============================================
async function checkRateLimitRedis(
  identifier: string,
  path: string,
  config: RateLimitConfig,
  redis: Redis
): Promise<RateLimitResult> {
  const keyGenerator = config.keyGenerator || ((ip, p) => `${ip}:${p}`);
  const key = `ratelimit:${keyGenerator(identifier, path)}`;
  const now = Date.now();

  try {
    // Increment counter atomically
    const current = await redis.incr(key);

    if (current === 1) {
      // First request in window, set expiry
      await redis.pexpire(key, config.windowMs);
    }

    // Get TTL to calculate reset time
    const ttl = await redis.pttl(key);
    const resetTime = now + (ttl > 0 ? ttl : config.windowMs);

    return {
      allowed: current <= config.maxRequests,
      remaining: Math.max(0, config.maxRequests - current),
      resetTime,
      current,
    };
  } catch (error) {
    logger.error('Redis rate limit check failed, falling back to allow', error);
    // On Redis error, allow the request (fail open)
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetTime: now + config.windowMs,
      current: 0,
    };
  }
}

// ============================================
// IN-MEMORY RATE LIMITING
// ============================================
function checkRateLimitMemory(
  identifier: string,
  path: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const keyGenerator = config.keyGenerator || ((ip, p) => `${ip}:${p}`);
  const key = keyGenerator(identifier, path);

  let entry = rateLimitStore.get(key);

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

  entry.count++;

  return {
    allowed: entry.count <= config.maxRequests,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetTime: entry.resetTime,
    current: entry.count,
  };
}

// ============================================
// MAIN RATE LIMIT FUNCTION
// ============================================
/**
 * Check if a request should be rate limited
 * Uses Redis if available, falls back to in-memory
 */
export async function checkRateLimitAsync(
  identifier: string,
  path: string,
  config: RateLimitConfig = RATE_LIMITS.default
): Promise<RateLimitResult> {
  const redis = getRedisClient();

  if (redis) {
    return checkRateLimitRedis(identifier, path, config, redis);
  }

  return checkRateLimitMemory(identifier, path, config);
}

/**
 * Synchronous rate limit check (in-memory only)
 * @deprecated Use checkRateLimitAsync for production with Redis support
 */
export function checkRateLimit(
  identifier: string,
  path: string,
  config: RateLimitConfig = RATE_LIMITS.default
): RateLimitResult {
  return checkRateLimitMemory(identifier, path, config);
}

// ============================================
// UTILITIES
// ============================================
/**
 * Get client IP from Next.js request headers
 */
export function getClientIP(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
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
 * Create a rate limit exceeded response
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
