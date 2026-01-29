/**
 * Constants Module
 *
 * Central export for all application constants.
 *
 * Usage:
 * ```typescript
 * import { BRAND, STORAGE_KEYS, TIMING } from '@/lib/constants';
 *
 * console.log(BRAND.name); // 'IBookTours'
 * localStorage.setItem(STORAGE_KEYS.theme, 'dark');
 * setTimeout(fn, TIMING.TOAST_DURATION);
 * ```
 */

export {
  BRAND,
  STORAGE_KEYS,
  BRAND_COLORS,
  SEO_DEFAULTS,
  type BrandConfig,
  type StorageKeys,
} from './brand';

export {
  TIMING,
  ANIMATION,
  type TimingConfig,
  type AnimationConfig,
} from './timing';
