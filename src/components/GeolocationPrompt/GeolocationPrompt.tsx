'use client';

import { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from './GeolocationPrompt.module.scss';

const STORAGE_KEY = 'geolocation-asked';
const LOCATION_KEY = 'user-location';

export default function GeolocationPrompt() {
  const t = useTranslations('geolocation');
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if we've already asked
    const asked = localStorage.getItem(STORAGE_KEY);
    if (asked) return;

    // Check current permission state (if supported)
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'prompt') {
          // Delay showing prompt to not overwhelm user on first visit
          setTimeout(() => setShowPrompt(true), 3000);
        } else {
          // Already granted or denied, mark as asked
          localStorage.setItem(STORAGE_KEY, 'true');
        }
      }).catch(() => {
        // Permissions API not fully supported, show prompt anyway
        setTimeout(() => setShowPrompt(true), 3000);
      });
    } else {
      // Permissions API not supported, show prompt
      setTimeout(() => setShowPrompt(true), 3000);
    }
  }, []);

  const handleAllow = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Store location for personalization
        localStorage.setItem(LOCATION_KEY, JSON.stringify({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now(),
        }));
        localStorage.setItem(STORAGE_KEY, 'true');
        setShowPrompt(false);
        setIsLoading(false);
      },
      () => {
        // User denied or error occurred
        localStorage.setItem(STORAGE_KEY, 'true');
        setShowPrompt(false);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 86400000, // 24 hours
      }
    );
  };

  const handleDeny = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-labelledby="geo-title" aria-describedby="geo-desc">
        <button
          className={styles.closeBtn}
          onClick={handleDeny}
          aria-label={t('close')}
        >
          <X size={20} />
        </button>

        <div className={styles.iconWrapper}>
          <MapPin className={styles.icon} size={32} />
        </div>

        <h3 id="geo-title" className={styles.title}>{t('title')}</h3>
        <p id="geo-desc" className={styles.description}>
          {t('description')}
        </p>

        <div className={styles.buttons}>
          <button
            onClick={handleDeny}
            className={styles.denyBtn}
            disabled={isLoading}
          >
            {t('notNow')}
          </button>
          <button
            onClick={handleAllow}
            className={styles.allowBtn}
            disabled={isLoading}
          >
            {isLoading ? t('requesting') : t('allow')}
          </button>
        </div>
      </div>
    </div>
  );
}
