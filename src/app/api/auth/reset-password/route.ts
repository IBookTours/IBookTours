/**
 * Password Reset Completion API
 *
 * Handles the actual password reset using a valid token.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserService } from '@/lib/services/user';
import { checkRateLimit, getClientIP, rateLimitExceededResponse, RATE_LIMITS } from '@/lib/rateLimit';
import { authLogger } from '@/lib/logger';
import { validateCsrfToken, csrfErrorResponse } from '@/lib/csrf';
import { auditAuth } from '@/lib/auditLog';

// Input validation schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request.headers);
    const rateLimitResult = checkRateLimit(clientIP, '/api/auth/reset-password', RATE_LIMITS.auth);

    if (!rateLimitResult.allowed) {
      authLogger.warn('Password reset completion rate limit exceeded', { clientIP });
      return rateLimitExceededResponse(rateLimitResult, RATE_LIMITS.auth);
    }

    const body = await request.json();

    // SECURITY: Validate CSRF token to prevent cross-site request forgery
    const csrfValid = await validateCsrfToken(request, body);
    if (!csrfValid) {
      authLogger.warn('Invalid CSRF token on password reset completion', { clientIP });
      return csrfErrorResponse();
    }

    // Validate input
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      // SECURITY: Generic error message to prevent information disclosure
      // Don't expose validation details that could help attackers
      return NextResponse.json(
        { error: 'Invalid request. Please check your input and try again.' },
        { status: 400 }
      );
    }

    const { token, password } = validation.data;

    authLogger.info('Password reset completion attempted');

    // Get user service
    const userService = getUserService();

    // Verify token and get user ID
    const tokenResult = await userService.verifyPasswordResetToken(token);

    if (!tokenResult) {
      authLogger.warn('Invalid or expired password reset token');
      return NextResponse.json(
        { error: 'Invalid or expired reset token. Please request a new password reset.' },
        { status: 400 }
      );
    }

    // Update password
    await userService.updatePassword(tokenResult.userId, password);

    authLogger.info('Password reset completed successfully', { userId: tokenResult.userId });

    // Get user email for audit log
    const user = await userService.findById(tokenResult.userId);
    auditAuth.passwordResetComplete(tokenResult.userId, user?.email || 'unknown');

    return NextResponse.json({
      message: 'Password has been reset successfully. You can now sign in with your new password.',
    });
  } catch (error) {
    authLogger.error('Password reset completion error', error);
    return NextResponse.json(
      { error: 'Failed to reset password. Please try again.' },
      { status: 500 }
    );
  }
}
