// ============================================
// ACCOUNT LOCKOUT UTILITY
// ============================================
// Protects against brute force login attempts by tracking failed attempts
// and temporarily locking accounts after too many failures.
//
// Uses Redis if available (UPSTASH_REDIS_REST_URL), falls back to in-memory.
// ============================================

import { Redis } from '@upstash/redis';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AccountLockout');

// Configuration
const MAX_FAILED_ATTEMPTS = 5; // Lock after 5 failed attempts
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // Track attempts for 15 minutes

// ============================================
// REDIS CLIENT (shared with rateLimit if available)
// ============================================
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      redisClient = new Redis({ url, token });
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
interface LockoutEntry {
  attempts: number;
  lockedUntil: number | null;
  firstAttempt: number;
}

const lockoutStore = new Map<string, LockoutEntry>();

// Cleanup every 5 minutes
setInterval(() => {
  const now = Date.now();
  lockoutStore.forEach((entry, key) => {
    const windowExpired = now - entry.firstAttempt > ATTEMPT_WINDOW_MS;
    const lockExpired = entry.lockedUntil && now > entry.lockedUntil;
    if (windowExpired && (!entry.lockedUntil || lockExpired)) {
      lockoutStore.delete(key);
    }
  });
}, 5 * 60 * 1000);

// ============================================
// LOCKOUT FUNCTIONS
// ============================================

export interface LockoutStatus {
  isLocked: boolean;
  attemptsRemaining: number;
  lockedUntil: number | null;
}

/**
 * Check if an account is locked
 */
export async function checkAccountLockout(email: string): Promise<LockoutStatus> {
  const normalizedEmail = email.toLowerCase().trim();
  const redis = getRedisClient();

  if (redis) {
    return checkLockoutRedis(normalizedEmail, redis);
  }

  return checkLockoutMemory(normalizedEmail);
}

/**
 * Record a failed login attempt
 */
export async function recordFailedAttempt(email: string): Promise<LockoutStatus> {
  const normalizedEmail = email.toLowerCase().trim();
  const redis = getRedisClient();

  if (redis) {
    return recordFailedAttemptRedis(normalizedEmail, redis);
  }

  return recordFailedAttemptMemory(normalizedEmail);
}

/**
 * Clear failed attempts after successful login
 */
export async function clearFailedAttempts(email: string): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  const redis = getRedisClient();

  if (redis) {
    await clearFailedAttemptsRedis(normalizedEmail, redis);
  } else {
    lockoutStore.delete(normalizedEmail);
  }
}

// ============================================
// REDIS IMPLEMENTATION
// ============================================
async function checkLockoutRedis(email: string, redis: Redis): Promise<LockoutStatus> {
  const lockKey = `lockout:${email}`;
  const attemptsKey = `attempts:${email}`;

  try {
    const [lockedUntil, attempts] = await Promise.all([
      redis.get<number>(lockKey),
      redis.get<number>(attemptsKey),
    ]);

    const now = Date.now();

    if (lockedUntil && now < lockedUntil) {
      return {
        isLocked: true,
        attemptsRemaining: 0,
        lockedUntil,
      };
    }

    const currentAttempts = attempts || 0;
    return {
      isLocked: false,
      attemptsRemaining: Math.max(0, MAX_FAILED_ATTEMPTS - currentAttempts),
      lockedUntil: null,
    };
  } catch (error) {
    logger.error('Redis lockout check failed', error);
    // Fail open - don't lock on Redis errors
    return { isLocked: false, attemptsRemaining: MAX_FAILED_ATTEMPTS, lockedUntil: null };
  }
}

async function recordFailedAttemptRedis(email: string, redis: Redis): Promise<LockoutStatus> {
  const lockKey = `lockout:${email}`;
  const attemptsKey = `attempts:${email}`;

  try {
    // Increment attempts
    const attempts = await redis.incr(attemptsKey);

    // Set expiry on first attempt
    if (attempts === 1) {
      await redis.pexpire(attemptsKey, ATTEMPT_WINDOW_MS);
    }

    // Check if we should lock
    if (attempts >= MAX_FAILED_ATTEMPTS) {
      const lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      await redis.set(lockKey, lockedUntil, { px: LOCKOUT_DURATION_MS });

      logger.warn('Account locked due to failed attempts', { email, attempts });

      return {
        isLocked: true,
        attemptsRemaining: 0,
        lockedUntil,
      };
    }

    return {
      isLocked: false,
      attemptsRemaining: MAX_FAILED_ATTEMPTS - attempts,
      lockedUntil: null,
    };
  } catch (error) {
    logger.error('Redis record failed attempt error', error);
    return { isLocked: false, attemptsRemaining: MAX_FAILED_ATTEMPTS, lockedUntil: null };
  }
}

async function clearFailedAttemptsRedis(email: string, redis: Redis): Promise<void> {
  try {
    await Promise.all([
      redis.del(`lockout:${email}`),
      redis.del(`attempts:${email}`),
    ]);
  } catch (error) {
    logger.error('Redis clear attempts error', error);
  }
}

// ============================================
// IN-MEMORY IMPLEMENTATION
// ============================================
function checkLockoutMemory(email: string): LockoutStatus {
  const entry = lockoutStore.get(email);
  const now = Date.now();

  if (!entry) {
    return { isLocked: false, attemptsRemaining: MAX_FAILED_ATTEMPTS, lockedUntil: null };
  }

  // Check if lock has expired
  if (entry.lockedUntil && now < entry.lockedUntil) {
    return {
      isLocked: true,
      attemptsRemaining: 0,
      lockedUntil: entry.lockedUntil,
    };
  }

  // Check if attempt window has expired
  if (now - entry.firstAttempt > ATTEMPT_WINDOW_MS) {
    lockoutStore.delete(email);
    return { isLocked: false, attemptsRemaining: MAX_FAILED_ATTEMPTS, lockedUntil: null };
  }

  return {
    isLocked: false,
    attemptsRemaining: Math.max(0, MAX_FAILED_ATTEMPTS - entry.attempts),
    lockedUntil: null,
  };
}

function recordFailedAttemptMemory(email: string): LockoutStatus {
  const now = Date.now();
  let entry = lockoutStore.get(email);

  if (!entry || now - entry.firstAttempt > ATTEMPT_WINDOW_MS) {
    entry = { attempts: 0, lockedUntil: null, firstAttempt: now };
  }

  entry.attempts++;

  if (entry.attempts >= MAX_FAILED_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION_MS;
    logger.warn('Account locked due to failed attempts (in-memory)', { email, attempts: entry.attempts });
  }

  lockoutStore.set(email, entry);

  return {
    isLocked: entry.lockedUntil !== null && now < entry.lockedUntil,
    attemptsRemaining: Math.max(0, MAX_FAILED_ATTEMPTS - entry.attempts),
    lockedUntil: entry.lockedUntil,
  };
}
