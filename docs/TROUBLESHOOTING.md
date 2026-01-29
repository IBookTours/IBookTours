# Troubleshooting Guide

Common issues and their solutions for the IBookTours project.

## Deployment Issues

### Vercel Deployment Fails with ERESOLVE

**Error:**
```
npm error ERESOLVE could not resolve
npm error peer @types/react@"^19.2" from @sanity/schema@5.6.0
```

**Cause:** Conflicting peer dependencies between Sanity packages and React 18.

**Solution:**
1. Remove conflicting packages from `package.json`:
   ```json
   // Remove these if present:
   "@sanity/schema": "^5.6.0",
   "@sanity/types": "^5.6.0"
   ```
2. These packages are included in `sanity` and `next-sanity` - no need to install separately
3. Clean install:
   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm cache clean --force
   npm install
   npm run build
   ```

## Mobile/iOS Issues

### Video Not Playing on iOS

**Symptoms:** Hero video doesn't autoplay on iPhone/iPad.

**Solutions:**
1. Ensure video element has required attributes:
   ```tsx
   <video
     autoPlay
     muted
     loop
     playsInline
     webkit-playsinline="true"
     preload="metadata"
   />
   ```
2. Videos must be muted for autoplay to work on iOS
3. Use MP4 format with H.264 codec for best compatibility
4. Add user gesture handler for iOS Safari:
   ```tsx
   document.addEventListener('touchstart', () => {
     video.play().catch(() => {});
   }, { once: true });
   ```

### Horizontal Scroll on Mobile

**Symptoms:** Line visible on right side when zooming out.

**Causes:**
- Elements with `width: 100vw` (includes scrollbar width)
- Negative margins without overflow control

**Solutions:**
1. Add to `globals.scss`:
   ```scss
   html, body {
     overflow-x: hidden;
     max-width: 100%;
   }
   ```
2. Replace `width: 100vw` with `width: 100%`
3. Audit components for negative margins

### Tooltip Appearing on Wrong Button

**Symptoms:** WhatsApp tooltip shows on Accessibility button.

**Cause:** Z-index stacking conflict between floating widgets.

**Solution:** Update AccessibilityWidget z-index:
```scss
.widget {
  z-index: 599;  // Below WhatsApp (600) when closed

  &.isOpen {
    z-index: 800;  // Above everything when open
  }
}
```

## Form Issues

### Form Accepts Invalid Email/Phone

**Symptoms:** Checkout or contact form accepts any input.

**Solution:** Use the validation utility at `src/utils/validation.ts`:
```tsx
import { validateEmail, validatePhone, validateName } from '@/utils/validation';

// Validate before submission
if (!validateEmail(formData.email)) {
  setErrors({ email: 'Please enter a valid email address' });
  return;
}
```

## Styling Issues

### Theme Colors Not Applying

**Symptoms:** Components show wrong colors in light/dark mode.

**Solutions:**
1. Use CSS variables instead of hardcoded colors:
   ```scss
   // Bad
   color: #1d3557;

   // Good
   color: var(--text-primary);
   ```
2. Check that the variable is defined in both `:root` and `:root[data-theme="dark"]`
3. Verify the component imports `@/styles/variables`

### Glassmorphism Not Visible in Light Mode

**Cause:** White glass on honeydew background has no contrast.

**Solution:** Use frosted blue tint for light mode:
```scss
--glass-bg: rgba(168, 218, 220, 0.65);  // Frosted Blue
--glass-border: rgba(69, 123, 157, 0.4);  // Cerulean
```

## Build Issues

### Build Fails with Missing Module

**Solution:**
```bash
rm -rf node_modules .next
npm install
npm run build
```

### TypeScript Errors After Package Update

**Solution:**
1. Check for breaking changes in package changelog
2. Update type definitions:
   ```bash
   npm install @types/react@latest @types/node@latest
   ```

## Sanity Issues

### Content Not Loading

**Symptoms:** Pages show loading state indefinitely.

**Solutions:**
1. Check Sanity project ID and dataset in `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
2. Verify API token has read permissions
3. App will fallback to mock data in `src/data/` if Sanity is unavailable

### Studio Shows Blank Page

**Solutions:**
1. Check browser console for CORS errors
2. Add your domain to Sanity CORS origins at sanity.io/manage
3. Clear browser cache and cookies

## Performance Issues

### Slow Page Load

**Solutions:**
1. Check for large unoptimized images - use Next.js Image component
2. Enable lazy loading for below-fold content
3. Review bundle size with `npm run build` output
4. Add loading states for async content

### High Memory Usage

**Solutions:**
1. Avoid `100vw` width calculations (causes reflow)
2. Debounce scroll event handlers
3. Use `will-change` sparingly
4. Implement virtualization for long lists

## Getting Help

If your issue isn't listed here:

1. Check the [GitHub Issues](https://github.com/your-repo/ibooktours/issues)
2. Review recent commits for related changes
3. Enable verbose logging in development
4. Check browser DevTools console and Network tab
