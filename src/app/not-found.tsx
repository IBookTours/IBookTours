'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <h1
          className="text-[120px] font-bold leading-none"
          style={{ color: 'var(--color-primary-500)' }}
        >
          404
        </h1>

        {/* Message */}
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Page Not Found
        </h2>

        <p
          className="mb-8"
          style={{ color: 'var(--text-secondary)' }}
        >
          Oops! The page you&apos;re looking for seems to have wandered off on its own adventure.
          Let&apos;s get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all"
            style={{
              backgroundColor: 'var(--color-primary-500)',
              color: 'white'
            }}
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            href="/tours"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all"
            style={{
              border: '2px solid var(--border-medium)',
              color: 'var(--text-primary)'
            }}
          >
            <Search size={18} />
            Explore Tours
          </Link>
        </div>

        {/* Back Link */}
        <button
          onClick={() => typeof window !== 'undefined' && window.history.back()}
          className="mt-6 inline-flex items-center gap-1 text-sm hover:underline"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <ArrowLeft size={14} />
          Go back to previous page
        </button>
      </div>
    </div>
  );
}
