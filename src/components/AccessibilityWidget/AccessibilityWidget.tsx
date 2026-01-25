'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Accessibility,
  X,
  Contrast,
  Pause,
  RotateCcw,
  Focus,
  BookOpen,
  Palette,
  Eye,
  Type,
  AlignLeft,
  Space,
} from 'lucide-react';
import { useFocusTrap, useAriaLive } from '@/hooks';
import styles from './AccessibilityWidget.module.scss';

type TabType = 'visual' | 'reading' | 'color';
type FontSizeType = '100' | '125' | '150';

interface AccessibilitySettings {
  // Visual
  highContrast: boolean;
  fontSize: FontSizeType;
  reducedMotion: boolean;
  focusIndicators: boolean;
  // Reading
  dyslexiaFont: boolean;
  lineHeight: 'normal' | 'increased' | 'large';
  letterSpacing: boolean;
  // Color
  colorBlindMode: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';
  invertColors: boolean;
  saturation: 'normal' | 'low' | 'high';
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  fontSize: '100',
  reducedMotion: false,
  focusIndicators: false,
  dyslexiaFont: false,
  lineHeight: 'normal',
  letterSpacing: false,
  colorBlindMode: 'none',
  invertColors: false,
  saturation: 'normal',
};

const colorBlindLabels: Record<AccessibilitySettings['colorBlindMode'], string> = {
  none: 'Off',
  deuteranopia: 'Deuteranopia',
  protanopia: 'Protanopia',
  tritanopia: 'Tritanopia',
};

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('visual');
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
    html.classList.remove('font-100', 'font-125', 'font-150');
    html.classList.add(`font-${newSettings.fontSize}`);

    // High contrast
    html.classList.toggle('high-contrast', newSettings.highContrast);

    // Reduced motion
    html.classList.toggle('reduced-motion', newSettings.reducedMotion);

    // Focus indicators
    html.classList.toggle('focus-indicators', newSettings.focusIndicators);

    // Dyslexia font
    html.classList.toggle('dyslexia-font', newSettings.dyslexiaFont);

    // Line height
    html.classList.remove('line-height-normal', 'line-height-increased', 'line-height-large');
    html.classList.add(`line-height-${newSettings.lineHeight}`);

    // Letter spacing
    html.classList.toggle('letter-spacing', newSettings.letterSpacing);

    // Color blind modes
    html.classList.remove('colorblind-deuteranopia', 'colorblind-protanopia', 'colorblind-tritanopia');
    if (newSettings.colorBlindMode !== 'none') {
      html.classList.add(`colorblind-${newSettings.colorBlindMode}`);
    }

    // Invert colors
    html.classList.toggle('invert-colors', newSettings.invertColors);

    // Saturation
    html.classList.remove('saturation-normal', 'saturation-low', 'saturation-high');
    html.classList.add(`saturation-${newSettings.saturation}`);
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

  // Visual Tab Functions
  const toggleHighContrast = () => {
    const newValue = !settings.highContrast;
    updateSettings(
      { ...settings, highContrast: newValue },
      `High contrast ${newValue ? 'enabled' : 'disabled'}`
    );
  };

  const setFontSize = (size: FontSizeType) => {
    const labels = { '100': '100%', '125': '125%', '150': '150%' };
    updateSettings(
      { ...settings, fontSize: size },
      `Text size changed to ${labels[size]}`
    );
  };

  const toggleReducedMotion = () => {
    const newValue = !settings.reducedMotion;
    updateSettings(
      { ...settings, reducedMotion: newValue },
      `Reduced motion ${newValue ? 'enabled' : 'disabled'}`
    );
  };

  const toggleFocusIndicators = () => {
    const newValue = !settings.focusIndicators;
    updateSettings(
      { ...settings, focusIndicators: newValue },
      `Focus indicators ${newValue ? 'enabled' : 'disabled'}`
    );
  };

  // Reading Tab Functions
  const toggleDyslexiaFont = () => {
    const newValue = !settings.dyslexiaFont;
    updateSettings(
      { ...settings, dyslexiaFont: newValue },
      `Dyslexia-friendly font ${newValue ? 'enabled' : 'disabled'}`
    );
  };

  const cycleLineHeight = () => {
    const heights: AccessibilitySettings['lineHeight'][] = ['normal', 'increased', 'large'];
    const currentIndex = heights.indexOf(settings.lineHeight);
    const nextIndex = (currentIndex + 1) % heights.length;
    const newHeight = heights[nextIndex];
    const labels = { normal: 'Normal', increased: 'Increased', large: 'Large' };
    updateSettings(
      { ...settings, lineHeight: newHeight },
      `Line height changed to ${labels[newHeight]}`
    );
  };

  const toggleLetterSpacing = () => {
    const newValue = !settings.letterSpacing;
    updateSettings(
      { ...settings, letterSpacing: newValue },
      `Letter spacing ${newValue ? 'increased' : 'normal'}`
    );
  };

  // Color Tab Functions
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
      `Color blind mode: ${colorBlindLabels[newMode]}`
    );
  };

  const toggleInvertColors = () => {
    const newValue = !settings.invertColors;
    updateSettings(
      { ...settings, invertColors: newValue },
      `Invert colors ${newValue ? 'enabled' : 'disabled'}`
    );
  };

  const cycleSaturation = () => {
    const saturations: AccessibilitySettings['saturation'][] = ['normal', 'low', 'high'];
    const currentIndex = saturations.indexOf(settings.saturation);
    const nextIndex = (currentIndex + 1) % saturations.length;
    const newSaturation = saturations[nextIndex];
    const labels = { normal: 'Normal', low: 'Low', high: 'High' };
    updateSettings(
      { ...settings, saturation: newSaturation },
      `Saturation changed to ${labels[newSaturation]}`
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

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'visual', label: 'Visual', icon: <Eye size={16} /> },
    { id: 'reading', label: 'Reading', icon: <BookOpen size={16} /> },
    { id: 'color', label: 'Color', icon: <Palette size={16} /> },
  ];

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

          {/* Tab Navigation */}
          <div className={styles.tabNav} role="tablist" aria-label="Accessibility settings tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Panels */}
          <div className={styles.tabContent}>
            {/* Visual Tab */}
            {activeTab === 'visual' && (
              <div
                id="tabpanel-visual"
                role="tabpanel"
                aria-labelledby="tab-visual"
                className={styles.tabPanel}
              >
                {/* High Contrast */}
                <div className={styles.optionRow}>
                  <div className={styles.optionInfo}>
                    <Contrast size={18} />
                    <span>High Contrast</span>
                  </div>
                  <button
                    className={`${styles.toggle} ${settings.highContrast ? styles.toggleOn : ''}`}
                    onClick={toggleHighContrast}
                    aria-pressed={settings.highContrast}
                    aria-label="Toggle high contrast mode"
                  >
                    <span className={styles.toggleTrack}>
                      <span className={styles.toggleThumb} />
                    </span>
                  </button>
                </div>

                {/* Text Size */}
                <div className={styles.optionRow}>
                  <div className={styles.optionInfo}>
                    <Type size={18} />
                    <span>Text Size</span>
                  </div>
                  <div className={styles.sizeButtons}>
                    {(['100', '125', '150'] as FontSizeType[]).map((size) => (
                      <button
                        key={size}
                        className={`${styles.sizeBtn} ${settings.fontSize === size ? styles.sizeBtnActive : ''}`}
                        onClick={() => setFontSize(size)}
                        aria-pressed={settings.fontSize === size}
                        aria-label={`Set text size to ${size}%`}
                      >
                        {size}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reduce Motion */}
                <div className={styles.optionRow}>
                  <div className={styles.optionInfo}>
                    <Pause size={18} />
                    <span>Reduce Motion</span>
                  </div>
                  <button
                    className={`${styles.toggle} ${settings.reducedMotion ? styles.toggleOn : ''}`}
                    onClick={toggleReducedMotion}
                    aria-pressed={settings.reducedMotion}
                    aria-label="Toggle reduced motion"
                  >
                    <span className={styles.toggleTrack}>
                      <span className={styles.toggleThumb} />
                    </span>
                  </button>
                </div>

                {/* Focus Indicators */}
                <div className={styles.optionRow}>
                  <div className={styles.optionInfo}>
                    <Focus size={18} />
                    <span>Focus Indicators</span>
                  </div>
                  <button
                    className={`${styles.toggle} ${settings.focusIndicators ? styles.toggleOn : ''}`}
                    onClick={toggleFocusIndicators}
                    aria-pressed={settings.focusIndicators}
                    aria-label="Toggle focus indicators"
                  >
                    <span className={styles.toggleTrack}>
                      <span className={styles.toggleThumb} />
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Reading Tab */}
            {activeTab === 'reading' && (
              <div
                id="tabpanel-reading"
                role="tabpanel"
                aria-labelledby="tab-reading"
                className={styles.tabPanel}
              >
                {/* Dyslexia Font */}
                <div className={styles.optionRow}>
                  <div className={styles.optionInfo}>
                    <Type size={18} />
                    <span>Dyslexia Font</span>
                  </div>
                  <button
                    className={`${styles.toggle} ${settings.dyslexiaFont ? styles.toggleOn : ''}`}
                    onClick={toggleDyslexiaFont}
                    aria-pressed={settings.dyslexiaFont}
                    aria-label="Toggle dyslexia-friendly font"
                  >
                    <span className={styles.toggleTrack}>
                      <span className={styles.toggleThumb} />
                    </span>
                  </button>
                </div>

                {/* Line Height */}
                <div className={styles.optionRow}>
                  <div className={styles.optionInfo}>
                    <AlignLeft size={18} />
                    <span>Line Height</span>
                  </div>
                  <button
                    className={styles.cycleBtn}
                    onClick={cycleLineHeight}
                    aria-label={`Line height: ${settings.lineHeight}. Click to change.`}
                  >
                    {settings.lineHeight === 'normal' && 'Normal'}
                    {settings.lineHeight === 'increased' && 'Increased'}
                    {settings.lineHeight === 'large' && 'Large'}
                  </button>
                </div>

                {/* Letter Spacing */}
                <div className={styles.optionRow}>
                  <div className={styles.optionInfo}>
                    <Space size={18} />
                    <span>Letter Spacing</span>
                  </div>
                  <button
                    className={`${styles.toggle} ${settings.letterSpacing ? styles.toggleOn : ''}`}
                    onClick={toggleLetterSpacing}
                    aria-pressed={settings.letterSpacing}
                    aria-label="Toggle increased letter spacing"
                  >
                    <span className={styles.toggleTrack}>
                      <span className={styles.toggleThumb} />
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Color Tab */}
            {activeTab === 'color' && (
              <div
                id="tabpanel-color"
                role="tabpanel"
                aria-labelledby="tab-color"
                className={styles.tabPanel}
              >
                {/* Color Blind Mode */}
                <div className={styles.optionRow}>
                  <div className={styles.optionInfo}>
                    <Eye size={18} />
                    <span>Color Blind Mode</span>
                  </div>
                  <button
                    className={styles.cycleBtn}
                    onClick={cycleColorBlindMode}
                    aria-label={`Color blind mode: ${colorBlindLabels[settings.colorBlindMode]}. Click to change.`}
                  >
                    {colorBlindLabels[settings.colorBlindMode]}
                  </button>
                </div>

                {/* Invert Colors */}
                <div className={styles.optionRow}>
                  <div className={styles.optionInfo}>
                    <Contrast size={18} />
                    <span>Invert Colors</span>
                  </div>
                  <button
                    className={`${styles.toggle} ${settings.invertColors ? styles.toggleOn : ''}`}
                    onClick={toggleInvertColors}
                    aria-pressed={settings.invertColors}
                    aria-label="Toggle invert colors"
                  >
                    <span className={styles.toggleTrack}>
                      <span className={styles.toggleThumb} />
                    </span>
                  </button>
                </div>

                {/* Saturation */}
                <div className={styles.optionRow}>
                  <div className={styles.optionInfo}>
                    <Palette size={18} />
                    <span>Saturation</span>
                  </div>
                  <button
                    className={styles.cycleBtn}
                    onClick={cycleSaturation}
                    aria-label={`Saturation: ${settings.saturation}. Click to change.`}
                  >
                    {settings.saturation === 'normal' && 'Normal'}
                    {settings.saturation === 'low' && 'Low'}
                    {settings.saturation === 'high' && 'High'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            className={styles.reset}
            onClick={resetSettings}
            aria-label="Reset all accessibility settings to default"
          >
            <RotateCcw size={16} />
            Reset to Defaults
          </button>
        </div>
      )}
    </div>
  );
}
