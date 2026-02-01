'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Compass, AlertCircle, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import styles from '../forgot-password/forgot-password.module.scss';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation state
  const [validations, setValidations] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    passwordsMatch: false,
  });

  // Update validations as user types
  useEffect(() => {
    setValidations({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      passwordsMatch: password === confirmPassword && password.length > 0,
    });
  }, [password, confirmPassword]);

  const isFormValid = Object.values(validations).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setError('Please meet all password requirements.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to reset password.');
        return;
      }

      setIsSuccess(true);
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // No token provided
  if (!token) {
    return (
      <div className={styles.page}>
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon}>
                <Compass />
              </span>
              IBookTours
            </Link>

            <div className={styles.errorAlert}>
              <AlertCircle />
              <span>Invalid password reset link. Please request a new one.</span>
            </div>

            <Link href="/auth/forgot-password" className={styles.returnButton}>
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
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
            &ldquo;A fresh start is just a step away.&rdquo;
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

          {isSuccess ? (
            // Success State
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <CheckCircle />
              </div>
              <h1>Password Reset!</h1>
              <p>
                Your password has been successfully reset.
                You can now sign in with your new password.
              </p>
              <Link href="/auth/signin" className={styles.returnButton}>
                Sign In
              </Link>
            </div>
          ) : (
            // Form State
            <>
              {/* Header */}
              <div className={styles.header}>
                <h1>Set New Password</h1>
                <p>
                  Enter your new password below. Make sure it&apos;s secure!
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className={styles.errorAlert}>
                  <AlertCircle />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="password">New Password</label>
                  <div className={styles.inputWrapper}>
                    <Lock className={styles.inputIcon} />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className={styles.togglePassword}
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Requirements */}
                <div className={styles.requirements}>
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
                >
                  {isLoading ? (
                    <span className={styles.spinner} />
                  ) : (
                    'Reset Password'
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
