'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
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
          backgroundColor: '#f1faee',
          color: '#1d3557'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Critical Error
            </h1>
            <p style={{ marginBottom: '2rem', color: '#457b9d' }}>
              A critical error occurred. We apologize for the inconvenience.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#e63946',
                color: 'white',
                border: 'none',
                borderRadius: '9999px',
                fontWeight: '600',
                cursor: 'pointer'
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
