import { Suspense } from 'react';
import { Metadata } from 'next';
import SignInContent from './SignInContent';

export const metadata: Metadata = {
  title: 'Sign In | IBookTours',
  description: 'Sign in to your IBookTours account to book your next adventure.',
};

function SignInLoading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        position: 'fixed',
        inset: '0',
        zIndex: 9999,
      }}
      role="status"
      aria-label="Loading sign in page"
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--border-light)',
          borderTopColor: 'var(--color-primary-500)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
        aria-hidden="true"
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInContent />
    </Suspense>
  );
}
