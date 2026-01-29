'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Fallback colors - kept inline as this error page must be self-contained
// These match the brand colors in @/lib/constants/brand.ts
const ERROR_PAGE_COLORS = {
  background: '#f8fafc',  // Light background
  text: '#1e293b',        // Primary text
  textMuted: '#64748b',   // Muted text
  error: '#dc2626',       // Error/danger color
} as const;

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Console.error is intentional here for critical error logging
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: ERROR_PAGE_COLORS.background,
          color: ERROR_PAGE_COLORS.text,
        }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Critical Error
            </h1>
            <p style={{ marginBottom: '2rem', color: ERROR_PAGE_COLORS.textMuted }}>
              A critical error occurred. We apologize for the inconvenience.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: ERROR_PAGE_COLORS.error,
                color: 'white',
                border: 'none',
                borderRadius: '9999px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
