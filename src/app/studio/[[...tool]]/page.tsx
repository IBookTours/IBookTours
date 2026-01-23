/**
 * ============================================
 * SANITY STUDIO EMBEDDED ROUTE
 * ============================================
 * This page embeds Sanity Studio directly into the Next.js app.
 * Access the admin panel at: /studio
 *
 * Note: This is a client component that renders Sanity Studio.
 */

'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
