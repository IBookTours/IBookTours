'use client';

import { forwardRef, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import styles from './FormField.module.scss';

// ============================================
// SHARED FORM FIELD COMPONENT
// ============================================
// Accessible, consistent form field with label, error, and helper text
// Supports input, select, and textarea elements

export type FieldType = 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' | 'select' | 'textarea';

interface BaseFieldProps {
  /** Field label */
  label: string;
  /** Field name/id */
  name: string;
  /** Error message to display */
  error?: string;
  /** Helper text below the field */
  helperText?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Icon to show at the start of the input */
  startIcon?: ReactNode;
  /** Icon to show at the end of the input */
  endIcon?: ReactNode;
  /** Additional class for the container */
  className?: string;
  /** Hide the label visually (still accessible) */
  hideLabel?: boolean;
}

// Input-specific props
interface InputFieldProps extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  type?: Exclude<FieldType, 'select' | 'textarea'>;
}

// Select-specific props
interface SelectFieldProps extends BaseFieldProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'> {
  type: 'select';
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

// Textarea-specific props
interface TextareaFieldProps extends BaseFieldProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {
  type: 'textarea';
  rows?: number;
}

export type FormFieldProps = InputFieldProps | SelectFieldProps | TextareaFieldProps;

// Type guards
function isSelectField(props: FormFieldProps): props is SelectFieldProps {
  return props.type === 'select';
}

function isTextareaField(props: FormFieldProps): props is TextareaFieldProps {
  return props.type === 'textarea';
}

/**
 * FormField component with built-in accessibility
 * Automatically handles:
 * - aria-required for required fields
 * - aria-invalid for error state
 * - aria-describedby for error/helper text connection
 * - Proper label-input association
 */
const FormField = forwardRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, FormFieldProps>(
  (props, ref) => {
    const {
      label,
      name,
      error,
      helperText,
      required = false,
      startIcon,
      endIcon,
      className = '',
      hideLabel = false,
      type = 'text',
      ...rest
    } = props;

    // Generate IDs for accessibility
    const inputId = name;
    const errorId = `${name}-error`;
    const helperId = `${name}-helper`;
    const hasError = !!error;
    const describedBy = [hasError && errorId, helperText && !hasError && helperId]
      .filter(Boolean)
      .join(' ') || undefined;

    // Common ARIA attributes
    const ariaProps = {
      id: inputId,
      name,
      'aria-required': required,
      'aria-invalid': hasError,
      'aria-describedby': describedBy,
    };

    return (
      <div className={`${styles.field} ${hasError ? styles.hasError : ''} ${className}`}>
        {/* Label */}
        <label
          htmlFor={inputId}
          className={`${styles.label} ${hideLabel ? styles.visuallyHidden : ''}`}
        >
          {label}
          {required && <span className={styles.required} aria-hidden="true">*</span>}
        </label>

        {/* Input Container */}
        <div className={`${styles.inputContainer} ${startIcon ? styles.hasStartIcon : ''} ${endIcon ? styles.hasEndIcon : ''}`}>
          {/* Start Icon */}
          {startIcon && <span className={styles.startIcon} aria-hidden="true">{startIcon}</span>}

          {/* Render appropriate input type */}
          {isSelectField(props) ? (
            <select
              ref={ref as React.Ref<HTMLSelectElement>}
              className={styles.select}
              {...ariaProps}
              {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
            >
              {props.options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : isTextareaField(props) ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={styles.textarea}
              rows={props.rows || 4}
              {...ariaProps}
              {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              type={type}
              className={styles.input}
              {...ariaProps}
              {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            />
          )}

          {/* End Icon */}
          {endIcon && <span className={styles.endIcon} aria-hidden="true">{endIcon}</span>}
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

FormField.displayName = 'FormField';

export default FormField;
