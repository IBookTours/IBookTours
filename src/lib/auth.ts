// ============================================
// NEXTAUTH.JS CONFIGURATION
// ============================================
// Authentication configuration for ITravel
// Supports Google OAuth and Credentials (email/password)

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

// Define user roles for authorization
export type UserRole = 'user' | 'admin' | 'moderator';

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
  async authorize(credentials) {
    // ============================================
    // PLACEHOLDER LOGIC - REPLACE WITH REAL AUTH
    // ============================================
    // In production, you should:
    // 1. Query your database for the user
    // 2. Verify the password hash
    // 3. Return the user object or null

    if (!credentials?.email || !credentials?.password) {
      return null;
    }

    // Demo user for development
    // REMOVE THIS IN PRODUCTION
    if (
      credentials.email === 'demo@itravel.com' &&
      credentials.password === 'demo123'
    ) {
      return {
        id: 'demo-user-id',
        name: 'Demo User',
        email: 'demo@itravel.com',
        image: 'https://i.pravatar.cc/150?u=demo',
        role: 'user' as UserRole,
      };
    }

    // Admin demo user
    if (
      credentials.email === 'admin@itravel.com' &&
      credentials.password === 'admin123'
    ) {
      return {
        id: 'admin-user-id',
        name: 'Admin User',
        email: 'admin@itravel.com',
        image: 'https://i.pravatar.cc/150?u=admin',
        role: 'admin' as UserRole,
      };
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

  // Secret for JWT encryption - use env or fallback for demo
  secret: process.env.NEXTAUTH_SECRET || 'itravel-demo-secret-change-in-production',

  // Configure session handling
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
    async jwt({ token, user, account }) {
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
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },

    // Called on sign in - can be used to restrict access
    async signIn({ user, account, profile }) {
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
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  // Events for logging and analytics
  events: {
    async signIn({ user, isNewUser }) {
      console.log(`User signed in: ${user.email}, isNewUser: ${isNewUser}`);
    },
    async signOut({ token }) {
      console.log(`User signed out: ${token.email}`);
    },
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === 'development',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if a user has the required role
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    user: 1,
    moderator: 2,
    admin: 3,
  };

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
