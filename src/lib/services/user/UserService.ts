/**
 * User Service - Interface & Types
 *
 * Provides user management operations including:
 * - User creation and lookup
 * - Password management
 * - Token generation for password reset and email verification
 */

import type { User, NewUser } from '@/lib/db/schema';

export interface CreateUserParams {
  email: string;
  name?: string;
  password?: string;
  role?: 'user' | 'admin' | 'moderator';
  provider?: string;
  providerId?: string;
}

export interface CreateUserResult {
  user: User;
  isNew: boolean;
  tempPassword?: string; // Only set if auto-generated
}

export interface FindOrCreateUserParams {
  email: string;
  name?: string;
  autoCreateWithTempPassword?: boolean;
}

export interface PasswordResetResult {
  token: string;
  expiresAt: Date;
}

export interface IUserService {
  /**
   * Find a user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find a user by ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Create a new user
   */
  createUser(params: CreateUserParams): Promise<User>;

  /**
   * Find or create a user (for guest checkout)
   * If user doesn't exist and autoCreateWithTempPassword is true,
   * creates user with a temporary password
   */
  findOrCreateUser(params: FindOrCreateUserParams): Promise<CreateUserResult>;

  /**
   * Update user password
   */
  updatePassword(userId: string, newPassword: string): Promise<void>;

  /**
   * Verify password for a user
   */
  verifyPassword(user: User, password: string): Promise<boolean>;

  /**
   * Generate a password reset token
   */
  generatePasswordResetToken(userId: string): Promise<PasswordResetResult>;

  /**
   * Verify and consume a password reset token
   */
  verifyPasswordResetToken(token: string): Promise<{ userId: string } | null>;

  /**
   * Mark user email as verified
   */
  markEmailVerified(userId: string): Promise<void>;

  /**
   * Get the provider name
   */
  getProviderName(): string;
}
