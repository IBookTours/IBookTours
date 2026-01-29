// ============================================
// NEXTAUTH.JS CONFIGURATION
// ============================================
// Authentication configuration for IBookTours
// Supports Google OAuth and Credentials (email/password)

import { NextAuthOptions, User, Account, Profile, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authLogger } from '@/lib/logger';

// Check if we're in demo mode (enables demo accounts)
const DEMO_MODE = process.env.DEMO_MODE === 'true';

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
    // DEMO MODE AUTH - REPLACE WITH REAL AUTH
    // ============================================
    // In production, you should:
    // 1. Query your database for the user
    // 2. Verify the password hash
    // 3. Return the user object or null

    if (!credentials?.email || !credentials?.password) {
      authLogger.debug('Missing credentials');
      return null;
    }

    // Ensure credentials are strings
    const email = String(credentials.email).toLowerCase().trim();
    const password = String(credentials.password);

    authLogger.debug('Attempting login', { email, demoMode: DEMO_MODE });

    // Demo accounts - available by default when no real database is configured
    // In production with a real database, set DEMO_MODE=false
    const isDemoMode = DEMO_MODE || process.env.NODE_ENV === 'development';

    if (isDemoMode) {
      // Demo user
      if (email === 'demo@ibooktours.com' && password === 'demo123') {
        authLogger.info('Demo user login successful', { email });
        return {
          id: 'demo-user-id',
          name: 'Demo User',
          email: 'demo@ibooktours.com',
          image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80',
          role: 'user' as UserRole,
        };
      }

      // Admin demo user
      if (email === 'admin@ibooktours.com' && password === 'admin123') {
        authLogger.info('Admin user login successful', { email });
        return {
          id: 'admin-user-id',
          name: 'Admin User',
          email: 'admin@ibooktours.com',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80',
          role: 'admin' as UserRole,
        };
      }

      authLogger.debug('Invalid credentials for demo mode', { email });
    } else {
      authLogger.debug('Demo mode disabled, no database configured');
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
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours (reduced from 30 days for security)
  },

  // JWT configuration
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours (reduced from 30 days for security)
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
