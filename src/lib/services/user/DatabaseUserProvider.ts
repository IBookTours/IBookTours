/**
 * Database User Provider - Neon Postgres Implementation
 *
 * Implements IUserService using Drizzle ORM with Neon Postgres.
 */

import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import {
  requireDb,
  users,
  passwordResetTokens,
  eq,
  type User,
} from '@/lib/db';
import { BaseService } from '../base/BaseService';
import type {
  IUserService,
  CreateUserParams,
  CreateUserResult,
  FindOrCreateUserParams,
  PasswordResetResult,
} from './UserService';

// Password hashing configuration
const SALT_ROUNDS = 12;
const PASSWORD_RESET_EXPIRY_HOURS = 24;
const TEMP_PASSWORD_LENGTH = 16;

export class DatabaseUserProvider extends BaseService implements IUserService {
  constructor() {
    super('UserService');
  }

  getProviderName(): string {
    return 'neon-postgres';
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = requireDb();
    const normalizedEmail = email.toLowerCase().trim();

    this.logDebug('Finding user by email', { email: normalizedEmail });

    const user = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    return user ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const db = requireDb();

    this.logDebug('Finding user by ID', { id });

    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    return user ?? null;
  }

  async createUser(params: CreateUserParams): Promise<User> {
    const db = requireDb();
    const normalizedEmail = params.email.toLowerCase().trim();

    this.logInfo('Creating new user', { email: normalizedEmail, provider: params.provider });

    // Check if user already exists
    const existingUser = await this.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new Error(`User with email ${normalizedEmail} already exists`);
    }

    // Hash password if provided
    let passwordHash: string | null = null;
    if (params.password) {
      passwordHash = await bcrypt.hash(params.password, SALT_ROUNDS);
    }

    // Insert user
    const [newUser] = await db
      .insert(users)
      .values({
        email: normalizedEmail,
        name: params.name ?? null,
        passwordHash,
        role: params.role ?? 'user',
        provider: params.provider ?? 'credentials',
        providerId: params.providerId ?? null,
        emailVerified: !!params.provider && params.provider !== 'credentials', // OAuth users are considered verified
      })
      .returning();

    this.logInfo('User created successfully', { userId: newUser.id, email: normalizedEmail });

    return newUser;
  }

  async findOrCreateUser(params: FindOrCreateUserParams): Promise<CreateUserResult> {
    const normalizedEmail = params.email.toLowerCase().trim();

    this.logDebug('Find or create user', { email: normalizedEmail });

    // Try to find existing user
    const existingUser = await this.findByEmail(normalizedEmail);
    if (existingUser) {
      this.logDebug('User found', { userId: existingUser.id });
      return {
        user: existingUser,
        isNew: false,
      };
    }

    // User doesn't exist - create if autoCreate is enabled
    if (!params.autoCreateWithTempPassword) {
      throw new Error(`User with email ${normalizedEmail} not found`);
    }

    // Generate temporary password
    const tempPassword = randomBytes(TEMP_PASSWORD_LENGTH).toString('hex');

    // Create user with temp password
    const newUser = await this.createUser({
      email: normalizedEmail,
      name: params.name,
      password: tempPassword,
      role: 'user',
      provider: 'credentials',
    });

    this.logInfo('Created user with temporary password', { userId: newUser.id });

    return {
      user: newUser,
      isNew: true,
      tempPassword,
    };
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const db = requireDb();

    this.logInfo('Updating password', { userId });

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    this.logInfo('Password updated successfully', { userId });
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user.passwordHash) {
      this.logDebug('User has no password hash', { userId: user.id });
      return false;
    }

    return bcrypt.compare(password, user.passwordHash);
  }

  async generatePasswordResetToken(userId: string): Promise<PasswordResetResult> {
    const db = requireDb();

    this.logInfo('Generating password reset token', { userId });

    // Generate secure token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRY_HOURS * 60 * 60 * 1000);

    // Invalidate any existing tokens for this user
    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.userId, userId));

    // Create new token
    await db.insert(passwordResetTokens).values({
      userId,
      token,
      expiresAt,
    });

    this.logInfo('Password reset token created', { userId, expiresAt });

    return {
      token,
      expiresAt,
    };
  }

  async verifyPasswordResetToken(token: string): Promise<{ userId: string } | null> {
    const db = requireDb();

    this.logDebug('Verifying password reset token');

    const tokenRecord = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });

    if (!tokenRecord) {
      this.logDebug('Token not found');
      return null;
    }

    if (tokenRecord.used) {
      this.logDebug('Token already used');
      return null;
    }

    if (new Date() > tokenRecord.expiresAt) {
      this.logDebug('Token expired');
      return null;
    }

    // Mark token as used
    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, tokenRecord.id));

    this.logInfo('Password reset token verified', { userId: tokenRecord.userId });

    return { userId: tokenRecord.userId };
  }

  async markEmailVerified(userId: string): Promise<void> {
    const db = requireDb();

    this.logInfo('Marking email as verified', { userId });

    await db
      .update(users)
      .set({
        emailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }
}
