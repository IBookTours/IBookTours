// ============================================
// NEXTAUTH.JS API ROUTE
// ============================================
// Handles all authentication requests

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export for both GET and POST requests
export { handler as GET, handler as POST };
