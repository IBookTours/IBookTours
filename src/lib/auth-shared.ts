/**
 * Auth Shared Utilities - Client-Safe
 *
 * These utilities can be safely imported in both client and server components.
 * They contain no server-side secrets or NextAuth configuration.
 *
 * Use these for:
 * - Client components that need role display/checking
 * - Shared type definitions
 *
 * For server-side auth operations (session, redirects), use auth-utils.ts instead.
 */

/**
 * User role types
 */
export type UserRole = 'user' | 'admin' | 'moderator';

/**
 * Role hierarchy for permission checks
 */
const roleHierarchy: Record<UserRole, number> = {
  user: 1,
  moderator: 2,
  admin: 3,
};

/**
 * Check if a user has the required role level
 *
 * Uses a hierarchy where higher roles include lower role permissions:
 * admin > moderator > user
 *
 * @example
 * hasRole('admin', 'user') // true - admin can do user things
 * hasRole('user', 'admin') // false - user cannot do admin things
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Get the display name for a role
 */
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    user: 'User',
    moderator: 'Moderator',
    admin: 'Administrator',
  };
  return names[role];
}

/**
 * Check if a role is admin level
 */
export function isAdmin(role: UserRole): boolean {
  return role === 'admin';
}

/**
 * Check if a role has moderation privileges
 */
export function isModerator(role: UserRole): boolean {
  return hasRole(role, 'moderator');
}
