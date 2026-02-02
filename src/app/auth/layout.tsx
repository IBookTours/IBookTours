import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Account | IBookTours',
    template: '%s | IBookTours',
  },
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Auth Layout - Clean layout without navbar/footer for auth pages
 * Designed for full-screen sign-in/sign-up experience
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Children render without the main layout's Navbar/Footer
  // This is achieved by Next.js route group layouts overriding parent layouts
  return <>{children}</>;
}
