/**
 * User Service Factory
 *
 * Provides user service instances based on configuration.
 * Uses DatabaseUserProvider when DATABASE_URL is configured,
 * falls back to MockUserProvider for development/demo mode.
 *
 * Usage:
 * ```typescript
 * import { getUserService } from '@/lib/services/user';
 *
 * const userService = getUserService();
 * const user = await userService.findByEmail('test@example.com');
 * ```
 */

import { createLogger } from '@/lib/logger';
import { isDatabaseConfigured } from '@/lib/db';
import { DatabaseUserProvider } from './DatabaseUserProvider';
import { MockUserProvider } from './MockUserProvider';
import type { IUserService } from './UserService';

// Types
export type {
  IUserService,
  CreateUserParams,
  CreateUserResult,
  FindOrCreateUserParams,
  PasswordResetResult,
} from './UserService';

// Providers (for direct use if needed)
export { DatabaseUserProvider } from './DatabaseUserProvider';
export { MockUserProvider } from './MockUserProvider';

const logger = createLogger('UserServiceFactory');

/**
 * User service singleton
 */
let userServiceInstance: IUserService | null = null;

/**
 * Create user service based on configuration
 */
function createUserService(): IUserService {
  if (isDatabaseConfigured()) {
    logger.info('Creating database user service');
    return new DatabaseUserProvider();
  }

  logger.info('Creating mock user service (DATABASE_URL not configured)');
  return new MockUserProvider();
}

/**
 * Get the configured user service
 *
 * This is the primary way to access user functionality.
 * The provider is determined by DATABASE_URL configuration.
 */
export function getUserService(): IUserService {
  if (!userServiceInstance) {
    userServiceInstance = createUserService();
    logger.info('User service initialized', {
      provider: userServiceInstance.getProviderName(),
    });
  }
  return userServiceInstance;
}

/**
 * Reset user service (for testing)
 */
export function resetUserService(): void {
  userServiceInstance = null;
}

/**
 * Default user service instance (for backward compatibility)
 *
 * Prefer using getUserService() for explicit initialization.
 */
export const userService = getUserService();
