'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Compass, AlertCircle, ArrowRight } from 'lucide-react';
import styles from './signin.module.scss';

export default function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn('credentials', {
        email,
        password,
        callbackUrl,
      });
    } catch {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl });
  };

  const getErrorMessage = (errorType: string | null) => {
    switch (errorType) {
      case 'CredentialsSignin':
        return 'Invalid email or password. Please try again.';
      case 'OAuthAccountNotLinked':
        return 'This email is already registered with a different provider.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.';
      default:
        return errorType ? 'An error occurred. Please try again.' : null;
    }
  };

  const errorMessage = getErrorMessage(error);

  if (!mounted) {
    return null;
  }

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
            &ldquo;Travel is the only thing you buy that makes you richer.&rdquo;
          </blockquote>
          <cite className={styles.author}>- Anonymous</cite>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>12K+</span>
            <span className={styles.statLabel}>Happy Travelers</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>72</span>
            <span className={styles.statLabel}>Destinations</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>4.9</span>
            <span className={styles.statLabel}>Rating</span>
          </div>
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

          {/* Welcome Text */}
          <div className={styles.header}>
            <h1>Welcome Back</h1>
            <p>Sign in to continue your journey with us</p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className={styles.errorAlert} role="alert" aria-live="assertive">
              <AlertCircle aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleCredentialsSignIn} className={styles.form}>
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
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="password">Password</label>
                <Link href="/auth/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-required="true"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <span className={styles.spinner} aria-label="Signing in" />
              ) : (
                <>
                  Sign In
                  <ArrowRight aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className={styles.divider}>
            <span>or continue with</span>
          </div>

          {/* Social Login */}
          <button
            type="button"
            className={styles.googleButton}
            onClick={handleGoogleSignIn}
          >
            <svg viewBox="0 0 24 24" className={styles.googleIcon} aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Sign Up Link */}
          <p className={styles.signupLink}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
