'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Accessibility,
  X,
  Type,
  Contrast,
  ZoomIn,
  ZoomOut,
  AlignJustify,
  Pause,
  RotateCcw,
  Eye,
} from 'lucide-react';
import { useFocusTrap, useAriaLive } from '@/hooks';
import styles from './AccessibilityWidget.module.scss';

interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'x-large';
  highContrast: boolean;
  textSpacing: boolean;
  reducedMotion: boolean;
  colorBlindMode: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  textSpacing: false,
  reducedMotion: false,
  colorBlindMode: 'none',
};

const colorBlindLabels: Record<AccessibilitySettings['colorBlindMode'], string> = {
  none: 'Off',
  deuteranopia: 'Deuteranopia (Green)',
  protanopia: 'Protanopia (Red)',
  tritanopia: 'Tritanopia (Blue)',
};

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const { announce } = useAriaLive();

  // Focus trap for the panel
  const panelRef = useFocusTrap<HTMLDivElement>({
    isActive: isOpen,
    onEscape: () => setIsOpen(false),
    restoreFocus: true,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to handle new properties
        const merged = { ...defaultSettings, ...parsed };
        setSettings(merged);
        applySettings(merged);
      } catch {
        // Invalid JSON, use defaults
      }
    }

    // Check for system reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !saved) {
      const newSettings = { ...defaultSettings, reducedMotion: true };
      setSettings(newSettings);
      applySettings(newSettings);
    }
  }, []);

  // Apply settings to document
  const applySettings = useCallback((newSettings: AccessibilitySettings) => {
    const html = document.documentElement;

    // Font size
    html.classList.remove('font-normal', 'font-large', 'font-x-large');
    html.classList.add(`font-${newSettings.fontSize}`);

    // High contrast
    html.classList.toggle('high-contrast', newSettings.highContrast);

    // Text spacing (WCAG 1.4.12)
    html.classList.toggle('text-spacing', newSettings.textSpacing);

    // Reduced motion
    html.classList.toggle('reduced-motion', newSettings.reducedMotion);

    // Color blind modes
    html.classList.remove('colorblind-deuteranopia', 'colorblind-protanopia', 'colorblind-tritanopia');
    if (newSettings.colorBlindMode !== 'none') {
      html.classList.add(`colorblind-${newSettings.colorBlindMode}`);
    }
  }, []);

  // Save and apply settings with announcement
  const updateSettings = useCallback((newSettings: AccessibilitySettings, announcementMessage?: string) => {
    setSettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
    applySettings(newSettings);

    if (announcementMessage) {
      announce(announcementMessage);
    }
  }, [applySettings, announce]);

  const cycleFontSize = () => {
    const sizes: AccessibilitySettings['fontSize'][] = ['normal', 'large', 'x-large'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    const newSize = sizes[nextIndex];
    const sizeLabels = { normal: 'Normal', large: 'Large', 'x-large': 'Extra Large' };
    updateSettings(
      { ...settings, fontSize: newSize },
      `Text size changed to ${sizeLabels[newSize]}`
    );
  };

  const toggleHighContrast = () => {
    const newValue = !settings.highContrast;
    updateSettings(
      { ...settings, highContrast: newValue },
      `High contrast ${newValue ? 'enabled' : 'disabled'}`
    );
  };

  const toggleTextSpacing = () => {
    const newValue = !settings.textSpacing;
    updateSettings(
      { ...settings, textSpacing: newValue },
      `Text spacing ${newValue ? 'enabled' : 'disabled'}`
    );
  };

  const toggleReducedMotion = () => {
    const newValue = !settings.reducedMotion;
    updateSettings(
      { ...settings, reducedMotion: newValue },
      `Reduced motion ${newValue ? 'enabled' : 'disabled'}`
    );
  };

  const cycleColorBlindMode = () => {
    const modes: AccessibilitySettings['colorBlindMode'][] = [
      'none',
      'deuteranopia',
      'protanopia',
      'tritanopia',
    ];
    const currentIndex = modes.indexOf(settings.colorBlindMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    const newMode = modes[nextIndex];
    updateSettings(
      { ...settings, colorBlindMode: newMode },
      `Color blind simulation: ${colorBlindLabels[newMode]}`
    );
  };

  const resetSettings = () => {
    updateSettings(defaultSettings, 'Accessibility settings reset to default');
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      announce('Accessibility menu opened');
    }
  };

  return (
    <div className={styles.widget}>
      <button
        className={styles.trigger}
        onClick={handleToggle}
        aria-label={isOpen ? 'Close accessibility menu' : 'Open accessibility menu'}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        {isOpen ? <X /> : <Accessibility />}
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          id="accessibility-panel"
          className={styles.panel}
          role="dialog"
          aria-modal="true"
          aria-label="Accessibility settings"
        >
          <div className={styles.header}>
            <h3 id="a11y-title">Accessibility</h3>
            <p className={styles.subtitle}>WCAG 2.1 AA Compliant</p>
          </div>

          <div className={styles.options} role="group" aria-labelledby="a11y-title">
            {/* Font Size */}
            <button
              className={styles.option}
              onClick={cycleFontSize}
              aria-label={`Change text size. Current: ${settings.fontSize}`}
            >
              <span className={styles.optionIcon}>
                {settings.fontSize === 'normal' && <Type size={20} />}
                {settings.fontSize === 'large' && <ZoomIn size={20} />}
                {settings.fontSize === 'x-large' && <ZoomOut size={20} />}
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

            {/* High Contrast */}
            <button
              className={`${styles.option} ${settings.highContrast ? styles.active : ''}`}
              onClick={toggleHighContrast}
              aria-label={`Toggle high contrast mode`}
              aria-pressed={settings.highContrast}
            >
              <span className={styles.optionIcon}>
                <Contrast size={20} />
              </span>
              <span className={styles.optionLabel}>
                High Contrast
                <span className={styles.optionValue}>
                  {settings.highContrast ? 'On' : 'Off'}
                </span>
              </span>
            </button>

            {/* Text Spacing (WCAG 1.4.12) */}
            <button
              className={`${styles.option} ${settings.textSpacing ? styles.active : ''}`}
              onClick={toggleTextSpacing}
              aria-label={`Toggle increased text spacing`}
              aria-pressed={settings.textSpacing}
            >
              <span className={styles.optionIcon}>
                <AlignJustify size={20} />
              </span>
              <span className={styles.optionLabel}>
                Text Spacing
                <span className={styles.optionValue}>
                  {settings.textSpacing ? 'On' : 'Off'}
                </span>
              </span>
            </button>

            {/* Reduced Motion */}
            <button
              className={`${styles.option} ${settings.reducedMotion ? styles.active : ''}`}
              onClick={toggleReducedMotion}
              aria-label={`Toggle reduced motion`}
              aria-pressed={settings.reducedMotion}
            >
              <span className={styles.optionIcon}>
                <Pause size={20} />
              </span>
              <span className={styles.optionLabel}>
                Reduce Motion
                <span className={styles.optionValue}>
                  {settings.reducedMotion ? 'On' : 'Off'}
                </span>
              </span>
            </button>

            {/* Color Blind Simulation */}
            <button
              className={`${styles.option} ${settings.colorBlindMode !== 'none' ? styles.active : ''}`}
              onClick={cycleColorBlindMode}
              aria-label={`Color blind simulation. Current: ${colorBlindLabels[settings.colorBlindMode]}`}
            >
              <span className={styles.optionIcon}>
                <Eye size={20} />
              </span>
              <span className={styles.optionLabel}>
                Color Blind Mode
                <span className={styles.optionValue}>
                  {colorBlindLabels[settings.colorBlindMode]}
                </span>
              </span>
            </button>
          </div>

          <button
            className={styles.reset}
            onClick={resetSettings}
            aria-label="Reset all accessibility settings to default"
          >
            <RotateCcw size={16} />
            Reset to Default
          </button>
        </div>
      )}
    </div>
  );
}
