'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  ChevronDown,
  ExternalLink,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import {
  CalendarEvent,
  generateGoogleCalendarUrl,
  generateOutlookWebUrl,
  downloadICS,
  copyEventDetails,
} from '@/lib/calendar';
import { TIMING } from '@/lib/constants';
import styles from './AddToCalendar.module.scss';

interface AddToCalendarProps {
  event: CalendarEvent;
  variant?: 'button' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AddToCalendar({
  event,
  variant = 'button',
  size = 'md',
  className = '',
}: AddToCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl(event);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleOutlookWeb = () => {
    const url = generateOutlookWebUrl(event);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleAppleCalendar = () => {
    downloadICS(event);
    setIsOpen(false);
  };

  const handleOutlookDesktop = () => {
    downloadICS(event, `${event.title.replace(/\s+/g, '-')}-outlook.ics`);
    setIsOpen(false);
  };

  const handleCopy = async () => {
    const success = await copyEventDetails(event);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), TIMING.COPY_FEEDBACK_DURATION);
    }
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`${styles.container} ${styles[size]} ${className}`}
    >
      <button
        type="button"
        className={`${styles.trigger} ${styles[variant]}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Calendar size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        {variant === 'button' && (
          <>
            <span>Add to Calendar</span>
            <ChevronDown
              size={14}
              className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
            />
          </>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          <button
            type="button"
            className={styles.option}
            onClick={handleGoogleCalendar}
            role="menuitem"
          >
            <svg viewBox="0 0 24 24" className={styles.googleIcon}>
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
            <span>Google Calendar</span>
            <ExternalLink size={14} className={styles.externalIcon} />
          </button>

          <button
            type="button"
            className={styles.option}
            onClick={handleAppleCalendar}
            role="menuitem"
          >
            <svg viewBox="0 0 24 24" className={styles.appleIcon}>
              <path
                fill="currentColor"
                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
              />
            </svg>
            <span>Apple Calendar</span>
            <Download size={14} className={styles.downloadIcon} />
          </button>

          <button
            type="button"
            className={styles.option}
            onClick={handleOutlookWeb}
            role="menuitem"
          >
            <svg viewBox="0 0 24 24" className={styles.outlookIcon}>
              <path
                fill="#0078D4"
                d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.154-.352.23-.584.23h-8.547v-6.959l1.6 1.229c.102.086.22.127.356.127.135 0 .254-.041.355-.127l6.82-5.225c.094-.07.164-.158.208-.264.044-.105.047-.204.03-.305v-.238c0-.17-.076-.31-.229-.42-.15-.108-.313-.153-.486-.133l-.06.006-6.816 5.222-1.778-1.364V5.387h8.784c.232 0 .426.074.584.223.158.148.238.342.238.577z"
              />
              <path
                fill="#0078D4"
                d="M15.078 11.712V6.052l-1.588 1.217v5.186l1.588-.743zM9.64 8.035V6.053l5.078 3.895v1.764l-5.078-3.677z"
              />
              <path
                fill="#28A8EA"
                d="M9.64 18.613v-4.33l4.85 3.322v1.008h-4.85z"
              />
              <path
                fill="#0078D4"
                d="M0 6.256v11.49c0 .232.074.426.223.584.148.158.342.237.576.237h8.09V5.671H.8c-.234 0-.428.076-.577.23-.15.153-.223.35-.223.576z"
              />
            </svg>
            <span>Outlook Web</span>
            <ExternalLink size={14} className={styles.externalIcon} />
          </button>

          <button
            type="button"
            className={styles.option}
            onClick={handleOutlookDesktop}
            role="menuitem"
          >
            <svg viewBox="0 0 24 24" className={styles.outlookIcon}>
              <path
                fill="#0078D4"
                d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.154-.352.23-.584.23h-8.547v-6.959l1.6 1.229c.102.086.22.127.356.127.135 0 .254-.041.355-.127l6.82-5.225c.094-.07.164-.158.208-.264.044-.105.047-.204.03-.305v-.238c0-.17-.076-.31-.229-.42-.15-.108-.313-.153-.486-.133l-.06.006-6.816 5.222-1.778-1.364V5.387h8.784c.232 0 .426.074.584.223.158.148.238.342.238.577z"
              />
              <path
                fill="#0078D4"
                d="M0 6.256v11.49c0 .232.074.426.223.584.148.158.342.237.576.237h8.09V5.671H.8c-.234 0-.428.076-.577.23-.15.153-.223.35-.223.576z"
              />
            </svg>
            <span>Outlook Desktop</span>
            <Download size={14} className={styles.downloadIcon} />
          </button>

          <div className={styles.divider} />

          <button
            type="button"
            className={styles.option}
            onClick={handleCopy}
            role="menuitem"
          >
            {copied ? (
              <>
                <Check size={16} className={styles.checkIcon} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy Details</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
