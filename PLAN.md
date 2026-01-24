# ITravel - Image & StatsSection Lines Fix Plan

## Problem Summary
1. **StatsSection curved lines not visible** - CSS issues preventing lines from rendering
2. **Missing/broken images** - Partner logos missing, some Unsplash URLs unreliable
3. **Image quality inconsistent** - Need max resolution for all images

---

## Phase 1: Fix StatsSection Curved Lines (Immediate)

### Root Causes Identified:
1. **Z-index issue**: Grid has `z-index: 1`, SVG has no z-index → renders behind
2. **Stroke too thin**: `stroke-width: 0.15` is nearly invisible
3. **Opacity too low**: Final opacity of `0.7` is too faint
4. **Height constraint**: Fixed `100px` height may clip paths

### Fix in `StatsSection.module.scss`:
```scss
.curvedLines {
  z-index: 2;              // ADD: Render above the grid
  height: 120px;           // CHANGE: More room for curves
}

.curvePath {
  stroke-width: 2;         // CHANGE: From 0.15 to 2 (visible)
  stroke-dasharray: 300;   // CHANGE: Longer dash for full path
  stroke-dashoffset: 300;  // CHANGE: Match dasharray
}

.curvedLines.animate .curvePath {
  opacity: 1;              // CHANGE: From 0.7 to 1 (full visibility)
}
```

---

## Phase 2: Create Missing Partner Logo SVGs

### Missing Files:
- `/public/partners/airbnb.svg`
- `/public/partners/expedia.svg`
- `/public/partners/booking.svg`
- `/public/partners/tripadvisor.svg`
- `/public/partners/klm.svg`

### Action:
Create simple, professional placeholder SVG logos in `/public/partners/` directory.

---

## Phase 3: Image Strategy - Self-Host Critical Images

### Current Issue:
- Unsplash URLs are external dependencies (can fail, rate limit, change)
- Some URLs may be invalid or return wrong images

### Solution:
Download high-resolution images locally to `/public/images/`:
1. `/public/images/hero/` - Hero background (1920px wide)
2. `/public/images/destinations/` - 6 destination images (800px wide)
3. `/public/images/events/` - 3 event images (600px wide)
4. `/public/images/testimonials/` - 3 avatar images (150px)
5. `/public/images/about/` - 3 about section images (600px wide)
6. `/public/images/blog/` - 3 blog images (600px wide)
7. `/public/images/categories/` - 4 category images (600px wide)

### Image Quality Settings:
- Hero: 1920x1080, quality 90%
- Cards: 800x600, quality 85%
- Thumbnails: 300x300, quality 80%
- Avatars: 150x150, quality 80%

---

## Phase 4: Update siteData.ts with Local Paths

After downloading images, update all image references from:
```typescript
image: 'https://images.unsplash.com/...'
```
To:
```typescript
image: '/images/destinations/tirana.jpg'
```

---

## Phase 5: Performance Optimization

1. **Next.js Image Optimization**: Ensure all `<Image>` components use proper sizing
2. **Lazy Loading**: All below-fold images use `loading="lazy"`
3. **WebP Format**: Next.js will auto-convert to WebP where supported
4. **Blur Placeholders**: Add blur data URLs for smooth loading

---

## Execution Order

1. ✅ Fix StatsSection CSS (z-index, stroke-width, opacity)
2. ✅ Create partner logo SVGs
3. ✅ Download and save all images locally
4. ✅ Update siteData.ts with local paths
5. ✅ Test all images load correctly
6. ✅ Verify StatsSection lines animate properly

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/StatsSection/StatsSection.module.scss` | Fix z-index, stroke-width, opacity |
| `public/partners/*.svg` | Create 5 partner logos |
| `public/images/**/*` | Download all images |
| `src/data/siteData.ts` | Update image paths to local |

