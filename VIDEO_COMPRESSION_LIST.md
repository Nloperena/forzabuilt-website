# Video Compression List - Astro Migration Project (In-Use Videos Only)

## Overview

This document lists **only the videos that are actually used in the codebase**. These are the videos you need to compress one by one with Adobe Media Encoder.

**Note:** These videos are sorted by their expected current sizes (largest first) for efficient processing.

---

## Videos Used in the Codebase

### Background Videos (Hero Sections & Banners)

1. **`public/videos/backgrounds/Eagle Header Video.mp4`**
   - **Used in:** `contact.astro`, `HeroVideoSection.tsx`, `EagleHeroVideo.tsx`
   - **Current Size:** ~54.49 MB (estimated from original list)
   - **Target Size:** 3-5 MB after compression

2. **`public/videos/backgrounds/Product Summary Page Video.mp4`**
   - **Used in:** `products/index.astro`, `ApproachSectionUnified.tsx`
   - **Current Size:** ~16.08 MB
   - **Target Size:** 1-2 MB after compression

3. **`public/videos/backgrounds/Industry Summary Page Video.mp4`**
   - **Used in:** `industries/index.astro`, `ApproachSectionUnified.tsx`
   - **Current Size:** ~14.19 MB
   - **Target Size:** 1-2 MB after compression

4. **`public/videos/backgrounds/Industry Summary Video for Mobile.mp4`**
   - **Used in:** `industries/index.astro` (mobile variant)
   - **Current Size:** ~26.68 MB
   - **Target Size:** 2-3 MB after compression

5. **`public/videos/backgrounds/Manufactured in America.mp4`**
   - **Used in:** `MadeInAmericaSection.tsx`
   - **Current Size:** ~41.52 MB
   - **Target Size:** 3-5 MB after compression

6. **`public/videos/backgrounds/Forza Building Video for Desktop.mp4`**
   - **Used in:** `about.astro`
   - **Current Size:** ~17.5 MB
   - **Target Size:** 1-2 MB after compression

7. **`public/videos/backgrounds/Forza Slogan Slam Final.mp4`**
   - **Used in:** `ScalableHeroVideoSection.tsx`
   - **Current Size:** ~8.48 MB
   - **Target Size:** 1-2 MB after compression

8. **`public/videos/backgrounds/Purpose Built Products.mp4`**
   - **Used in:** `ApproachSectionUnified.tsx`
   - **Current Size:** ~2.83 MB
   - **Target Size:** 0.5-1 MB after compression

9. **`public/videos/backgrounds/Sustainability That Works.mp4`**
   - **Used in:** `ApproachSectionUnified.tsx`
   - **Current Size:** ~4.8 MB
   - **Target Size:** 0.5-1.5 MB after compression

### Industry-Specific Banner Videos

10. **`public/videos/backgrounds/Final-Industrial-Page-Banner-Video.mp4`**
    - **Used in:** `data/industries.ts`, `data/industries/industrial.ts`
    - **Current Size:** ~5.94 MB
    - **Target Size:** 0.5-1.5 MB after compression

11. **`public/videos/backgrounds/Final-Construction-Page-Banner-Video-1.mp4`**
    - **Used in:** `data/industries.ts` (Construction industry)
    - **Current Size:** ~7.44 MB
    - **Target Size:** 1-2 MB after compression

12. **`public/videos/backgrounds/Final-Forza-Insulation-Header-Video_1.mp4`**
    - **Used in:** `data/industries.ts` (Insulation industry)
    - **Current Size:** ~10.82 MB
    - **Target Size:** 1-2 MB after compression

### Misc Videos (Industry Loops)

13. **`public/videos/misc/forzaTRuck2-Compressed.mp4`**
    - **Used in:** `data/industries.ts` (Transportation industry)
    - **Current Size:** ~3.61 MB
    - **Note:** Already says "Compressed" - check if can be further optimized
    - **Target Size:** 0.5-1 MB after compression

14. **`public/videos/misc/ForzaBoatLoop-Compressed.mp4`**
    - **Used in:** `data/industries.ts` (Marine industry)
    - **Current Size:** ~12.55 MB
    - **Note:** Already says "Compressed" - check if can be further optimized
    - **Target Size:** 1-2 MB after compression

15. **`public/videos/misc/ForzaTurbineLoop-Compressed.mp4`**
    - **Used in:** `data/industries.ts` (Composites industry)
    - **Current Size:** ~16.14 MB
    - **Note:** Already says "Compressed" - check if can be further optimized
    - **Target Size:** 1-2 MB after compression

---

## Summary

**Total In-Use Videos:** 15 files  
**Estimated Current Total Size:** ~244 MB (estimated from original list)  
**Target After Compression:** ~20-30 MB  
**Expected Savings:** ~214-224 MB (85-92% reduction)

---

## Adobe Media Encoder Settings

### Recommended Export Settings:

**Format:** H.264  
**Preset:** Match Source - High Bitrate (then customize)

**Video Settings:**
- **Bitrate Encoding:** VBR, 2 pass
- **Target Bitrate:** 5-8 Mbps (for web)
- **Max Bitrate:** 10-12 Mbps
- **Frame Rate:** Match source (usually 30fps or 24fps)
- **Resolution:** Match source (or reduce if source is 4K+)
- **Profile:** High
- **Level:** 4.0 or 4.2

**Audio Settings:**
- **Codec:** AAC
- **Bitrate:** 128 kbps
- **Sample Rate:** 48 kHz

**Advanced:**
- **Key Frame Distance:** 2 seconds (60 frames at 30fps)
- **Optimize for:** Web

### Target File Sizes by Video Size Category:

- **Large videos (>40 MB):** Target 3-5 MB after compression
- **Medium videos (15-40 MB):** Target 2-3 MB after compression
- **Small videos (10-15 MB):** Target 1-2 MB after compression
- **Small videos (<10 MB):** Target 0.5-1.5 MB after compression

---

## Quick Reference - Copy-Paste Ready File Paths

```
public/videos/backgrounds/Eagle Header Video.mp4
public/videos/backgrounds/Manufactured in America.mp4
public/videos/backgrounds/Industry Summary Video for Mobile.mp4
public/videos/backgrounds/Forza Building Video for Desktop.mp4
public/videos/backgrounds/Product Summary Page Video.mp4
public/videos/backgrounds/Industry Summary Page Video.mp4
public/videos/backgrounds/Final-Forza-Insulation-Header-Video_1.mp4
public/videos/misc/ForzaTurbineLoop-Compressed.mp4
public/videos/misc/ForzaBoatLoop-Compressed.mp4
public/videos/backgrounds/Final-Construction-Page-Banner-Video-1.mp4
public/videos/backgrounds/Forza Slogan Slam Final.mp4
public/videos/backgrounds/Sustainability That Works.mp4
public/videos/backgrounds/Final-Industrial-Page-Banner-Video.mp4
public/videos/backgrounds/Purpose Built Products.mp4
public/videos/misc/forzaTRuck2-Compressed.mp4
```

---

## Processing Notes

- Process videos one by one in order (largest first for maximum impact)
- Test playback after compression to ensure quality is acceptable
- Keep original files as backup until you verify the compressed versions work
- The "Compressed" files in the misc folder may already be optimized - check their actual file sizes first before processing
- After compression, replace the originals with the compressed versions
- Update this document with actual file sizes after compression for reference

---

## Files NOT in This List

The following videos from the original list are **NOT used in the codebase** and can be ignored or deleted:

- `Bald-Ealge-is-My-Hero.mp4` (typo in filename, not used)
- `Eagle Header Video_2.mp4` (duplicate/older version)
- `Eagle Header Video_2_1.mp4` (duplicate/older version)
- `Made in America Video 1.mp4` (different from "Manufactured in America.mp4")
- `Forza Building Video.mp4` (different from "Forza Building Video for Desktop.mp4")
- `Forza Building Video for Mobile.mp4` (not used)
- `Moleculesubtle.mp4` (not used)
- `Moleculesubtle2.mp4` (not used)
- `American Flag.mp4` (not used)
- `Forza Slogan Slam Final 1.mp4` (duplicate)
- `Forza Slogan Slam Final 2.mp4` (duplicate)
- `Forza Slogan Slam Final 3.mp4` (duplicate)
- `Lion_Walk.mp4` (already deleted)
- `ForzaLionLoop-1-2.mp4` (already deleted)
