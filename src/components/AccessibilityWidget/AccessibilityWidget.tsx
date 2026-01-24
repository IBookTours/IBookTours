'use client';

import { useState, useEffect } from 'react';
import { Accessibility, X, Type, Contrast, ZoomIn, ZoomOut } from 'lucide-react';
import styles from './AccessibilityWidget.module.scss';

interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'x-large';
  highContrast: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
};

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        applySettings(parsed);
      } catch {
        // Invalid JSON, use defaults
      }
    }
  }, []);

  // Apply settings to document
  const applySettings = (newSettings: AccessibilitySettings) => {
    const html = document.documentElement;

    // Font size
    html.classList.remove('font-normal', 'font-large', 'font-x-large');
    html.classList.add(`font-${newSettings.fontSize}`);

    // High contrast
    if (newSettings.highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
  };

  // Save and apply settings
  const updateSettings = (newSettings: AccessibilitySettings) => {
    setSettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  const cycleFontSize = () => {
    const sizes: AccessibilitySettings['fontSize'][] = ['normal', 'large', 'x-large'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    updateSettings({ ...settings, fontSize: sizes[nextIndex] });
  };

  const toggleHighContrast = () => {
    updateSettings({ ...settings, highContrast: !settings.highContrast });
  };

  const resetSettings = () => {
    updateSettings(defaultSettings);
  };

  return (
    <div className={styles.widget}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close accessibility menu' : 'Open accessibility menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X /> : <Accessibility />}
      </button>

      {isOpen && (
        <div className={styles.panel} role="dialog" aria-label="Accessibility settings">
          <div className={styles.header}>
            <h3>Accessibility</h3>
          </div>

          <div className={styles.options}>
            <button
              className={styles.option}
              onClick={cycleFontSize}
              aria-label={`Change font size. Current: ${settings.fontSize}`}
            >
              <span className={styles.optionIcon}>
                {settings.fontSize === 'normal' && <Type />}
                {settings.fontSize === 'large' && <ZoomIn />}
                {settings.fontSize === 'x-large' && <ZoomOut />}
              </span>
              <span className={styles.optionLabel}>
                Text Size
                <span className={styles.optionValue}>
                  {settings.fontSize === 'normal' && 'Normal'}
                  {settings.fontSize === 'large' && 'Large'}
                  {settings.fontSize === 'x-large' && 'Extra Large'}
                </span>
              </span>
            </button>

            <button
              className={`${styles.option} ${settings.highContrast ? styles.active : ''}`}
              onClick={toggleHighContrast}
              aria-label={`Toggle high contrast. Currently ${settings.highContrast ? 'on' : 'off'}`}
              aria-pressed={settings.highContrast}
            >
              <span className={styles.optionIcon}>
                <Contrast />
              </span>
              <span className={styles.optionLabel}>
                High Contrast
                <span className={styles.optionValue}>
                  {settings.highContrast ? 'On' : 'Off'}
                </span>
              </span>
            </button>
          </div>

          <button className={styles.reset} onClick={resetSettings}>
            Reset to Default
          </button>
        </div>
      )}
    </div>
  );
}
