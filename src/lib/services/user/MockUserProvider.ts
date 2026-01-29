/**
 * Mock User Provider - Demo Mode Implementation
 *
 * Used when DATABASE_URL is not configured.
 * Provides in-memory user storage for development/demo purposes.
 */

import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { BaseService } from '../base/BaseService';
import type { User } from '@/lib/db/schema';
import type {
  IUserService,
  CreateUserParams,
  CreateUserResult,
  FindOrCreateUserParams,
  PasswordResetResult,
} from './UserService';

// In-memory storage for demo mode
const mockUsers: Map<string, User> = new Map();
const mockPasswordResetTokens: Map<string, { userId: string; expiresAt: Date; used: boolean }> = new Map();

// Pre-populate with demo users
function initDemoUsers() {
  if (mockUsers.size === 0) {
    const demoUser: User = {
      id: 'demo-user-id',
      email: 'demo@ibooktours.com',
      name: 'Demo User',
      passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.r3o.qR3Q6Z5VzKi', // demo123
      role: 'user',
      emailVerified: true,
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80',
      provider: 'credentials',
      providerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const adminUser: User = {
      id: 'admin-user-id',
      email: 'admin@ibooktours.com',
      name: 'Admin User',
      passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.r3o.qR3Q6Z5VzKi', // admin123
      role: 'admin',
      emailVerified: true,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80',
      provider: 'credentials',
      providerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUsers.set(demoUser.email, demoUser);
    mockUsers.set(adminUser.email, adminUser);
  }
}

export class MockUserProvider extends BaseService implements IUserService {
  constructor() {
    super('UserService');
    initDemoUsers();
    this.logWarn('Using MockUserProvider - data is not persisted! Configure DATABASE_URL for production.');
  }

  getProviderName(): string {
    return 'mock';
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase().trim();
    this.logDebug('Finding user by email (mock)', { email: normalizedEmail });
    return mockUsers.get(normalizedEmail) ?? null;
  }

  async findById(id: string): Promise<User | null> {
    this.logDebug('Finding user by ID (mock)', { id });
    const users = Array.from(mockUsers.values());
    for (const user of users) {
      if (user.id === id) return user;
    }
    return null;
  }

  async createUser(params: CreateUserParams): Promise<User> {
    const normalizedEmail = params.email.toLowerCase().trim();

    this.logInfo('Creating new user (mock)', { email: normalizedEmail });

    if (mockUsers.has(normalizedEmail)) {
      throw new Error(`User with email ${normalizedEmail} already exists`);
    }

    let passwordHash: string | null = null;
    if (params.password) {
      passwordHash = await bcrypt.hash(params.password, 12);
    }

    const newUser: User = {
      id: `user-${randomBytes(8).toString('hex')}`,
      email: normalizedEmail,
      name: params.name ?? null,
      passwordHash,
      role: params.role ?? 'user',
      emailVerified: false,
      image: null,
      provider: params.provider ?? 'credentials',
      providerId: params.providerId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUsers.set(normalizedEmail, newUser);
    this.logInfo('User created successfully (mock)', { userId: newUser.id });

    return newUser;
  }

  async findOrCreateUser(params: FindOrCreateUserParams): Promise<CreateUserResult> {
    const normalizedEmail = params.email.toLowerCase().trim();

    const existingUser = await this.findByEmail(normalizedEmail);
    if (existingUser) {
      return { user: existingUser, isNew: false };
    }

    if (!params.autoCreateWithTempPassword) {
      throw new Error(`User with email ${normalizedEmail} not found`);
    }

    const tempPassword = randomBytes(16).toString('hex');
    const newUser = await this.createUser({
      email: normalizedEmail,
      name: params.name,
      password: tempPassword,
      role: 'user',
    });

    return {
      user: newUser,
      isNew: true,
      tempPassword,
    };
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    this.logInfo('Updating password (mock)', { userId });

    const entries = Array.from(mockUsers.entries());
    for (const [email, user] of entries) {
      if (user.id === userId) {
        user.passwordHash = await bcrypt.hash(newPassword, 12);
        user.updatedAt = new Date();
        mockUsers.set(email, user);
        return;
      }
    }

    throw new Error('User not found');
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user.passwordHash) return false;
    return bcrypt.compare(password, user.passwordHash);
  }

  async generatePasswordResetToken(userId: string): Promise<PasswordResetResult> {
    this.logInfo('Generating password reset token (mock)', { userId });

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    mockPasswordResetTokens.set(token, { userId, expiresAt, used: false });

    return { token, expiresAt };
  }

  async verifyPasswordResetToken(token: string): Promise<{ userId: string } | null> {
    const record = mockPasswordResetTokens.get(token);

    if (!record || record.used || new Date() > record.expiresAt) {
      return null;
    }

    record.used = true;
    mockPasswordResetTokens.set(token, record);

    return { userId: record.userId };
  }

  async markEmailVerified(userId: string): Promise<void> {
    this.logInfo('Marking email as verified (mock)', { userId });

    const entries = Array.from(mockUsers.entries());
    for (const [email, user] of entries) {
      if (user.id === userId) {
        user.emailVerified = true;
        user.updatedAt = new Date();
        mockUsers.set(email, user);
        return;
      }
    }
  }
}
