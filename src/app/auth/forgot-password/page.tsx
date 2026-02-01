'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Compass, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import styles from './forgot-password.module.scss';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  // Fetch CSRF token on mount
  useEffect(() => {
    fetch('/api/csrf')
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrf))
      .catch(() => {
        // CSRF fetch failed - will retry on submit
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Get fresh CSRF token if we don't have one
      let token = csrfToken;
      if (!token) {
        const csrfRes = await fetch('/api/csrf');
        const csrfData = await csrfRes.json();
        token = csrfData.csrf;
        setCsrfToken(token);
      }

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, csrf: token }),
      });

      if (response.status === 429) {
        setError('Too many requests. Please try again later.');
        return;
      }

      // Always show success to prevent email enumeration
      setIsSubmitted(true);
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Left Side - Image with Quote */}
      <div className={styles.imageSection}>
        <Image
          src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&h=1800&fit=crop&q=90"
          alt="Albanian Riviera coastline"
          fill
          priority
          quality={90}
          className={styles.backgroundImage}
        />
        <div className={styles.overlay} />

        <div className={styles.quoteCard}>
          <blockquote className={styles.quote}>
            &ldquo;Every journey has its challenges, but the destination is always worth it.&rdquo;
          </blockquote>
          <cite className={styles.author}>- IBookTours Team</cite>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>
              <Compass />
            </span>
            IBookTours
          </Link>

          {/* Back to Sign In */}
          <Link href="/auth/signin" className={styles.backLink}>
            <ArrowLeft />
            Back to Sign In
          </Link>

          {isSubmitted ? (
            // Success State
            <div className={styles.successState} role="alert" aria-live="polite">
              <div className={styles.successIcon}>
                <CheckCircle aria-hidden="true" />
              </div>
              <h1>Check Your Email</h1>
              <p>
                If an account exists for <strong>{email}</strong>, you will receive
                a password reset link. Please check your inbox and spam folder.
              </p>
              <p className={styles.note}>
                The link will expire in 1 hour for security.
              </p>
              <Link href="/auth/signin" className={styles.returnButton}>
                Return to Sign In
              </Link>
            </div>
          ) : (
            // Form State
            <>
              {/* Welcome Text */}
              <div className={styles.header}>
                <h1>Forgot Password?</h1>
                <p>
                  No worries! Enter your email address and we&apos;ll send you
                  instructions to reset your password.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className={styles.errorAlert} role="alert" aria-live="assertive">
                  <AlertCircle aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email Address</label>
                  <div className={styles.inputWrapper}>
                    <Mail className={styles.inputIcon} />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      aria-required="true"
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <span className={styles.spinner} aria-label="Sending reset link" />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

            </>
          )}
        </div>
      </div>
    </div>
  );
}
