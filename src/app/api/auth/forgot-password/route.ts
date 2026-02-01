/**
 * Password Reset Request API
 *
 * Handles forgot password requests by generating a reset token and sending an email.
 * Rate limited to prevent abuse.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserService } from '@/lib/services/user';
import { getEmailService } from '@/lib/services/email';
import { checkRateLimit, getClientIP, rateLimitExceededResponse, RATE_LIMITS } from '@/lib/rateLimit';
import { authLogger } from '@/lib/logger';
import { validateCsrfToken, csrfErrorResponse } from '@/lib/csrf';
import { escapeHtml } from '@/lib/services/email/templates/base';

// Input validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
});

// Always return success to prevent email enumeration
const GENERIC_SUCCESS_RESPONSE = {
  message: 'If an account exists with this email, you will receive a password reset link.',
};

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - stricter for password reset
    const clientIP = getClientIP(request.headers);
    const rateLimitResult = checkRateLimit(clientIP, '/api/auth/forgot-password', RATE_LIMITS.auth);

    if (!rateLimitResult.allowed) {
      authLogger.warn('Password reset rate limit exceeded', { clientIP });
      return rateLimitExceededResponse(rateLimitResult, RATE_LIMITS.auth);
    }

    const body = await request.json();

    // SECURITY: Validate CSRF token to prevent cross-site request forgery
    const csrfValid = await validateCsrfToken(request, body);
    if (!csrfValid) {
      authLogger.warn('Invalid CSRF token on password reset request', { clientIP });
      return csrfErrorResponse();
    }

    // Validate input
    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      // Still return generic response to prevent enumeration
      return NextResponse.json(GENERIC_SUCCESS_RESPONSE);
    }

    const { email } = validation.data;
    const normalizedEmail = email.toLowerCase().trim();

    authLogger.info('Password reset requested', { email: normalizedEmail });

    // Get user service
    const userService = getUserService();

    // Find user by email
    const user = await userService.findByEmail(normalizedEmail);

    if (!user) {
      // User not found, but return success to prevent enumeration
      authLogger.debug('Password reset requested for non-existent email', { email: normalizedEmail });
      return NextResponse.json(GENERIC_SUCCESS_RESPONSE);
    }

    // Generate reset token
    const { token, expiresAt } = await userService.generatePasswordResetToken(user.id);

    // Build reset URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

    // Send password reset email
    const emailService = getEmailService();

    // SECURITY: Escape user name to prevent XSS in email
    const safeName = escapeHtml(user.name || 'there');

    try {
      await emailService.sendEmail({
        to: { email: user.email, name: user.name || undefined },
        subject: 'Reset Your Password - IBookTours',
        htmlContent: `
          <h1>Password Reset Request</h1>
          <p>Hi ${safeName},</p>
          <p>We received a request to reset your password for your IBookTours account.</p>
          <p>Click the link below to set a new password:</p>
          <p><a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 6px;">Reset Password</a></p>
          <p>This link will expire on ${expiresAt.toLocaleString()}.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>Thanks,<br>The IBookTours Team</p>
        `,
      });

      authLogger.info('Password reset email sent', { userId: user.id });
    } catch (emailError) {
      authLogger.error('Failed to send password reset email', emailError);
      // Still return success - don't leak whether email failed
    }

    return NextResponse.json(GENERIC_SUCCESS_RESPONSE);
  } catch (error) {
    authLogger.error('Password reset request error', error);
    // Return generic response even on error
    return NextResponse.json(GENERIC_SUCCESS_RESPONSE);
  }
}
