/**
 * ============================================
 * SANITY STUDIO LAYOUT
 * ============================================
 * This layout removes the site's navbar and footer
 * to provide a clean studio experience.
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
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
