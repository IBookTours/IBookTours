import { Metadata } from 'next';
import Link from 'next/link';
import { Settings, ArrowLeft, Construction } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Studio | IBookTours',
  description: 'IBookTours Admin Studio - Coming Soon',
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--color-primary-50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <Construction
          style={{
            width: '40px',
            height: '40px',
            color: 'var(--color-primary-500)',
          }}
        />
      </div>
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}
      >
        Admin Studio
      </h1>
      <p
        style={{
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          maxWidth: '400px',
          marginBottom: '2rem',
        }}
      >
        The admin content management studio is coming soon. This will allow you
        to manage tours, packages, and site content.
      </p>
      <Link
        href="/profile"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          background: 'var(--color-primary-600)',
          color: 'white',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontWeight: 500,
          transition: 'background 0.2s',
        }}
      >
        <ArrowLeft style={{ width: '18px', height: '18px' }} />
        Back to Profile
      </Link>
    </div>
  );
}
