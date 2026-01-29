/**
 * Auth Utils - Server-Side Only
 *
 * Server-side authentication utilities for Next.js App Router.
 * These functions use NextAuth's getServerSession and should ONLY be
 * imported in Server Components, API Routes, or Server Actions.
 *
 * WARNING: Do NOT import this file in Client Components ('use client').
 * It will cause build errors due to server-side dependencies.
 *
 * Use these for:
 * - Getting current session in Server Components
 * - Protecting pages with authentication
 * - Role-based access control in API routes
 *
 * For client-safe auth utilities (types, role checks), use auth-shared.ts instead.
 */

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './auth';
import { type UserRole, hasRole } from './auth-shared';

/**
 * Get the current session on the server side
 * Use this in Server Components and API routes
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Check if the user is authenticated
 * Redirects to sign-in page if not
 * Use in protected pages
 */
export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  return session;
}

/**
 * Check if the user has the required role
 * Redirects to home page if not authorized
 */
export async function requireRole(requiredRole: UserRole) {
  const session = await requireAuth();

  if (!hasRole(session.user.role, requiredRole)) {
    redirect('/');
  }

  return session;
}

/**
 * Check if user is admin
 */
export async function requireAdmin() {
  return requireRole('admin');
}

/**
 * Get user from session or null if not authenticated
 * Use when you want to conditionally render based on auth status
 */
export async function getUser() {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Check if user is authenticated (boolean)
 * Use for conditional logic without redirecting
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}
