/**
 * Admin Layout
 *
 * Layout wrapper for all admin pages with sidebar navigation.
 * Protected by middleware - only accessible to users with 'admin' role.
 */

import { ReactNode } from 'react';
import { AdminLayout as AdminLayoutComponent } from '@/components/Admin';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminLayoutComponent>{children}</AdminLayoutComponent>;
}
