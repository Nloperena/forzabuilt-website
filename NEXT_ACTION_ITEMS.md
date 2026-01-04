# Next Action Items - Astro Migration Project

## ✅ Completed Actions

1. ✅ Deleted unused videos (~512 MB saved)
2. ✅ Removed unused HeroVideoSectionV2 component
3. ✅ Identified all used vs unused assets

---

## 🎯 Next Priority Actions

### 1. Video Compression (HIGH PRIORITY) 🎬

**Status:** Videos cleaned up, now need compression  
**Remaining Video Size:** 252.6 MB (after cleanup)  
**Target:** ~40-60 MB after compression  
**Potential Savings:** ~192-212 MB

#### Videos to Compress (Largest First):

1. **`Eagle Header Video.mp4`** (~54 MB)
   - Used in: contact page, HeroVideoSection, EagleHeroVideo
   - **Target:** 3-5 MB after compression

2. **`Manufactured in America.mp4`** (~42 MB)
   - Used in: MadeInAmericaSection
   - **Target:** 2-4 MB after compression

3. **`Industry Summary Video for Mobile.mp4`** (~27 MB)
   - Used in: industries/index page
   - **Target:** 2-3 MB after compression

4. **`Forza Building Video for Desktop.mp4`** (~18 MB)
   - Used in: about page
   - **Target:** 1-2 MB after compression

5. **`ForzaTurbineLoop-Compressed.mp4`** (~16 MB)
   - Used in: transportation industry
   - **Target:** 1-2 MB after compression

6. **`Product Summary Page Video.mp4`** (~16 MB)
   - Used in: products/index, ApproachSectionUnified
   - **Target:** 1-2 MB after compression

7. **`Industry Summary Page Video.mp4`** (~14 MB)
   - Used in: industries/index, ApproachSectionUnified
   - **Target:** 1-2 MB after compression

8. **`ForzaBoatLoop-Compressed.mp4`** (~13 MB)
   - Used in: marine industry
   - **Target:** 1-2 MB after compression

9. **`Eagle Header Video_2.mp4`** (~17 MB) - WAIT, check if this still exists
   - If it exists and is unused, DELETE instead of compress

10. **All remaining videos** - Continue compressing in size order

#### Adobe Media Encoder Settings:

**Format:** H.264  
**Bitrate:** VBR, 2 pass  
**Target Bitrate:** 5-8 Mbps  
**Audio:** AAC, 128 kbps  
**Target File Size:** 1-5 MB per video (depending on original size)

**Time Estimate:** 2-3 hours  
**Savings:** ~70-76 MB

---

### 2. PDF Document Compression (HIGH PRIORITY) 📄

**Status:** Need to compress PDF documents  
**Current Size:** 255.96 MB  
**Target:** ~80-130 MB after compression  
**Potential Savings:** ~125-175 MB

#### Action Steps:

1. **Check PDF sizes** in `astro-migration/public/documents/`
2. **Compress with Ghostscript:**
   ```bash
   gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=output.pdf input.pdf
   ```
3. **Test PDF readability** after compression
4. **Replace originals** with compressed versions

**Time Estimate:** 1-2 hours  
**Savings:** ~135-185 MB

---

### 3. Image Optimization (MEDIUM PRIORITY) 🖼️

**Status:** Need to check current image sizes  
**Estimated Size:** ~188 MB (combined images + product-images)  
**Target:** ~100-130 MB after optimization  
**Potential Savings:** ~58-88 MB

#### Action Steps:

1. **Convert to WebP format:**
   - WebP is 25-35% smaller than PNG/JPG
   - Keep originals as fallback for older browsers

2. **Compress existing images:**
   - Use tools like `sharp`, `imagemin`, or `tinypng`
   - Target: 80-90% quality for web

3. **Optimize product images** (if large):
   - Product images are often the largest
   - Consider responsive images (multiple sizes)

**Time Estimate:** 2-3 hours  
**Savings:** ~58-88 MB

---

### 4. Node Modules Audit (LOW PRIORITY) 📦

**Status:** Already in .gitignore, but can optimize  
**Estimated Size:** ~375 MB  
**Target:** ~295-345 MB after cleanup  
**Potential Savings:** ~30-80 MB

#### Action Steps:

1. **Audit unused packages:**
   ```bash
   npx depcheck
   ```

2. **Remove unused Radix UI packages** (if any)

3. **Review large dependencies** for alternatives

**Time Estimate:** 30-60 minutes  
**Savings:** ~30-80 MB

---

### 5. Source Code Cleanup (LOW PRIORITY) 💻

**Status:** Already cleaned up unused components  
**Current Size:** ~137 MB  
**Potential Further Savings:** ~10-20 MB

#### Action Steps:

1. **Check for unused data files** in `src/data/`
2. **Review large assets** in `src/assets/`
3. **Remove any remaining unused components**

**Time Estimate:** 1 hour  
**Savings:** ~10-20 MB

---

## 📊 Prioritized Action Plan

### Phase 1: Quick Wins (Do First) ⚡

1. **Verify & Delete 2 Potentially Unused Videos** (5 min)
   - Files: ForzaLionLoop-1-2.mp4, Lion_Walk.mp4 (~9 MB)
   - Action: Double-check usage, then delete if unused
   - Savings: ~9 MB
   - Impact: Low (small files)
   - Risk: Low (verify first)

2. **Compress Top 5 Largest Videos** (2-3 hours)
   - Files: Eagle Header Video, Manufactured in America, Industry Summary Mobile, Forza Building Desktop, ForzaTurbineLoop
   - Savings: ~100-120 MB
   - Impact: High
   - Risk: Low (test playback after compression)

3. **Compress All PDF Documents** (1-2 hours)
   - Current: 255.96 MB → Target: 80-130 MB
   - Savings: ~125-175 MB
   - Impact: Very High
   - Risk: Low (test readability after compression)

**Phase 1 Total Savings:** ~234-304 MB  
**Phase 1 Time:** 3-5 hours

---

### Phase 2: Medium Impact (Do Next) 📈

3. **Compress Remaining Videos** (1-2 hours)
   - Savings: ~20-30 MB
   - Impact: Medium
   - Risk: Low

4. **Convert Images to WebP** (2-3 hours)
   - Savings: ~50-70 MB
   - Impact: Medium-High
   - Risk: Medium (need fallback for older browsers)

**Phase 2 Total Savings:** ~70-100 MB  
**Phase 2 Time:** 3-5 hours

---

### Phase 3: Long-term Optimization (Optional) 🔄

5. **Node Modules Audit** (30-60 min)
   - Savings: ~30-80 MB
   - Impact: Low-Medium
   - Risk: Low (test after removal)

6. **Further Source Code Cleanup** (1 hour)
   - Savings: ~10-20 MB
   - Impact: Low
   - Risk: Low

**Phase 3 Total Savings:** ~40-100 MB  
**Phase 3 Time:** 1.5-2.5 hours

---

## 🎯 Recommended Next Steps (This Week)

### Today/Tomorrow:
1. ✅ **DONE:** Delete unused videos
2. 🔄 **NEXT:** Compress top 5 largest videos
3. 🔄 **NEXT:** Compress all PDF documents

### This Week:
4. Compress remaining videos
5. Convert images to WebP format
6. Test site after all optimizations

### Optional (Later):
7. Node modules audit
8. Further source code cleanup

---

## 📝 Tools & Commands Needed

### Video Compression:
- **Adobe Media Encoder** (recommended)
- Or **FFmpeg**: `ffmpeg -i input.mp4 -c:v libx264 -crf 25 -preset slow -c:a aac -b:a 128k output.mp4`

### PDF Compression:
- **Ghostscript**: `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=output.pdf input.pdf`

### Image Optimization:
- **Sharp** (Node.js): `sharp input.jpg -q 80 -o output.webp`
- **imagemin** (Node.js): `npx imagemin images/* --out-dir=optimized --plugin=webp`
- **TinyPNG** (Online): https://tinypng.com/

### Package Audit:
- **depcheck**: `npx depcheck`
- **npm-check**: `npx npm-check`

---

## 📊 Total Potential Savings Summary

| Phase | Actions | Time | Savings |
|-------|---------|------|---------|
| Phase 1 | Verify unused + Videos (top 5) + PDFs | 3-5 hours | ~234-304 MB |
| Phase 2 | Videos (remaining) + Images | 3-5 hours | ~90-120 MB |
| Phase 3 | Node modules + Code cleanup | 1.5-2.5 hours | ~40-100 MB |
| **TOTAL** | **All optimizations** | **7.5-12.5 hours** | **~364-524 MB** |

---

## ⚠️ Important Notes

1. **Always test after compression** - Verify videos play correctly and PDFs are readable
2. **Keep backups** - Use git to track changes, easy to revert if needed
3. **Test on multiple browsers** - Ensure WebP images have fallbacks
4. **Monitor site performance** - Check loading times after optimizations
5. **Start with largest files** - Maximum impact with minimum effort

---

**Last Updated:** After unused video deletion verification  
**Current Video Size:** 252.6 MB (verified, 17 files remaining)  
**Current PDF Size:** 255.96 MB (verified)  
**Current Image Size:** 188.16 MB (verified)  
**Next Priority:** Verify 2 misc videos → Compress videos → Compress PDFs

