/**
 * ============================================
 * SANITY STUDIO LAYOUT
 * ============================================
 * This layout provides a clean full-screen studio experience
 * without the site's navbar and footer.
 *
 * Note: We use a fixed div instead of html/body to avoid
 * nesting conflicts with the root layout.
 */

export const metadata = {
  title: 'ITravel CMS | Sanity Studio',
  description: 'Content management system for ITravel',
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: '#101112',
      }}
    >
      {children}
    </div>
  );
}
