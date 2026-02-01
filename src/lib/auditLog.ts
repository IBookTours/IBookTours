// ============================================
// AUDIT LOGGING
// ============================================
// Tracks security-relevant actions for monitoring and compliance.
// In production, these logs should be forwarded to a SIEM or log aggregator.
//
// Actions logged:
// - User authentication (login, logout, failed attempts)
// - Password changes and resets
// - Admin actions (user management, content changes)
// - Booking operations (create, cancel, refund)
// - Payment events
// ============================================

import { createLogger } from '@/lib/logger';

const auditLogger = createLogger('audit');

export type AuditAction =
  | 'auth.login.success'
  | 'auth.login.failed'
  | 'auth.logout'
  | 'auth.password.reset.request'
  | 'auth.password.reset.complete'
  | 'auth.password.change'
  | 'auth.account.locked'
  | 'user.create'
  | 'user.update'
  | 'user.delete'
  | 'booking.create'
  | 'booking.cancel'
  | 'booking.refund'
  | 'payment.intent.create'
  | 'payment.success'
  | 'payment.failed'
  | 'admin.access'
  | 'admin.content.update'
  | 'security.csrf.failed'
  | 'security.ratelimit.exceeded'
  | 'security.honeypot.triggered';

export interface AuditEntry {
  action: AuditAction;
  userId?: string;
  userEmail?: string;
  targetId?: string;
  targetType?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  success: boolean;
  reason?: string;
}

/**
 * Log an audit event
 *
 * Usage:
 * ```typescript
 * audit({
 *   action: 'auth.login.success',
 *   userId: user.id,
 *   userEmail: user.email,
 *   ip: clientIP,
 *   success: true,
 * });
 * ```
 */
export function audit(entry: AuditEntry): void {
  const logData = {
    ...entry,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  };

  // Use appropriate log level based on success/action type
  if (!entry.success || entry.action.includes('failed') || entry.action.includes('locked')) {
    auditLogger.warn(`AUDIT: ${entry.action}`, logData);
  } else if (entry.action.startsWith('security.')) {
    auditLogger.warn(`AUDIT: ${entry.action}`, logData);
  } else {
    auditLogger.info(`AUDIT: ${entry.action}`, logData);
  }
}

/**
 * Create an audit logger bound to a specific request context
 */
export function createAuditContext(ip?: string, userAgent?: string) {
  return {
    log: (entry: Omit<AuditEntry, 'ip' | 'userAgent'>) =>
      audit({ ...entry, ip, userAgent }),
  };
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

export const auditAuth = {
  loginSuccess: (userId: string, email: string, ip?: string) =>
    audit({ action: 'auth.login.success', userId, userEmail: email, ip, success: true }),

  loginFailed: (email: string, ip?: string, reason?: string) =>
    audit({ action: 'auth.login.failed', userEmail: email, ip, success: false, reason }),

  logout: (userId: string, email: string) =>
    audit({ action: 'auth.logout', userId, userEmail: email, success: true }),

  passwordResetRequest: (email: string, ip?: string) =>
    audit({ action: 'auth.password.reset.request', userEmail: email, ip, success: true }),

  passwordResetComplete: (userId: string, email: string) =>
    audit({ action: 'auth.password.reset.complete', userId, userEmail: email, success: true }),

  accountLocked: (email: string, ip?: string) =>
    audit({ action: 'auth.account.locked', userEmail: email, ip, success: false, reason: 'Too many failed attempts' }),
};

export const auditBooking = {
  create: (userId: string, bookingId: string, tourId: string) =>
    audit({
      action: 'booking.create',
      userId,
      targetId: bookingId,
      targetType: 'booking',
      metadata: { tourId },
      success: true,
    }),

  cancel: (userId: string, bookingId: string, reason?: string) =>
    audit({
      action: 'booking.cancel',
      userId,
      targetId: bookingId,
      targetType: 'booking',
      success: true,
      reason,
    }),
};

export const auditPayment = {
  intentCreate: (userId: string, bookingId: string, amount: number) =>
    audit({
      action: 'payment.intent.create',
      userId,
      targetId: bookingId,
      targetType: 'booking',
      metadata: { amount },
      success: true,
    }),

  success: (userId: string, bookingId: string, paymentIntentId: string) =>
    audit({
      action: 'payment.success',
      userId,
      targetId: bookingId,
      targetType: 'booking',
      metadata: { paymentIntentId },
      success: true,
    }),

  failed: (userId: string, bookingId: string, reason: string) =>
    audit({
      action: 'payment.failed',
      userId,
      targetId: bookingId,
      targetType: 'booking',
      success: false,
      reason,
    }),
};

export const auditSecurity = {
  csrfFailed: (ip?: string, path?: string) =>
    audit({ action: 'security.csrf.failed', ip, metadata: { path }, success: false }),

  rateLimitExceeded: (ip?: string, path?: string) =>
    audit({ action: 'security.ratelimit.exceeded', ip, metadata: { path }, success: false }),

  honeypotTriggered: (ip?: string, path?: string) =>
    audit({ action: 'security.honeypot.triggered', ip, metadata: { path }, success: false }),
};
