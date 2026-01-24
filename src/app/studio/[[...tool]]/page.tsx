/**
 * ============================================
 * SANITY STUDIO EMBEDDED ROUTE
 * ============================================
 * This page embeds Sanity Studio directly into the Next.js app.
 * Access the admin panel at: /studio
 *
 * Note: This is a client component that renders Sanity Studio.
 * It checks if Sanity is properly configured before loading.
 */

'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

// Check if Sanity is properly configured
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const isConfigured = Boolean(
  projectId &&
    projectId !== '' &&
    projectId !== 'your_project_id_here' &&
    /^[a-z0-9-]+$/.test(projectId)
);

function StudioNotConfigured() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#101112',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          marginBottom: '1.5rem',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
        }}
      >
        !
      </div>
      <h1
        style={{
          fontSize: '1.75rem',
          fontWeight: 600,
          marginBottom: '0.75rem',
          color: '#fff',
        }}
      >
        Sanity Studio Not Configured
      </h1>
      <p
        style={{
          color: '#9ca3af',
          maxWidth: '480px',
          lineHeight: 1.6,
          marginBottom: '2rem',
        }}
      >
        To use Sanity Studio, please set up your Sanity project credentials in
        your environment variables.
      </p>
      <div
        style={{
          background: '#1e1e24',
          padding: '1.5rem',
          borderRadius: '12px',
          textAlign: 'left',
          border: '1px solid #2d2d3a',
        }}
      >
        <p
          style={{
            color: '#9ca3af',
            fontSize: '0.875rem',
            marginBottom: '1rem',
          }}
        >
          Add these to your <code style={{ color: '#f472b6' }}>.env.local</code>{' '}
          file:
        </p>
        <code
          style={{
            display: 'block',
            color: '#7dd3fc',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            lineHeight: 1.8,
          }}
        >
          NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
          <br />
          NEXT_PUBLIC_SANITY_DATASET=production
        </code>
      </div>
      <a
        href="https://www.sanity.io/manage"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          background: '#f43f5e',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 500,
          fontSize: '0.9rem',
          transition: 'background 0.2s',
        }}
      >
        Create a Sanity Project
      </a>
    </div>
  );
}

export default function StudioPage() {
  if (!isConfigured) {
    return <StudioNotConfigured />;
  }

  return <NextStudio config={config} />;
}
