'use client';

import { useState, useEffect, useRef, useCallback, KeyboardEvent } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import styles from './Dropdown.module.scss';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  label?: string;
  id?: string;
  disabled?: boolean;
  variant?: 'default' | 'compact';
  fullWidth?: boolean;
  className?: string;
}

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  label,
  id,
  disabled = false,
  variant = 'default',
  fullWidth = false,
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listRef.current) {
      const focusedEl = listRef.current.children[focusedIndex] as HTMLElement;
      if (focusedEl) {
        focusedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex, isOpen]);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      if (!isOpen) {
        // Focus current selection when opening
        const currentIndex = options.findIndex((opt) => opt.value === value);
        setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
      }
    }
  }, [disabled, isOpen, options, value]);

  const handleSelect = useCallback(
    (optValue: string) => {
      onChange(optValue);
      setIsOpen(false);
      setFocusedIndex(-1);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (isOpen && focusedIndex >= 0) {
            handleSelect(options[focusedIndex].value);
          } else {
            handleToggle();
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(0);
          } else {
            setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
        case 'Home':
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex(0);
          }
          break;
        case 'End':
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex(options.length - 1);
          }
          break;
      }
    },
    [disabled, focusedIndex, handleSelect, handleToggle, isOpen, options]
  );

  const containerClassName = [
    styles.container,
    fullWidth ? styles.fullWidth : '',
    variant === 'compact' ? styles.compact : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClassName} ref={containerRef}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}

      <button
        type="button"
        id={id}
        className={`${styles.trigger} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? id : undefined}
      >
        <span className={styles.selectedValue}>
          {selectedOption ? (
            <>
              {selectedOption.icon && <span className={styles.optionIcon}>{selectedOption.icon}</span>}
              <span>{selectedOption.label}</span>
            </>
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </span>
        <ChevronDown className={`${styles.chevron} ${isOpen ? styles.rotated : ''}`} size={16} />
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="listbox" ref={listRef} aria-activedescendant={focusedIndex >= 0 ? `option-${focusedIndex}` : undefined}>
          {options.map((option, index) => (
            <button
              key={option.value}
              id={`option-${index}`}
              type="button"
              className={`${styles.option} ${option.value === value ? styles.selected : ''} ${
                index === focusedIndex ? styles.focused : ''
              }`}
              onClick={() => handleSelect(option.value)}
              onMouseEnter={() => setFocusedIndex(index)}
              role="option"
              aria-selected={option.value === value}
            >
              {option.icon && <span className={styles.optionIcon}>{option.icon}</span>}
              <span className={styles.optionLabel}>{option.label}</span>
              {option.value === value && <Check className={styles.checkIcon} size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
