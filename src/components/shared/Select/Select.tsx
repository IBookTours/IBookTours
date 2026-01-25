'use client';

import { forwardRef, SelectHTMLAttributes, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.scss';

// ============================================
// SHARED SELECT COMPONENT
// ============================================
// Consistent, accessible dropdown select with custom styling
// Replaces inconsistent native select styling across the app

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'size'> {
  /** Options to display in the dropdown */
  options: SelectOption[];
  /** Label for the select */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Icon to show before the select */
  icon?: ReactNode;
  /** Visual variant */
  variant?: 'default' | 'minimal' | 'outlined';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Full width */
  fullWidth?: boolean;
  /** Additional class */
  className?: string;
  /** Hide the label visually */
  hideLabel?: boolean;
}

/**
 * Styled Select component with consistent appearance
 * Wraps native select for accessibility while providing custom styling
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      label,
      error,
      helperText,
      icon,
      variant = 'default',
      size = 'md',
      fullWidth = false,
      className = '',
      hideLabel = false,
      id,
      name,
      required,
      ...rest
    },
    ref
  ) => {
    const selectId = id || name;
    const errorId = selectId ? `${selectId}-error` : undefined;
    const helperId = selectId ? `${selectId}-helper` : undefined;
    const hasError = !!error;

    const describedBy = [hasError && errorId, helperText && !hasError && helperId]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div
        className={`
          ${styles.selectContainer}
          ${styles[variant]}
          ${styles[size]}
          ${fullWidth ? styles.fullWidth : ''}
          ${hasError ? styles.hasError : ''}
          ${className}
        `}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className={`${styles.label} ${hideLabel ? styles.visuallyHidden : ''}`}
          >
            {label}
            {required && <span className={styles.required} aria-hidden="true">*</span>}
          </label>
        )}

        {/* Select Wrapper */}
        <div className={styles.selectWrapper}>
          {/* Icon */}
          {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}

          {/* Native Select */}
          <select
            ref={ref}
            id={selectId}
            name={name}
            className={`${styles.select} ${icon ? styles.hasIcon : ''}`}
            aria-required={required}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            {...rest}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron Icon */}
          <ChevronDown className={styles.chevron} aria-hidden="true" />
        </div>

        {/* Error Message */}
        {hasError && (
          <span id={errorId} className={styles.error} role="alert">
            {error}
          </span>
        )}

        {/* Helper Text */}
        {helperText && !hasError && (
          <span id={helperId} className={styles.helper}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
