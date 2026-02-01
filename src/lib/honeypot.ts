// ============================================
// HONEYPOT BOT PROTECTION
// ============================================
// Simple honeypot mechanism to catch spam bots.
//
// How it works:
// 1. Add a hidden field to your form (e.g., "website" or "company")
// 2. CSS hides this field from real users
// 3. Bots fill it out automatically
// 4. If the field has a value, we reject the submission
//
// Frontend usage:
// <input
//   type="text"
//   name="website"
//   style={{ position: 'absolute', left: '-9999px' }}
//   tabIndex={-1}
//   autoComplete="off"
// />
// ============================================

import { createLogger } from '@/lib/logger';

const logger = createLogger('Honeypot');

// Common honeypot field names that bots are likely to fill
export const HONEYPOT_FIELD_NAMES = ['website', 'company', 'url', 'fax'] as const;

/**
 * Check if a honeypot field was filled (indicating a bot)
 * Returns true if the submission appears to be from a bot
 */
export function isHoneypotTriggered(body: Record<string, unknown>): boolean {
  for (const fieldName of HONEYPOT_FIELD_NAMES) {
    const value = body[fieldName];
    if (value && typeof value === 'string' && value.trim().length > 0) {
      logger.info('Honeypot triggered - likely bot submission', { field: fieldName });
      return true;
    }
  }
  return false;
}

/**
 * Middleware-style honeypot check for API routes
 * Returns a Response if bot detected, null if legitimate
 *
 * Usage in API route:
 * const botResponse = checkHoneypot(body);
 * if (botResponse) return botResponse;
 */
export function checkHoneypot(body: Record<string, unknown>): Response | null {
  if (isHoneypotTriggered(body)) {
    // Return success to not tip off the bot, but don't actually process
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you for your submission!',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  return null;
}
