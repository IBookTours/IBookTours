'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './DatePicker.module.scss';

interface DatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (value: string) => void;
  minDate?: string; // YYYY-MM-DD format
  maxDate?: string; // YYYY-MM-DD format
  label?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  usePortal?: boolean; // Render calendar in portal to escape overflow:hidden
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function formatDateForDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const date = new Date(dateStr + 'T00:00:00');
  return isNaN(date.getTime()) ? null : date;
}

function formatDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export default function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  label,
  id,
  placeholder = 'Select date',
  disabled = false,
  className = '',
  usePortal = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const parsed = parseDate(value);
    return parsed || new Date();
  });
  const [portalPosition, setPortalPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const today = useMemo(() => new Date(), []);
  const minDateObj = useMemo(() => parseDate(minDate || ''), [minDate]);
  const maxDateObj = useMemo(() => parseDate(maxDate || ''), [maxDate]);
  const selectedDate = useMemo(() => parseDate(value), [value]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update view date when value changes
  useEffect(() => {
    const parsed = parseDate(value);
    if (parsed) {
      setViewDate(parsed);
    }
  }, [value]);

  // Calculate portal position when opening
  useEffect(() => {
    if (isOpen && usePortal && triggerRef.current) {
      const updatePosition = () => {
        const rect = triggerRef.current!.getBoundingClientRect();
        const calendarWidth = 300;
        const calendarHeight = 340; // Approximate height
        const padding = 8;

        let top = rect.bottom + padding;
        let left = rect.left;

        // Check if calendar would overflow right edge
        if (left + calendarWidth > window.innerWidth - padding) {
          left = window.innerWidth - calendarWidth - padding;
        }

        // Check if calendar would overflow bottom
        if (top + calendarHeight > window.innerHeight - padding) {
          // Position above trigger instead
          top = rect.top - calendarHeight - padding;
        }

        // Ensure doesn't go off left edge
        if (left < padding) {
          left = padding;
        }

        setPortalPosition({ top, left });
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, usePortal]);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  const handlePrevMonth = useCallback(() => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleSelectDate = useCallback(
    (date: Date) => {
      onChange(formatDateValue(date));
      setIsOpen(false);
    },
    [onChange]
  );

  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      if (minDateObj && date < minDateObj) {
        // Check if it's before minDate (comparing dates only, not time)
        const minDateOnly = new Date(minDateObj.getFullYear(), minDateObj.getMonth(), minDateObj.getDate());
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        if (dateOnly < minDateOnly) return true;
      }
      if (maxDateObj && date > maxDateObj) {
        const maxDateOnly = new Date(maxDateObj.getFullYear(), maxDateObj.getMonth(), maxDateObj.getDate());
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        if (dateOnly > maxDateOnly) return true;
      }
      return false;
    },
    [minDateObj, maxDateObj]
  );

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [viewDate]);

  return (
    <div className={`${styles.container} ${className}`} ref={containerRef}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        type="button"
        id={id}
        className={`${styles.trigger} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''}`}
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Calendar className={styles.calendarIcon} size={18} />
        <span className={value ? styles.dateValue : styles.placeholder}>
          {value ? formatDateForDisplay(value) : placeholder}
        </span>
      </button>

      {isOpen && (
        usePortal ? createPortal(
          <div
            className={`${styles.calendar} ${styles.portalCalendar}`}
            role="dialog"
            aria-label="Choose date"
            style={{ top: portalPosition.top, left: portalPosition.left }}
          >
            {/* Header with month/year navigation */}
            <div className={styles.calendarHeader}>
              <button
                type="button"
                className={styles.navButton}
                onClick={handlePrevMonth}
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>
              <span className={styles.monthYear}>
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button
                type="button"
                className={styles.navButton}
                onClick={handleNextMonth}
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Day of week headers */}
            <div className={styles.weekDays}>
              {DAYS_OF_WEEK.map((day) => (
                <span key={day} className={styles.weekDay}>
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar grid */}
            <div className={styles.daysGrid}>
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <span key={`empty-${index}`} className={styles.emptyCell} />;
                }

                const isDisabled = isDateDisabled(date);
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isToday = isSameDay(date, today);

                return (
                  <button
                    key={date.getTime()}
                    type="button"
                    className={`${styles.dayCell} ${isSelected ? styles.selected : ''} ${
                      isToday ? styles.today : ''
                    } ${isDisabled ? styles.disabled : ''}`}
                    onClick={() => { if (!isDisabled) handleSelectDate(date); }}
                    disabled={isDisabled}
                    aria-label={date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    aria-pressed={isSelected || undefined}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Today button */}
            <div className={styles.calendarFooter}>
              <button
                type="button"
                className={styles.todayButton}
                onClick={() => {
                  if (!isDateDisabled(today)) {
                    handleSelectDate(today);
                  } else {
                    setViewDate(today);
                  }
                }}
              >
                Today
              </button>
            </div>
          </div>,
          document.body
        ) : (
          <div className={styles.calendar} role="dialog" aria-label="Choose date">
            {/* Header with month/year navigation */}
            <div className={styles.calendarHeader}>
              <button
                type="button"
                className={styles.navButton}
                onClick={handlePrevMonth}
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>
              <span className={styles.monthYear}>
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button
                type="button"
                className={styles.navButton}
                onClick={handleNextMonth}
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Day of week headers */}
            <div className={styles.weekDays}>
              {DAYS_OF_WEEK.map((day) => (
                <span key={day} className={styles.weekDay}>
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar grid */}
            <div className={styles.daysGrid}>
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <span key={`empty-${index}`} className={styles.emptyCell} />;
                }

                const isDisabled = isDateDisabled(date);
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isToday = isSameDay(date, today);

                return (
                  <button
                    key={date.getTime()}
                    type="button"
                    className={`${styles.dayCell} ${isSelected ? styles.selected : ''} ${
                      isToday ? styles.today : ''
                    } ${isDisabled ? styles.disabled : ''}`}
                    onClick={() => { if (!isDisabled) handleSelectDate(date); }}
                    disabled={isDisabled}
                    aria-label={date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    aria-pressed={isSelected || undefined}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Today button */}
            <div className={styles.calendarFooter}>
              <button
                type="button"
                className={styles.todayButton}
                onClick={() => {
                  if (!isDateDisabled(today)) {
                    handleSelectDate(today);
                  } else {
                    setViewDate(today);
                  }
                }}
              >
                Today
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
