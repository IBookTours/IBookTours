/**
 * User Registration API
 *
 * Handles user signup with email and password.
 * Rate limited and CSRF protected.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserService } from '@/lib/services/user';
import { checkRateLimit, getClientIP, rateLimitExceededResponse, RATE_LIMITS } from '@/lib/rateLimit';
import { authLogger } from '@/lib/logger';
import { validateCsrfToken, csrfErrorResponse } from '@/lib/csrf';
import { audit } from '@/lib/auditLog';

// Input validation schema
const signupSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request.headers);
    const rateLimitResult = checkRateLimit(clientIP, '/api/auth/signup', RATE_LIMITS.auth);

    if (!rateLimitResult.allowed) {
      authLogger.warn('Signup rate limit exceeded', { clientIP });
      return rateLimitExceededResponse(rateLimitResult, RATE_LIMITS.auth);
    }

    const body = await request.json();

    // SECURITY: Validate CSRF token
    const csrfValid = await validateCsrfToken(request, body);
    if (!csrfValid) {
      authLogger.warn('Invalid CSRF token on signup', { clientIP });
      return csrfErrorResponse();
    }

    // Validate input
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: 'Invalid input', details: errors },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;
    const normalizedEmail = email.toLowerCase().trim();

    authLogger.info('Signup attempt', { email: normalizedEmail });

    // Get user service
    const userService = getUserService();

    // Check if user already exists
    const existingUser = await userService.findByEmail(normalizedEmail);
    if (existingUser) {
      // Don't reveal whether email exists - use generic message
      authLogger.debug('Signup attempt for existing email', { email: normalizedEmail });
      return NextResponse.json(
        { error: 'Unable to create account. Please try again or sign in if you already have an account.' },
        { status: 400 }
      );
    }

    // Create user
    const newUser = await userService.createUser({
      email: normalizedEmail,
      password,
      name,
      role: 'user',
      provider: 'credentials',
    });

    authLogger.info('User created successfully', { userId: newUser.id, email: normalizedEmail });

    // Audit log
    audit({
      action: 'user.create',
      userId: newUser.id,
      userEmail: normalizedEmail,
      ip: clientIP,
      success: true,
    });

    return NextResponse.json({
      message: 'Account created successfully. You can now sign in.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    authLogger.error('Signup error', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
