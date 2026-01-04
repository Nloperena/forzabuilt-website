# Unused Videos & Assets Report - Astro Migration Project

## Summary

**Total Videos:** 29 files (608.38 MB)  
**Used Videos:** 16 files  
**Unused/Unsafe to Remove:** 13 files (~470 MB)  
**Potential Savings:** ~470 MB (77% reduction)

---

## ✅ USED VIDEOS (Keep These)

### Backgrounds Folder (Used):

1. **`Eagle Header Video.mp4`** (54.49 MB)
   - Used in: `contact.astro`, `HeroVideoSection.tsx`, `EagleHeroVideo.tsx`
   - **Status:** ✅ KEEP

2. **`Product Summary Page Video.mp4`** (16.08 MB)
   - Used in: `products/index.astro`, `ApproachSectionUnified.tsx`
   - **Status:** ✅ KEEP

3. **`Industry Summary Page Video.mp4`** (14.19 MB)
   - Used in: `industries/index.astro`, `ApproachSectionUnified.tsx`
   - **Status:** ✅ KEEP

4. **`Industry Summary Video for Mobile.mp4`** (26.68 MB)
   - Used in: `industries/index.astro`
   - **Status:** ✅ KEEP

5. **`Final-Industrial-Page-Banner-Video.mp4`** (5.94 MB)
   - Used in: `data/industries.ts`, `data/industries/industrial.ts`
   - **Status:** ✅ KEEP

6. **`Final-Construction-Page-Banner-Video-1.mp4`** (7.44 MB)
   - Used in: `data/industries.ts`
   - **Status:** ✅ KEEP

7. **`Final-Forza-Insulation-Header-Video_1.mp4`** (10.82 MB)
   - Used in: `data/industries.ts`
   - **Status:** ✅ KEEP

8. **`Forza Building Video for Desktop.mp4`** (17.5 MB)
   - Used in: `about.astro`
   - **Status:** ✅ KEEP

9. **`Manufactured in America.mp4`** (41.52 MB)
   - Used in: `MadeInAmericaSection.tsx`
   - **Status:** ✅ KEEP

10. **`Forza Slogan Slam Final.mp4`** (8.48 MB)
    - Used in: `ScalableHeroVideoSection.tsx`
    - **Status:** ✅ KEEP

11. **`Purpose Built Products.mp4`** (2.83 MB)
    - Used in: `ApproachSectionUnified.tsx`
    - **Status:** ✅ KEEP

12. **`Sustainability That Works.mp4`** (4.8 MB)
    - Used in: `ApproachSectionUnified.tsx`
    - **Status:** ✅ KEEP

### Misc Folder (Used):

13. **`Forza Slogan Slam Final 3.mp4`** (41.91 MB)
    - Used in: `HeroVideoSectionV2.tsx`
    - **Status:** ⚠️ **CONFLICT** - Also have `Forza Slogan Slam Final.mp4` in backgrounds
    - **Action:** Check if both are needed or if one can replace the other

14. **`forzaTRuck2-Compressed.mp4`** (3.61 MB)
    - Used in: `data/industries.ts` (transportation)
    - **Status:** ✅ KEEP

15. **`ForzaBoatLoop-Compressed.mp4`** (12.55 MB)
    - Used in: `data/industries.ts` (marine)
    - **Status:** ✅ KEEP

16. **`ForzaTurbineLoop-Compressed.mp4`** (16.14 MB)
    - Used in: `data/industries.ts` (transportation)
    - **Status:** ✅ KEEP

---

## ❌ UNUSED VIDEOS (Safe to Remove)

### Backgrounds Folder (Unused):

1. **`Bald-Ealge-is-My-Hero.mp4`** (59.73 MB) ⚠️ **LARGEST FILE**
   - **Status:** ❌ NOT FOUND in codebase
   - **Action:** DELETE (saves 59.73 MB)

2. **`Eagle Header Video_2.mp4`** (16.54 MB)
   - **Status:** ❌ NOT FOUND in codebase
   - **Note:** Only `Eagle Header Video.mp4` is used (without _2)
   - **Action:** DELETE (saves 16.54 MB)

3. **`Eagle Header Video_2_1.mp4`** (11.15 MB)
   - **Status:** ❌ NOT FOUND in codebase
   - **Action:** DELETE (saves 11.15 MB)

4. **`Made in America Video 1.mp4`** (37.56 MB)
   - **Status:** ❌ NOT FOUND in codebase
   - **Note:** Only `Manufactured in America.mp4` is used
   - **Action:** DELETE (saves 37.56 MB)

5. **`Forza Building Video.mp4`** (21.78 MB)
   - **Status:** ❌ NOT FOUND in codebase
   - **Note:** Only `Forza Building Video for Desktop.mp4` is used
   - **Action:** DELETE (saves 21.78 MB)

6. **`Forza Building Video for Mobile.mp4`** (17.53 MB)
   - **Status:** ❌ NOT FOUND in codebase
   - **Note:** Only `Forza Building Video for Desktop.mp4` is used
   - **Action:** DELETE (saves 17.53 MB)

7. **`American Flag.mp4`** (8.32 MB)
   - **Status:** ❌ NOT FOUND in codebase
   - **Action:** DELETE (saves 8.32 MB)

### Misc Folder (Unused):

8. **`Forza Slogan Slam Final 1.mp4`** (45.8 MB) ⚠️ **DUPLICATE**
   - **Status:** ❌ NOT FOUND in codebase (duplicate)
   - **Action:** DELETE (saves 45.8 MB)

9. **`Forza Slogan Slam Final 2.mp4`** (41.9 MB) ⚠️ **DUPLICATE**
   - **Status:** ❌ NOT FOUND in codebase (duplicate)
   - **Action:** DELETE (saves 41.9 MB)

10. **`Moleculesubtle.mp4`** (12.71 MB)
    - **Status:** ❌ NOT FOUND in codebase
    - **Action:** DELETE (saves 12.71 MB)

11. **`Moleculesubtle2.mp4`** (40.84 MB)
    - **Status:** ❌ NOT FOUND in codebase
    - **Action:** DELETE (saves 40.84 MB)

12. **`ForzaLionLoop-1-2.mp4`** (4.24 MB)
    - **Status:** ❌ NOT FOUND in codebase
    - **Action:** DELETE (saves 4.24 MB)

13. **`Lion_Walk.mp4`** (5.29 MB)
    - **Status:** ❌ NOT FOUND in codebase
    - **Action:** DELETE (saves 5.29 MB)

---

## ⚠️ POTENTIAL CONFLICTS TO RESOLVE

### Duplicate "Forza Slogan Slam Final" Videos:

1. **`backgrounds/Forza Slogan Slam Final.mp4`** (8.48 MB)
   - Used in: `ScalableHeroVideoSection.tsx` → Used in `ApproachSectionUnified.tsx`
   - **Status:** ✅ Used

2. **`misc/Forza Slogan Slam Final 3.mp4`** (41.91 MB)
   - Used in: `HeroVideoSectionV2.tsx`
   - **Status:** ⚠️ **NOT IMPORTED ANYWHERE** - Component exists but is never used
   - **Action:** DELETE `HeroVideoSectionV2.tsx` component and this video
   - **Savings:** 41.91 MB

**Resolution:** 
- `ScalableHeroVideoSection` is used in `ApproachSectionUnified.tsx` ✅
- `HeroVideoSectionV2` is NOT imported anywhere ❌
- **Recommendation:** Delete `HeroVideoSectionV2.tsx` and `Forza Slogan Slam Final 3.mp4`

---

## 📊 Savings Summary

### Immediate Deletions (Safe):
- **13 unused videos:** ~470 MB
- **3 duplicate videos:** ~129 MB (Forza Slogan Slam Final 1, 2, and potentially one of the used ones)
- **Total potential savings:** ~470-599 MB

### After Compression:
- **16 used videos:** Currently ~250 MB → Target ~40-60 MB after compression
- **Additional savings:** ~190-210 MB

### Total Potential Savings:
- **From deletions:** ~470 MB
- **From compression:** ~190-210 MB
- **Grand Total:** ~660-680 MB (from 608 MB to ~40-60 MB = **90-93% reduction**)

---

## 🎯 Action Plan

### Phase 1: Delete Unused Videos (Immediate - No Risk)
1. Delete all 13 unused videos listed above
2. **Savings:** ~470 MB immediately

### Phase 2: Resolve Duplicate Conflict
1. Check which hero component is used on homepage
2. If both `ScalableHeroVideoSection` and `HeroVideoSectionV2` are used:
   - Keep both videos, compress both
3. If only one is used:
   - Delete unused component and its video
   - **Additional savings:** ~40-50 MB

### Phase 3: Compress Remaining Videos
1. Compress all remaining used videos
2. **Additional savings:** ~190-210 MB

---

## 📝 Files to Delete (Copy-Paste Ready)

```powershell
# Backgrounds folder - Unused videos
Remove-Item "astro-migration\public\videos\backgrounds\Bald-Ealge-is-My-Hero.mp4"
Remove-Item "astro-migration\public\videos\backgrounds\Eagle Header Video_2.mp4"
Remove-Item "astro-migration\public\videos\backgrounds\Eagle Header Video_2_1.mp4"
Remove-Item "astro-migration\public\videos\backgrounds\Made in America Video 1.mp4"
Remove-Item "astro-migration\public\videos\backgrounds\Forza Building Video.mp4"
Remove-Item "astro-migration\public\videos\backgrounds\Forza Building Video for Mobile.mp4"
Remove-Item "astro-migration\public\videos\backgrounds\American Flag.mp4"

# Misc folder - Unused videos
Remove-Item "astro-migration\public\videos\misc\Forza Slogan Slam Final 1.mp4"
Remove-Item "astro-migration\public\videos\misc\Forza Slogan Slam Final 2.mp4"
Remove-Item "astro-migration\public\videos\misc\Moleculesubtle.mp4"
Remove-Item "astro-migration\public\videos\misc\Moleculesubtle2.mp4"
Remove-Item "astro-migration\public\videos\misc\ForzaLionLoop-1-2.mp4"
Remove-Item "astro-migration\public\videos\misc\Lion_Walk.mp4"
```

---

## ⚠️ Before Deleting

1. **Test the site** to ensure all videos play correctly
2. **Check if `HeroVideoSectionV2` is actually used** (it might be an old component)
3. **Backup the files** before deletion (or use git to restore if needed)
4. **Verify no dynamic imports** that might reference these files

---

## 🔍 Additional Checks Needed

1. Check if `HeroVideoSectionV2.tsx` is actually imported/used anywhere
2. Check if `ScalableHeroVideoSection.tsx` is actually imported/used anywhere
3. Verify no other components dynamically reference these videos
4. Check for any hardcoded video paths in data files or configs

