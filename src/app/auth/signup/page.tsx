'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, User, Compass, AlertCircle, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import styles from '../forgot-password/forgot-password.module.scss';

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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

  // Validation state
  const [validations, setValidations] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    passwordsMatch: false,
    validEmail: false,
  });

  // Update validations as user types
  useEffect(() => {
    setValidations({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      passwordsMatch: password === confirmPassword && password.length > 0,
      validEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    });
  }, [password, confirmPassword, email]);

  const isFormValid =
    validations.minLength &&
    validations.hasUppercase &&
    validations.hasLowercase &&
    validations.hasNumber &&
    validations.passwordsMatch &&
    validations.validEmail;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setError('Please fill in all fields correctly.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get fresh CSRF token if we don't have one
      let csrf = csrfToken;
      if (!csrf) {
        const csrfRes = await fetch('/api/csrf');
        const csrfData = await csrfRes.json();
        csrf = csrfData.csrf;
        setCsrfToken(csrf);
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: name.trim() || undefined,
          csrf,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError('Too many requests. Please try again later.');
        } else if (data.details) {
          // Validation errors from zod
          const messages = Object.values(data.details).flat().join('. ');
          setError(messages || data.error);
        } else {
          setError(data.error || 'Failed to create account.');
        }
        return;
      }

      setIsSuccess(true);

      // Redirect to signin after 2 seconds
      setTimeout(() => {
        router.push('/auth/signin');
      }, 2000);
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
            &ldquo;The world is a book, and those who do not travel read only one page.&rdquo;
          </blockquote>
          <cite className={styles.author}>- Saint Augustine</cite>
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

          {isSuccess ? (
            // Success State
            <div className={styles.successState} role="alert" aria-live="polite">
              <div className={styles.successIcon}>
                <CheckCircle aria-hidden="true" />
              </div>
              <h1>Account Created!</h1>
              <p>
                Your account has been successfully created.
                Redirecting you to sign in...
              </p>
              <Link href="/auth/signin" className={styles.returnButton}>
                Sign In Now
              </Link>
            </div>
          ) : (
            // Form State
            <>
              {/* Header */}
              <div className={styles.header}>
                <h1>Create Account</h1>
                <p>
                  Join IBookTours to discover and book amazing travel experiences.
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
                  <label htmlFor="name">Name (optional)</label>
                  <div className={styles.inputWrapper}>
                    <User className={styles.inputIcon} />
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      disabled={isLoading}
                    />
                  </div>
                </div>

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

                <div className={styles.inputGroup}>
                  <label htmlFor="password">Password</label>
                  <div className={styles.inputWrapper}>
                    <Lock className={styles.inputIcon} />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      aria-required="true"
                      aria-describedby="password-requirements"
                      autoComplete="new-password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className={styles.togglePassword}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                    </button>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className={styles.inputWrapper}>
                    <Lock className={styles.inputIcon} />
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      aria-required="true"
                      aria-describedby="password-requirements"
                      autoComplete="new-password"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Requirements */}
                <div className={styles.requirements} id="password-requirements">
                  <p>Password must:</p>
                  <ul>
                    <li className={validations.minLength ? styles.valid : ''}>
                      Be at least 8 characters
                    </li>
                    <li className={validations.hasUppercase ? styles.valid : ''}>
                      Include an uppercase letter
                    </li>
                    <li className={validations.hasLowercase ? styles.valid : ''}>
                      Include a lowercase letter
                    </li>
                    <li className={validations.hasNumber ? styles.valid : ''}>
                      Include a number
                    </li>
                    <li className={validations.passwordsMatch ? styles.valid : ''}>
                      Passwords match
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading || !isFormValid}
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <span className={styles.spinner} aria-label="Creating account" />
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Sign In Link */}
              <p className={styles.note} style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                Already have an account?{' '}
                <Link href="/auth/signin">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
