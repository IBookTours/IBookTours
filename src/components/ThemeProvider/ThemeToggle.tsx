'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import styles from './ThemeProvider.module.scss';

interface ThemeToggleProps {
  showSystemOption?: boolean;
  className?: string;
}

export function ThemeToggle({ showSystemOption = false, className }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  if (showSystemOption) {
    // Three-way toggle: light -> dark -> system -> light
    const cycleTheme = () => {
      const sequence: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
      const currentIndex = sequence.indexOf(theme);
      const nextIndex = (currentIndex + 1) % sequence.length;
      setTheme(sequence[nextIndex]);
    };

    return (
      <button
        className={`${styles.toggle} ${className || ''}`}
        onClick={cycleTheme}
        aria-label={`Current theme: ${theme}. Click to change.`}
        title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
      >
        {theme === 'light' && <Sun size={20} />}
        {theme === 'dark' && <Moon size={20} />}
        {theme === 'system' && <Monitor size={20} />}
      </button>
    );
  }

  // Simple light/dark toggle
  return (
    <button
      className={`${styles.toggle} ${className || ''}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
      title={resolvedTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {resolvedTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}

export default ThemeToggle;
