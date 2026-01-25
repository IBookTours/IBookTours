'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    console.error('Application error:', error);

    // In production, you could send to an error tracking service like Sentry
    // if (process.env.NODE_ENV === 'production') {
    //   captureException(error);
    // }
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'var(--color-error-light)' }}
        >
          <AlertTriangle
            size={40}
            style={{ color: 'var(--color-error-main)' }}
          />
        </div>

        {/* Message */}
        <h1
          className="text-2xl font-bold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Something Went Wrong
        </h1>

        <p
          className="mb-6"
          style={{ color: 'var(--text-secondary)' }}
        >
          We apologize for the inconvenience. An unexpected error occurred while processing your request.
        </p>

        {/* Error Details (development only) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div
            className="mb-6 p-4 rounded-lg text-left text-sm overflow-auto max-h-32"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-tertiary)'
            }}
          >
            <code>{error.message}</code>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all"
            style={{
              backgroundColor: 'var(--color-primary-500)',
              color: 'white'
            }}
          >
            <RefreshCw size={18} />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all"
            style={{
              border: '2px solid var(--border-medium)',
              color: 'var(--text-primary)'
            }}
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>

        {/* Support Link */}
        <p
          className="mt-8 text-sm"
          style={{ color: 'var(--text-tertiary)' }}
        >
          If this problem persists, please{' '}
          <Link
            href="/contact"
            className="underline"
            style={{ color: 'var(--color-primary-600)' }}
          >
            contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}
