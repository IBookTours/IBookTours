// ============================================
// NEXTAUTH.JS CONFIGURATION
// ============================================
// Authentication configuration for IBookTours
// Supports Google OAuth and Credentials (email/password)

import { NextAuthOptions, User, Account, Profile, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { timingSafeEqual } from 'crypto';
import { authLogger } from '@/lib/logger';
import { checkAccountLockout, recordFailedAttempt, clearFailedAttempts } from '@/lib/accountLockout';
import { auditAuth } from '@/lib/auditLog';

/**
 * SECURITY: Constant-time string comparison to prevent timing attacks
 * This ensures password comparison always takes the same amount of time
 */
function safeCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  // Pad shorter string to match length (prevents length-based timing attacks)
  const aBuffer = Buffer.from(a.padEnd(256, '\0'));
  const bBuffer = Buffer.from(b.padEnd(256, '\0'));
  return timingSafeEqual(aBuffer, bBuffer) && a.length === b.length;
}

// Check if we're in demo mode (enables demo accounts)
// SECURITY: Demo mode is disabled in production regardless of DEMO_MODE env var
const DEMO_MODE = process.env.DEMO_MODE === 'true' && process.env.NODE_ENV !== 'production';

// Validate NEXTAUTH_SECRET is set in production
if (!process.env.NEXTAUTH_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXTAUTH_SECRET environment variable is required in production');
  }
  authLogger.warn('NEXTAUTH_SECRET is not set. Using insecure default for development only.');
}

// Import UserRole from shared utilities (re-export for backward compatibility)
import { UserRole } from './auth-shared';
export type { UserRole } from './auth-shared';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
    };
  }

  interface User {
    id: string;
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
  }
}

// Credentials provider (always available)
const credentialsProvider = CredentialsProvider({
  name: 'Email',
  credentials: {
    email: {
      label: 'Email',
      type: 'email',
      placeholder: 'hello@example.com',
    },
    password: {
      label: 'Password',
      type: 'password',
    },
  },
  async authorize(credentials: Partial<Record<string, unknown>> | undefined) {
    // ============================================
    // CREDENTIALS AUTH WITH LOCKOUT PROTECTION
    // ============================================

    if (!credentials?.email || !credentials?.password) {
      authLogger.debug('Missing credentials');
      return null;
    }

    // Ensure credentials are strings
    const email = String(credentials.email).toLowerCase().trim();
    const password = String(credentials.password);

    // SECURITY: Check if account is locked
    const lockoutStatus = await checkAccountLockout(email);
    if (lockoutStatus.isLocked) {
      authLogger.warn('Login attempt on locked account', { email });
      // Don't reveal that account is locked - just return null
      return null;
    }

    authLogger.debug('Attempting login', { email, demoMode: DEMO_MODE });

    // Demo accounts - only available when DEMO_MODE=true is explicitly set
    // SECURITY: Demo credentials from environment variables (not hardcoded)
    // For production, configure DATABASE_URL and real user auth
    if (DEMO_MODE) {
      const demoUserEmail = process.env.DEMO_USER_EMAIL || 'demo@ibooktours.com';
      const demoUserPassword = process.env.DEMO_USER_PASSWORD;
      const adminUserEmail = process.env.DEMO_ADMIN_EMAIL || 'admin@ibooktours.com';
      const adminUserPassword = process.env.DEMO_ADMIN_PASSWORD;

      // Demo user - requires DEMO_USER_PASSWORD to be set
      // SECURITY: Using timing-safe comparison to prevent timing attacks
      if (demoUserPassword && safeCompare(email, demoUserEmail.toLowerCase()) && safeCompare(password, demoUserPassword)) {
        authLogger.info('Demo user login successful', { email });
        await clearFailedAttempts(email); // Clear lockout on success
        auditAuth.loginSuccess('demo-user-id', demoUserEmail);
        return {
          id: 'demo-user-id',
          name: 'Demo User',
          email: demoUserEmail,
          image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80',
          role: 'user' as UserRole,
        };
      }

      // Admin demo user - requires DEMO_ADMIN_PASSWORD to be set
      // SECURITY: Using timing-safe comparison to prevent timing attacks
      if (adminUserPassword && safeCompare(email, adminUserEmail.toLowerCase()) && safeCompare(password, adminUserPassword)) {
        authLogger.info('Admin user login successful', { email });
        await clearFailedAttempts(email); // Clear lockout on success
        auditAuth.loginSuccess('admin-user-id', adminUserEmail);
        return {
          id: 'admin-user-id',
          name: 'Admin User',
          email: adminUserEmail,
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80',
          role: 'admin' as UserRole,
        };
      }

      authLogger.debug('Invalid credentials for demo mode', { email });
    } else {
      // Production mode - implement database auth here
      // Query your database for the user and verify password hash
      authLogger.debug('Demo mode disabled, database auth required');
    }

    // SECURITY: Record failed attempt
    const failedStatus = await recordFailedAttempt(email);
    auditAuth.loginFailed(email, undefined, 'Invalid credentials');
    if (failedStatus.isLocked) {
      authLogger.warn('Account locked after failed attempts', { email });
      auditAuth.accountLocked(email);
    }

    // User not found or invalid credentials
    return null;
  },
});

// Build providers array - Google OAuth only if configured
const hasGoogleOAuth = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

export const authOptions: NextAuthOptions = {
  // Conditionally include Google provider
  providers: hasGoogleOAuth
    ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          // Allow automatic account linking when user signs up with email
          // then later signs in with Google using the same email.
          // Safe for tour bookings as Google verifies email ownership.
          allowDangerousEmailAccountLinking: true,
          authorization: {
            params: {
              prompt: 'consent',
              access_type: 'offline',
              response_type: 'code',
            },
          },
        }),
        credentialsProvider,
      ]
    : [credentialsProvider],

  // Secret for JWT encryption - REQUIRED in production
  secret: process.env.NEXTAUTH_SECRET || 'dev-only-insecure-secret-do-not-use-in-production',

  // Configure session handling
  // SECURITY: Reduced session duration to 4 hours to limit exposure from stolen tokens
  session: {
    strategy: 'jwt',
    maxAge: 4 * 60 * 60, // 4 hours (reduced from 24 hours for better security)
  },

  // JWT configuration
  jwt: {
    maxAge: 4 * 60 * 60, // 4 hours (reduced from 24 hours for better security)
  },

  // SECURITY: Explicit cookie configuration
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.callback-url'
        : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Host-next-auth.csrf-token'
        : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  // Custom pages (optional - uncomment to use)
  pages: {
    signIn: '/auth/signin',
    // signOut: '/auth/signout',
    // error: '/auth/error',
    // verifyRequest: '/auth/verify-request',
    // newUser: '/auth/new-user',
  },

  // Callbacks for customizing behavior
  callbacks: {
    // Called when JWT is created or updated
    async jwt({ token, user, account }: { token: JWT; user?: User; account?: Account | null }): Promise<JWT> {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
      }

      // Handle OAuth sign in
      if (account?.provider === 'google') {
        token.role = 'user'; // Default role for OAuth users
      }

      return token;
    },

    // Called when session is accessed
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },

    // Called on sign in - can be used to restrict access
    async signIn({ user, account, profile }: { user: User; account: Account | null; profile?: Profile }): Promise<boolean> {
      // Allow all sign ins by default
      // You can add custom logic here, e.g., check if email is verified
      // or if the user is on a whitelist

      // Example: Only allow specific email domains
      // if (user.email && !user.email.endsWith('@company.com')) {
      //   return false;
      // }

      return true;
    },

    // Called when redirect is needed
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }): Promise<string> {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  // Events for logging and analytics
  events: {
    async signIn({ user, isNewUser }: { user: User; isNewUser?: boolean }) {
      authLogger.info('User signed in', { email: user.email, isNewUser });
    },
    async signOut({ token }: { token: JWT }) {
      authLogger.info('User signed out', { email: token.email });
    },
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === 'development',
};

// ============================================
// HELPER FUNCTIONS (Re-exported from auth-shared)
// ============================================
// These are re-exported for backward compatibility.
// For client components, import directly from '@/lib/auth-shared'

export { hasRole, getRoleDisplayName, isAdmin, isModerator } from './auth-shared';
