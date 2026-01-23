'use client';

// ============================================
// AUTH PROVIDER COMPONENT
// ============================================
// Wraps the application with NextAuth session provider

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
